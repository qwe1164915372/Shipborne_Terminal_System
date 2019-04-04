function creat_user(id, username, password, identity) {
    function Users(id, username, password, identity) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.identity = identity;
    }
    Users.prototype.operation1 = '编辑';
    Users.prototype.operation2 = '删除';
    return new Users(id, username, password, identity)
}

function creat_device(ip, devicename, belong_to) {
    function Devices(ip, devicename, belong_to) {
        this.ip = ip;
        this.devicename = devicename;
        this.belong_to = belong_to;
    }
    Devices.prototype.operation1 = '编辑';
    Devices.prototype.operation2 = '删除';
    return new Devices(ip, devicename, belong_to)
}


function sm_display_UserorDevice(listinput, UserorDevice) {
    console.log('展现listinput', listinput);
    $(`#system_management .manage_area .${UserorDevice} .content_list table tbody`).children().remove();
    if (UserorDevice == 'manageUser') {
        listinput.forEach(element => {
            $(`#system_management .manage_area .${UserorDevice} .content_list table tbody`).append(
                `<tr>
                    <td>${element.id}</td>
                    <td>${element.username}</td>
                    <td>${element.identity}</td>
                    <td>
                        <a class="edit">${element.operation1}</a>
                        <a class="delete">${element.operation2}</a>
                    </td>
                </tr>`
            );
        });
    } else {
        listinput.forEach(element => {
            $(`#system_management .manage_area .${UserorDevice} .content_list table tbody`).append(
                `<tr>
                    <td>${element.ip}</td>
                    <td>${element.devicename}</td>
                    <td>${element.belong_to}</td>
                    <td>
                        <a class="edit">${element.operation1}</a>
                        <a class="delete">${element.operation2}</a>
                    </td>
                </tr>`
            )
        });
    }
    $(`#system_management .manage_area .${UserorDevice} .content_list table tbody`).children().last().children().css('border-bottom', '1px solid black');

    if (listinput.length < 8) {
        let ave_height = $(`#system_management .manage_area .${UserorDevice} .content_list table tr`).css('height');
        for (let i = 0; i < 8 - listinput.length; i++) {
            $(`#system_management .manage_area .${UserorDevice} .content_list table tbody`).append(
                `<tr style="height:${ave_height};"></tr>`
            )
        }
    }
    $(`#system_management .manage_area .${UserorDevice} .content_list table tbody tr td a`).css('cursor', 'pointer');
}

function sm_managefunction_click(allUsers, allDevices) {
    sm_page_click(allUsers, 'manageUser');
    sm_page_click(allDevices, 'manageDevice');
    $('#system_management .managefunction_list').children().first().css('background-color', '#CD2626');
    sm_display_UserorDevice(allUsers.slice(0, 8), 'manageUser');
    $('#system_management .managefunction_list').children().on(
        'click',
        function () {
            $(this).siblings().css('background-color', '#595959');
            $(this).css('background-color', '#CD2626');
            if ($(this).attr('class') == 'User_choose') {
                $('#system_management .manage_area .manageDevice').css('display', 'none');
                $('#system_management .manage_area .manageUser').css('display', 'flex');
                let user_list = allUsers.slice(0, 8);
                sm_display_UserorDevice(user_list, 'manageUser');
            } else if ($(this).attr('class') == 'Device_choose') {
                $('#system_management .manage_area .manageUser').css('display', 'none');
                $('#system_management .manage_area .manageDevice').css('display', 'flex');
                let device_list = allDevices.slice(0, 8);
                sm_display_UserorDevice(device_list, 'manageDevice');
            }
            $('#system_management .manage_area .content_list .turning_page .page_num').text(1);
        }
    )
}

function sm_page_click(inputlist, UserorDevice) {
    $(`#system_management .manage_area .${UserorDevice} .content_list .turning_page`).on(
        'click',
        '.turning_button',
        function () {
            let page_num = Number($(`#system_management .manage_area .${UserorDevice} .content_list .page_num`).text());//当前页码
            if ($(this).next().length == 0) {
                if (page_num != 1) {
                    sm_display_UserorDevice(inputlist.slice(8 * (page_num - 2), 8 * (page_num - 1)), UserorDevice);
                    $(`#system_management .manage_area .${UserorDevice} .content_list .page_num`).text(page_num - 1);
                }
            } else if ($(this).prev().length == 0) {
                if (page_num != Math.ceil(inputlist.length / 8)) {
                    if (page_num == Math.ceil(inputlist.length / 8) - 1) {
                        last_list = inputlist.slice(8 * page_num, inputlist.length);
                        sm_display_UserorDevice(last_list, UserorDevice);
                    } else {
                        sm_display_UserorDevice(inputlist.slice(8 * page_num, 8 * (page_num + 1)), UserorDevice);
                    }
                    $(`#system_management .manage_area .${UserorDevice} .content_list .page_num`).text(page_num + 1);
                }
            }
        }
    )
}

function sm_add_users_devices(allUsers, allDevices) {
    $('#system_management .manage_area .add_button').children().on(
        'click',
        function () {
            let itemclass = $(this).attr('class') == 'add_user' ? '用户' : '设备'
            if (itemclass == '用户') {
                sm_showModelwindow(itemclass, allUsers);
            } else {
                sm_showModelwindow(itemclass, allDevices);
            }
        }
    )
}

function sm_showModelwindow(itemclass, allUorD, UorDiteminfo = {}) {
    let info = {
        info1: '',
        info2: '',
        info3: '',
    }
    if (itemclass == '用户') {
        info['info1'] = '用户名';
        info['info2'] = '密码';
        info['info3'] = '身份';
    } else {
        info['info1'] = 'ip';
        info['info2'] = '设备名';
        info['info3'] = '所属船舰';
    }
    $('body #system_management').css({
        opacity: 0.2
    })
    $('body').append('<div class="model_body"></div>');

    $('body .model_body').css({
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 1,
        // 'z-index':1049
    })

    $('body .model_body').append('<div class="model_window"></div>');
    $('body .model_body .model_window').css('margin', '20px 0;');
    $('body .model_body .model_window').append(
        `<div class="window_function">
            <span>x</span>
            <h4>添加${itemclass}</h4>
        </div>`,
        `<form id="model_window_submit">
            <div class="window_content">
                <div class="content_item">
                    <div>${info['info1']}</div>
                    <input type="text" name='info1' value="${UorDiteminfo['iteminfo1'] ? UorDiteminfo['iteminfo1'] : ''}">
                </div>
                <div class="content_item">
                    <div>${info['info2']}</div>
                    <input type="text" name='info2' value="${UorDiteminfo['iteminfo2'] ? UorDiteminfo['iteminfo2'] : ''}">
                </div>
                
            </div>
            <div class="window_confirm">
                <button>确定</button>
            </div>
        </form>`,
    );
    if (itemclass == '用户') {
        $('body .model_body .model_window .window_content').append(
            `<div class="content_item">
                <div>${info['info3']}</div>
                <select name='info3' value="daministrator">
                    <option value="ordinary_user">普通用户</option>
                    <option value="administrator">管理员</option>
                </select>
            </div>`
        )
    } else {
        $('body .model_body .model_window .window_content').append(
            `<div class="content_item">
                <div>${info['info3']}</div>
                <input type="text" name='info3' value="${UorDiteminfo['iteminfo3'] ? UorDiteminfo['iteminfo3'] : ''}">
            </div>`
        )
    }
    if (UorDiteminfo['iteminfo3'] && itemclass == '用户') {
        if (UorDiteminfo['iteminfo3'] == 'ordinary_user') {
            $('body .model_body .model_window .window_content select').children().first().attr('selected', 'selected');
        } else {
            $('body .model_body .model_window .window_content select').children().last().attr('selected', 'selected');
        }
    }
    //$('body #content_whole').css('z-index',50);
    $('body .model_body .model_window').css({
        border: '1px solid black',
        position: 'fixed',
        top: '26%',
        left: '35%',
        width: '400px',
        'min-width': '380px',
        'background-color': 'white'
        // 'z-index' : 1050
    });
    $('body .model_body .model_window .window_function').css({
        padding: '15px'
    });
    $('body .model_body .model_window .window_function:before').css({
        content: '',
        display: 'table'
    });
    $('body .model_body .model_window .window_function:after').css({
        content: '',
        display: 'table',
        clear: 'both'
    });
    $('body .model_body .model_window .window_function span').css({
        float: 'right',
        'font-size': '30px',
        'font-weight': 'normal',
        'line-height': 0.8,
        'margin-top': '-8px',
        outline: 'none',
        cursor: 'pointer'
    });
    $('body .model_body .model_window .window_function h4').css({
        float: 'left',
        margin: 0
    });
    $('body .model_body .model_window .window_content .content_item').css({
        padding: '5px',
        margin: '10px'
    });
    $('body .model_body .model_window .window_content .content_item div').css({
        width: '30%',
        display: 'inline-block'
    });
    $('body .model_body .model_window .window_content .content_item input').css({
        display: 'inline-block',
        autocomplete: 'off'
    });
    if (UorDiteminfo['iteminfo4'] == 'edit') {
        $('body .model_body .model_window .window_content .content_item input').first().attr('readonly', 'true');
    }
    $('body .model_body .model_window .window_content .content_item').last().children('select').css(
        {
            display: 'inline-block',
            width: $('body .model_body .model_window .window_content .content_item').last().children('select').parent().prev().children('input').css('width'),
            //height: $('body .model_body .model_window .window_content .content_item').last().children('select').parent().prev().children('input').css('height'),
            padding: $('body .model_body .model_window .window_content .content_item').last().children('select').parent().prev().children('input').css('padding'),
        }
    );
    $('body .model_body .model_window .window_confirm').css({
        float: 'right',
        padding: '15px'
    });
    $('body .model_body .model_window .window_confirm button').css({
        'font-size': '1.2em',
        outline: 'none',
        'background-color': '#949494',
        border: 'none',
        cursor: 'pointer'
    });
    $('body').on(
        'click',
        '.model_body .model_window .window_function span',
        function () {
            $('body #system_management').css('opacity', 1);
            $('body .model_body').remove();
            console.log(document.getElementsByClassName('button_confirmsadasd'));
        }
    );
    $('#model_window_submit').submit(function () {
        let newappended = $(this).serializeArray();
        switch (itemclass) {
            case '用户': {
                if (newappended[0].value == '') {
                    alert('请输入用户名');
                    return false
                } else if (newappended[1].value == '') {
                    alert('请输入密码');
                    return false
                } else if (newappended[2].value == '') {
                    alert('请输入用户身份');
                    return false
                }
                break;
            }
            case '设备': {
                if (newappended[0].value == '') {
                    alert('请输入设备ip');
                    return false
                } else if (newappended[1].value == '') {
                    alert('请输入设备名');
                    return false
                } else if (newappended[2].value == '') {
                    alert('请输入设备所属船舰');
                    return false
                }
                break;
            }
        }
        let tableName = itemclass == '用户' ? 'users' : 'devices';
        let delete_ele_belongto = itemclass == '用户' ? 'manageUser' : 'manageDevice';
        let curr_num = $(`#system_management .manage_area .${delete_ele_belongto} .content_list .turning_page .page_num`).text();
        $.ajax({
            type: 'POST',
            url: `http://localhost:5000/${UorDiteminfo['iteminfo4'] == undefined ? 'add_data' : 'edit_data'}`,
            contentType: "application/x-www-form-urlencoded,dataset=utf-8",
            data: $(this).serialize() + `&tablename=${tableName}`,
            dataType: 'JSON',
            success: function (result) {
                console.log(result);
                if (result == 'fail to create users') {
                    alert('用户名已有，创建失败。');
                    return false
                } else if (result == 'fail to create :ip') {
                    alert('ip已创建，创建失败。');
                    return false
                } else if (result == 'fail to create :username') {
                    alert('username已有，创建失败。');
                    return false
                } else if (result == 'fail to create :devicename') {
                    alert('设备名已有，创建失败。');
                    return false
                } else if (result.substring(0, 25) == 'success to create newuser') {
                    console.log('添加成功');
                    let newid = Number(result.replace(/[^0-9]/ig, ''));
                    $('body #system_management').css('opacity', 1);
                    $('body .model_body').remove();
                    allUorD.push(creat_user(newid, newappended[0].value, newappended[1].value, newappended[2].value));
                    sm_display_UserorDevice(allUorD.slice((curr_num - 1) * 8, curr_num * 8), delete_ele_belongto);
                } else if (result == 'success to create newdevice') {
                    console.log('添加成功');
                    $('body #system_management').css('opacity', 1);
                    $('body .model_body').remove();
                    allUorD.push(creat_device(newappended[0].value, newappended[1].value, newappended[2].value));
                    sm_display_UserorDevice(allUorD.slice((curr_num - 1) * 8, curr_num * 8), delete_ele_belongto);
                } else if (result.substring(0, 25) == 'success to update newuser') {
                    console.log('更新用户成功');
                    let newid = Number(result.replace(/[^0-9]/ig, ''));
                    $('body #system_management').css('opacity', 1);
                    $('body .model_body').remove();
                    let edititem = creat_user(newid, newappended[0].value, newappended[1].value, newappended[2].value);
                    console.log(edititem);
                    for (let i = 0; i < allUorD.length; i++) {
                        if (allUorD[i].username == edititem.username) {
                            allUorD[i] = edititem;
                            break;
                        }
                    }
                    sm_display_UserorDevice(allUorD.slice((curr_num - 1) * 8, curr_num * 8), delete_ele_belongto);
                } else if (result == 'fail to update devices') {
                    console.log('更新失败设备名重复');
                    alert('设备名已有，创建失败。');
                    return false
                } else if (result.substring(0, 27) == 'success to update newdevice') {
                    console.log('更新设备成功');
                    $('body #system_management').css('opacity', 1);
                    $('body .model_body').remove();
                    let edititem = creat_device(newappended[0].value, newappended[1].value, newappended[2].value);
                    console.log(edititem);
                    for (let i = 0; i < allUorD.length; i++) {
                        if (allUorD[i].ip == edititem.ip) {
                            allUorD[i] = edititem;
                            break;
                        }
                    }
                    sm_display_UserorDevice(allUorD.slice((curr_num - 1) * 8, curr_num * 8), delete_ele_belongto);
                }
            }
        })
        return false;
    })
}

function sm_showdeleteModelwindow(iteminfo, allUsers, allDevices) {
    console.log('这是输入的数据：',iteminfo);
    let delete_ele_belongto = iteminfo['iteminfo2'] == 'users' ? 'manageUser' : 'manageDevice';
    let curr_num = $(`#system_management .manage_area .${delete_ele_belongto} .content_list .turning_page .page_num`).text();
    $('body #system_management').css({
        opacity: 0.2
    })
    $('body').append(`<div class="model_body">
                        <div class="model_window">
                            <div class="window_function">
                                <span>x</span>
                                <h4>确定删除</h4>
                            </div>
                            <div class="window_confirm">
                                <div class="button_cancel">
                                    <button>取消</button>
                                </div>
                                <div class="button_confirm">
                                    <button>确定</button>
                                </div>
                            </div>
                        </div>
                    </div>`);
    $('body .model_body').css({
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 1,
        // 'z-index':1049
    });
    $('body .model_body .model_window').css({
        width: '220px',
        "min-width": '200px',
        height: '130px',
        "min-height": '120px',
        border: '1px solid black',
        position: 'fixed',
        top: '35%',
        left: '45%',
        'background-color': 'white'
        // 'z-index' : 1050
    });
    $('body .model_body .model_window .window_function').css({
        padding: '15px'
    });
    $('body .model_body .model_window .window_function:before').css({
        content: '',
        display: 'table'
    });
    $('body .model_body .model_window .window_function:after').css({
        content: '',
        display: 'table',
        clear: 'both'
    });
    $('body .model_body .model_window .window_function span').css({
        float: 'right',
        'font-size': '30px',
        'font-weight': 'normal',
        'line-height': 0.8,
        'margin-top': '-8px',
        outline: 'none',
        cursor: 'pointer'
    });
    $('body .model_body .model_window .window_function h4').css({
        float: 'left',
        margin: 0
    });
    $('body .model_body .model_window .window_confirm').css({
        width: '100%',
        display: 'flex',
        "justify-content": 'space-around',
        position: 'absolute',
        bottom: '10px',
        padding: '15px 0',
    });
    $('body .model_body .model_window .window_confirm button').css({
        'font-size': '1.2em',
        outline: 'none',
        'background-color': '#949494',
        border: 'none',
        cursor: 'pointer'
    });
    $('body').on(
        'click',
        '.model_body .model_window .window_function span',
        function () {
            $('body #system_management').css('opacity', 1);
            $('body .model_body').remove();
            $('body').off('click');
            console.log(document.getElementsByClassName('button_confirmsadasd'));
        }
    );
    $('body').on(
        'click',
        '.model_body .model_window .window_confirm .button_cancel',
        function () {
            $('body #system_management').css('opacity', 1);
            $('body .model_body').remove();
            $('body').off('click');
            console.log(document.getElementsByClassName('button_confirmsadasd'));
        }
    );
    $('body').on(
        'click',
        '.model_body .model_window .window_confirm .button_confirm',
        function () {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:5000/delete_data',
                contentType: "application/json,dataset=utf-8",
                data: JSON.stringify(iteminfo),
                dataType: 'JSON',
                success: function (result) {
                    console.log(result);
                    if (result == 'success to delete') {
                        if (iteminfo['iteminfo2'] == 'users') {
                            for (let i = 0; i < allUsers.length; i++) {
                                if (allUsers[i].username == iteminfo['iteminfo1']) {
                                    allUsers.splice(i, 1);
                                    break;
                                }
                            }
                            $('body #system_management').css('opacity', 1);
                            $('body .model_body').remove();
                            sm_display_UserorDevice(allUsers.slice((curr_num - 1) * 8, curr_num * 8), delete_ele_belongto);
                        } else if (iteminfo['iteminfo2'] == 'devices') {
                            for (let i = 0; i < allDevices.length; i++) {
                                if (allDevices[i].ip == iteminfo['iteminfo1']) {
                                    allDevices.splice(i, 1);
                                    break;
                                }
                            }
                            $('body #system_management').css('opacity', 1);
                            $('body .model_body').remove();
                            sm_display_UserorDevice(allDevices.slice((curr_num - 1) * 8, curr_num * 8), delete_ele_belongto);
                        }
                    }
                }
            })
            $('body #system_management').css('opacity', 1);
            $('body .model_body').remove();
        }
    );
}

function sm_editUD(allUsers, allDevices) {
    $('#system_management .manage_area .content_list table tbody').on(
        'click',
        'tr td .edit',
        function () {
            if (true) {   ///需要管理员登录才能编辑和删除
                let itemclass = $(this).parents('.content_list').parent().attr('class') == 'manageUser' ? "用户" : '设备';
                let iteminfo = {
                    iteminfo1: itemclass == '用户' ? $($(this).parent().siblings()[1]).text() : $($(this).parent().siblings()[0]).text(),
                    iteminfo2: itemclass == '用户' ? '' : $($(this).parent().siblings()[1]).text(),
                    iteminfo3: $($(this).parent().siblings()[2]).text(),
                    iteminfo4: 'edit'
                };
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:5000/getiteminformation',
                    contentType: "application/json,dataset=utf-8",
                    data: JSON.stringify({
                        classname: itemclass,
                        info: iteminfo.iteminfo1,
                        add_or_edit: iteminfo.iteminfo4
                    }),
                    dataType: 'JSON',
                    success: function (result) {
                        if (result) {
                            if (itemclass == '用户') {
                                iteminfo.iteminfo2 = result.password;
                                sm_showModelwindow(itemclass, allUsers, iteminfo);
                            } else {
                                iteminfo.iteminfo2 = result.devicename;
                                sm_showModelwindow(itemclass, allDevices, iteminfo);
                            }
                        }
                    }
                })
            }
        }
    )
    $('#system_management .manage_area .content_list table tbody').on(
        'click',
        'tr td .delete',
        function () {
            let itemclass = $(this).parents('.content_list').parent().attr('class') == 'manageUser' ? "users" : 'devices';
            let iteminfo = {
                iteminfo1: itemclass == 'users' ? $($(this).parent().siblings()[1]).text() : $($(this).parent().siblings()[0]).text(),
                iteminfo2: itemclass
            };
            console.log(iteminfo);
            sm_showdeleteModelwindow(iteminfo, allUsers, allDevices);
            // $.ajax({
            //     type: 'POST',
            //     url: 'http://localhost:5000/delete_data',
            //     contentType: "application/json,dataset=utf-8",
            //     data: JSON.stringify(iteminfo),
            //     dataType: 'JSON',
            //     success: function (result) {
            //         if (result) {
            //             console.log(result);
            //         }
            //     }
            // })
        }
    )
}

$(document).ready(
    function () {
        let allUsers = [];
        let allDevices = [];
        $.ajax({
            url: 'http://localhost:5000/get_user_devices',
            type: 'GET',
            // contentType:'application/json,dataset=utf-8',
            // data:'users_devices',
            dataType: 'JSON',
            success: function (result) {
                if (result) {
                    result.users.forEach((value, index) => {
                        allUsers[index] = creat_user(value.id, value.username, value.password, value.identity)
                    })
                    result.devices.forEach((value, index) => {
                        allDevices[index] = creat_device(value.ip, value.devicename, value.belong_to);
                    })
                    sm_managefunction_click(allUsers, allDevices);
                }
            }
        })
        sm_add_users_devices(allUsers, allDevices);
        sm_editUD(allUsers, allDevices)
    }
)