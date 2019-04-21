from flask import Flask, render_template, request
from flask_cors import cross_origin
import testajax
import json
import datetime
import re
import threading
from ftp_read_test import FtpReader
import ftp_scanner
import pymysql
import contextlib

app = Flask(__name__)


def scanner():
    def sub_scanner(active_list, target_host, port=21):
        if ftp_scanner.scanner(target_host, port):
            active_list.append(target_host)

    global device_dict
    active_list = []
    device_name = 1
    result = {}
    port = 21
    thread_pool = []
    # 多线程扫描
    for i in range(100, 251):
        ip = "192.168.1." + str(i)
        sub_thread = threading.Thread(
            target=sub_scanner, args=(active_list, ip, port))
        thread_pool.append(sub_thread)
        sub_thread.start()
    # 等待线程结束
    for t in thread_pool:
        t.join()

    for device in active_list:
        name_device = "device" + str(device_name)
        result.update({name_device: device})
        device_name += 1
    return result


# def generate_ftp(devices):
#     global device_dict
#     for device in devices.values():
#         device_dict[device] = FtpReader(server=device)

@app.route('/', methods=["GET", "POST"])
@cross_origin()
def index():
    return render_template('index.html')



@app.route('/display_data', methods=["GET", "POST"])
@cross_origin()
def display_data():
    if request.method == 'POST':
        data = request.get_json()
        print('这是data', data)
        start_time = re.sub("\D", "", data['timeQuantum'])
        time = datetime.datetime.strptime(
            data['timeQuantum'], "%Y-%m-%d %H:%M:%S")

        if data['tableName'] == 'beidou':  # 北斗每小时展现
            time_difference = datetime.timedelta(hours=1)
            end_time = re.sub(
                "\D", "", (time+time_difference).strftime('%Y-%m-%d %H:%M:%S'))
            return testajax.readFromSqlite(data['path'], "*", data['tableName'], start_time, end_time)
        elif data['tableName'] == 'gps':  # gps 每分钟展现
            time_difference = datetime.timedelta(minutes=1)
            end_time = re.sub(
                "\D", "", (time+time_difference).strftime('%Y-%m-%d %H:%M:%S'))
            return testajax.readFromSqlite(data['path'], "*", data['tableName'], start_time, end_time)
        elif data['tableName'] == 'received':  # received  拿到每小时的数据  全部展现
            time_difference = datetime.timedelta(hours=1)
            #end_time = re.sub("\D", "", time+time_difference.strftime('%Y-%m-%d %H:%M:%S'))
            end_time = re.sub("\D", "", (time + time_difference).strftime('%Y-%m-%d %H:%M:%S'))
            print('展示receive')
            print(start_time)
            print(end_time)
            return testajax.readReceived(data['path'], data['Parameter'], data['tableName'], start_time, end_time)
        elif data['tableName'] == 'shelter':  # shelter  每30分钟展现   一次拿一天
            start_time = datetime.datetime.combine(time, datetime.time.min)
            end_time = start_time + datetime.timedelta(days = 1)
            time_difference = datetime.timedelta(minutes=30)
            next_time = start_time + time_difference
            sql_time = [re.sub(
                "\D", "", start_time.strftime('%Y-%m-%d %H:%M:%S'))]
            while next_time != end_time:
                sql_time.append(re.sub("\D", "", next_time.strftime('%Y-%m-%d %H:%M:%S')))
                next_time = next_time + time_difference
            sql_time.append(re.sub("\D", "", end_time.strftime('%Y-%m-%d %H:%M:%S')))
            print(data['Parameter'])
            return testajax.read_shelter(data['path'],data['Parameter'], data['tableName'], sql_time)
        else:                                  #windmeter   每10分钟展现  全部拿到
            end_time = re.sub("\D", "", (time + datetime.timedelta(minutes = 10)).strftime('%Y-%m-%d %H:%M:%S'))
            print(start_time)
            print(end_time)
            return testajax.read_windmeter(data['path'],'*', data['tableName'],start_time, end_time)
    device_list = scanner()
    # generate_ftp(device_list)
    print('这是设备列表', device_list)
    #return render_template('index.html',  device_list=json.dumps(device_list))
    # return render_template('index.html',  device_list=json.dumps('sadasd'))
    # return render_template('video_management.html')
    # return render_template('test2.html')


@contextlib.contextmanager
def mysql(host='localhost', port=3306, user='root', passwd='mfc7570', db='ship', charset='utf8'):
    conn = pymysql.connect(host=host, port=port, user=user,
                           passwd=passwd, db=db, charset=charset)
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
    try:
        yield cursor
    finally:
        conn.commit()
        cursor.close()
        conn.close()


@app.route('/get_user_devices', methods=['GET', 'POST'])
@cross_origin()
def get_user_devices():
    data = request.args.get("data")  # 获取前台json数据
    UD = {}
    with mysql() as cursor:
        cursor.execute("select * from users")
        row_1 = cursor.fetchall()
        cursor.execute("select * from devices")
        row_2 = cursor.fetchall()
        # UD['users'] = row_1
        # UD['devices'] = row_2
        UD.update({
            'users': row_1,
            'devices': row_2
        })
        return json.dumps(UD)

    conn.commit()
    cursor.close()
    conn.close()


@app.route('/add_data', methods=['GET', 'POST'])
@cross_origin()
def add_data():
    if request.method == 'POST':
        newdata = {}
        info1 = request.form.get('info1')
        info2 = request.form.get('info2')
        info3 = request.form.get('info3')
        info4 = request.form.get('tablename')
        newdata.update({
            'info1': info1,
            'info2': info2,
            'info3': info3,
            'info4': info4
        })
        print(newdata)
        with mysql() as cursor:
            row_1 = None
            row_2 = None
            if newdata['info4'] == 'users':
                cursor.execute("select * from users where username = %s", newdata['info1'])
                row_1 = cursor.fetchone()
            else:
                cursor.execute("select * from devices where ip = %s", newdata['info1'])
                row_1 = cursor.fetchone()
                cursor.execute("select * from devices where devicename = %s", newdata['info2'])
                row_2 = cursor.fetchone()
            if row_1:
                if newdata['info4'] == 'users':
                    return json.dumps('fail to create :username')
                else:
                    return json.dumps('fail to create :ip')
            elif row_2:
                return json.dumps('fail to create :devicename')
            if newdata['info4'] == 'users':
                cursor.execute("insert into users(username,password,identity) values(%s,%s,%s)",(newdata['info1'], newdata['info2'], newdata['info3']))
                cursor.execute("select * from users where username = %s",newdata['info1'])
                row_1 = cursor.fetchone()
                return json.dumps('success to create newuser'+ str(row_1['id']))
            else:
                cursor.execute("insert into devices(ip,devicename,belong_to) values(%s,%s,%s)",(newdata['info1'], newdata['info2'], newdata['info3']))
                return json.dumps('success to create newdevice')

        conn.commit()
        cursor.close()
        conn.close()
    return render_template('index.html')

@app.route('/getiteminformation', methods=['GET', 'POST'])
@cross_origin()
def getiteminformation():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        with mysql() as cursor:
            row_1 = None
            if data['classname'] == '用户':
                cursor.execute("select * from users where username = %s",data['info'])
                row_1 = cursor.fetchone()
                return json.dumps(row_1)
            elif data['classname'] == '设备':
                cursor.execute("select * from devices where ip = %s",data['info'])
                row_1 = cursor.fetchone()
                return json.dumps(row_1)

            #conn.commit()
            cursor.close()
            #conn.close()

@app.route('/edit_data', methods=['GET', 'POST'])
@cross_origin()
def edit_data():
    if request.method == 'POST':
        print('刚进入edit_data')
        editdata = {}
        info1 = request.form.get('info1')
        info2 = request.form.get('info2')
        info3 = request.form.get('info3')
        info4 = request.form.get('tablename')
        editdata.update({
            'info1': info1,
            'info2': info2,
            'info3': info3,
            'info4': info4
        })
        print(editdata)
        with mysql() as cursor:
            row_1 = None
            row_2 = None
            print('是不是到了这里')
            if editdata['info4'] == 'users':
                print('到这里啦？')
                cursor.execute("update users set password=%s,identity=%s where username=%s",(editdata['info2'],editdata['info3'],editdata['info1']))
                cursor.execute("select * from users where username = %s",editdata['info1'])
                row_1 = cursor.fetchone()
                return json.dumps('success to update newuser'+ str(row_1['id']))
            elif editdata['info4'] == 'devices':
                print('还是到这里啦？')
                cursor.execute("select * from devices where devicename = %s",editdata['info2'])
                row_1 = cursor.fetchone()
                if(row_1):
                    return json.dumps('fail to update devices')
                # if(row_1['ip'] != editdata['info1']):
                #     return json.dumps('fail to update devices')
                else:
                    cursor.execute("update devices set devicename=%s,belong_to=%s where ip=%s",(editdata['info2'],editdata['info3'],editdata['info1']))
                    return json.dumps('success to update newdevice')

        conn.commit()
        cursor.close()
        conn.close()

@app.route('/delete_data', methods=['GET', 'POST'])
@cross_origin()
def delete_data():
    if request.method == 'POST':
        print('刚进入delete_data')
        deletedata = request.get_json()
        print(deletedata)
        with mysql() as cursor:
            if deletedata['iteminfo2'] == 'users':
                cursor.execute("delete from users where username = %s",deletedata['iteminfo1'])
                return json.dumps("success to delete")
            else:
                cursor.execute("delete from devices where ip = %s",deletedata['iteminfo1'])
                return json.dumps("success to delete")
            

        conn.commit()
        cursor.close()
        conn.close()
    

if __name__ == '__main__':
    app.run()
