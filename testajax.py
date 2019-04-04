import sqlite3 as db
import json

# 从SQLite文件中读取数据
def readFromSqlite( db_path, paragraph, tableName,start_time,end_time):
    conn = db.connect(db_path)  # 该 API 打开一个到 SQLite 数据库文件 database 的链接，如果数据库成功打开，则返回一个连接对象
    cursor = conn.cursor()  # 该例程创建一个 cursor，将在 Python 数据库编程中用到。
    conn.row_factory = db.Row  # 可访问列信息
    cursor.execute("select " + paragraph + " from " + tableName + " where time >=?and time <=?",(start_time,end_time))  # 该例程执行一个 SQL 语句
    rows = cursor.fetchall()  # 该例程获取查询结果集中所有（剩余）的行，返回一个列表。当没有可用的行时，则返回一个空的列表。
    return json.dumps(rows)


# 解析表中单帧信息
def readFromTableFrame(TableFrame):
    print(TableFrame)
    

# if __name__ == '__main__':
#     rows = readFromSqlite('C://Users//biggerphone//Downloads//project.db', 'strength', 'beidou')
#     readLines = 10
#     lineIndex = 0
#     for row in rows:
#         if lineIndex >= readLines: break
#         content = row
#         readFromTableFrame(content)
#         lineIndex += 1
