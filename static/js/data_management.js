function add_and_click(all_devices_name, father_ele, permanent_ele, self_ele_classname, f) {
    all_devices_name.forEach(function (item, index) {
        $(`#${father_ele} .${permanent_ele}`).append(function () {
            $(`#${father_ele} .${permanent_ele}`).on(
                'click',
                `.${self_ele_classname}${index}`,
                function () {
                    if (f)
                        f(index);
                })
            return `<div class="${self_ele_classname}_item">${typeof (item) == 'string' ? item : '目标未找到'}</div>`;
        })
    })
}

function dm_module_navbar_hover() {
    $('#data_management .top_guide .module_navbar_item').on({
        mouseenter: function () {
            let width = $(this).css('width');
            $(this).addClass('hover');
            $(this).children('.module_list').css({
                'width': width,
                'display': 'block',
                'z-index': 10
            })
        },
        mouseleave: function () {
            $(this).removeClass('hover');
            $(this).children('.module_list').css('display', 'none');
        }
    });
    $('#data_management .top_guide .module_navbar_item .module_list').on(
        'mouseenter',
        'div',
        function () {
            $(this).addClass('parameter_hover');
        }
    )
    $('#data_management .top_guide .module_navbar_item .module_list').on(
        'mouseleave',
        'div',
        function () {
            $(this).removeClass('parameter_hover');
        },
    )
    $('#data_management .top_guide .module_navbar_item .module_list').on(
        'click',
        'div',
        function () {
            $('#data_management .undertop_guide .data_area .parameter .value').text($(this).text())
                .attr('tableName', $(this).parent().siblings('.module_name').text());
        }
    )
}


function dm_device_item_hoverandclick() {
    let upper_ele = $('#data_management .undertop_guide .device_area .device_list');
    upper_ele.on(
        'mouseenter',
        '.device_item',
        function () {
            $(this).css('background', 'blue')
        }
    )
    upper_ele.on(
        'mouseleave',
        '.device_item',
        function () {
            $(this).css('background', '#8A8A8A')
        }
    )
    upper_ele.on(
        'click',
        '.device_item',
        function () {
            $(this).siblings('.device_item_chosen').css('background', '#8A8A8A')
                .addClass('device_item')
                .removeClass('device_item_chosen');
            $(this).css('background', 'black')
            upper_ele.off('mouseleave mouseenter', '.device_item');
            $(this).addClass('device_item_chosen')
                .removeClass('device_item');
            upper_ele.on(
                'mouseenter',
                '.device_item',
                function () {
                    $(this).css('background', 'blue')
                }
            )
            upper_ele.on(
                'mouseleave',
                '.device_item',
                function () {
                    $(this).css('background', '#8A8A8A')
                }
            )
            $('#data_management .undertop_guide .data_area .device_name .value').text($(this).text());
            console.log('to be added');
        }
    )
}

function dm_getData(all_devices, deviceName, tableName, Parameter, timeQuantum) {
    console.log(tableName);
    // let data_url = 'C:/Users/Dominator/Desktop/viewview/source/data/project.db';
    let key,
        tablename,
        parameter;
    // timequantum;
    key = 'device' + deviceName.replace(/[^0-9]/ig, '');
    switch (tableName) {
        case '北斗': tablename = 'beidou'; break;
        case 'GPS': tablename = 'gps'; break;
        case 'Receive': tablename = 'received'; break;
        case '百叶窗': tablename = 'shelter'; break;
        case '风力计': tablename = 'windmeter'; break;
    }
    switch (Parameter) {
        case '信号强度': parameter = 'strength'; break;
        case '经纬度': parameter = { longitude: 'longitude', latitude: 'latitude' }; break;
        case '水流速度': parameter = 'flow_velocity'; break;
        case '水流方向': parameter = 'flow_direction'; break;
        case '浪高': parameter = 'wave_height'; break;
        case '温度': parameter = 'temperature'; break;
        case '湿度': parameter = 'humidity'; break;
        case '大气压': parameter = 'atmosphere'; break;
        case '风速': parameter = 'speed'; break;
        case '风向': parameter = 'direction'; break;
    }
    // switch(tablename){
    //     case 'beidou':break;
    //     case 'gps':break;
    //     case 'received':break;
    //     case 'shelter':break;
    //     case 'windmeter':break;
    // }
    $.ajax({
        url: 'http://localhost:5000/',
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify({ path: all_devices[key], tableName: tablename, Parameter: parameter, timeQuantum: timeQuantum }),
        dataType: 'JSON',
        success: function (result) {
            if (result)
                dm_display_chart(tablename, result);
            // console.log('这是返回的数据', result);
            // console.log('这是返回的数据类型', typeof (result));
            // console.log(result[0]);
            // console.log(typeof (result[0]));
        }
    })
}

function dm_display_strength_chart(data) {
    let xdata = [];
    for (let i = 0; i < data.length; i++) {
        xdata.push(i);
    }
    let ydata = data.map(
        function (item) {
            return item[1].split(',')
        }
    ).map(
        function (it) {
            return Math.max.apply(null, it)
        }
    )
    let myChart = echarts.init(document.getElementById('main'));
    let option = {
        tooltip: {
            show: true
        },
        legend: {
            data: ['10组波束中最大的信号强度，只要大于4表示发射成功']
        },
        xAxis: [
            {
                type: 'category',
                data: xdata
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                "name": "信号强度",
                "type": "bar",
                "data": ydata
            }
        ]
    };
    // 为echarts对象加载数据 
    myChart.setOption(option);
}

function dm_display_coordinate_chart(data) {
    // console.log('播放图表函数');
    var coordinate = data.map(
        function (item) {
            return item.slice(1);
        }
    ).map(
        function (item) {
            return [Number((Number(item[0].replace(/[^0-9.]/ig, '').substring(0, 10)) / 100).toFixed(6)), Number((Number(item[1].replace(/[^0-9.]/ig, '').substring(0, 10)) / 100).toFixed(6))];
        }
    )


    console.log(coordinate);


    let map = new BMap.Map("main");
    map.centerAndZoom(new BMap.Point(coordinate[0][0], coordinate[0][1]), 5);
    //map.centerAndZoom(new BMap.Point(142.599876, 10.540731), 16);
    //map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
    //map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
    map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
    map.enableScrollWheelZoom();


    let points = coordinate.map(
        function (item) {
            return new BMap.Point(item[0], item[1]);
        }
    )

    map.clearOverlays();                        //清除地图上所有的覆盖物
    var curve = new BMapLib.CurveLine(points, { strokeColor: 'blue', strokeWight: 3, strokeOpacity: 0.5 });
    map.addOverlay(curve);
    curve.enableEditing();
    
    $('.anchorBL').css('display','none');
    // setTimeout(function () {
    //     map.setViewport(points);
    //     //调整到最佳视野
    // }, 2000);



}

function dm_display_chart(tablename, data) {
    if (tablename == 'beidou') {
        dm_display_strength_chart(data);
    } else if (tablename == 'gps') {
        console.log('地图函数');
        dm_display_coordinate_chart(data);
    }
}

function choosetime_and_display(all_devices) {
    console.log(jQuery);
    jQuery(function () {
        jQuery('#choose_time').datetimepicker({
            timeFormat: "HH:mm:ss",
            dateFormat: "yy-mm-dd"
        });
    });
    $('body').on(
        'click',
        '.ui-datepicker-close',
        function () {
            let deviceName = $('#data_management .undertop_guide .data_area .device_name .value').text();
            let tableName = '';
            let Parameter = $('#data_management .undertop_guide .data_area .parameter .value').text();
            if ($('#data_management .undertop_guide .data_area .time_quantum input').val() == '') {
                $('.ui-datepicker-current').trigger('click');
            }
            let timeQuantum = $('#data_management .undertop_guide .data_area .time_quantum input').val()
            switch (Parameter) {
                case '信号强度': tableName = '北斗'; break;
                case '经纬度': tableName = 'GPS'; break;
                case '水流速度': tableName = 'Receive'; break;
                case '水流方向': tableName = 'Receive'; break;
                case '浪高': tableName = 'Receive'; break;
                case '温度': tableName = '百叶窗'; break;
                case '湿度': tableName = '百叶窗'; break;
                case '大气压': tableName = '百叶窗'; break;
                case '风速': tableName = '风力计'; break;
                case '风向': tableName = '风力计'; break;
            }
            //let timeQuantum = $('#data_management .undertop_guide .data_area .time_quantum input').val().replace(/[^0-9]/ig, "").substring(0, 12);
            // let timeQuantum = {
            //     startTime:Number(time+'00'),
            //     endTime:(Number(time)+1)*100                
            // }
            //console.log(deviceName);
            //console.log(tableName);
            //console.log(Parameter);
            // console.log(time);
            //console.log(timeQuantum);
            //console.log(all_devices);
            // console.log(all_devices.length);'
            console.log(timeQuantum);
            dm_getData(all_devices, deviceName, tableName, Parameter, timeQuantum);
        }
    )
}

function dm_device_page(all_devices_name) {
    let pageWidth = $('#data_management .undertop_guide .device_area').css('width').replace(/[^0-9]/ig, "");
    ave_pageWidth = pageWidth / 5;    //这是翻页键的宽度
    let l = Math.ceil(all_devices_name.length / 10);  //每10为一组，最后剩下不到10的也为一组
    let remainder = l % 3;      //3个页码键为1组，remainder为不到3的页码
    if (all_devices_name.length > 20) {
        $('#data_management .undertop_guide .device_area .list_page').append(
            `<div class="page_button page_turning" style="width:${ave_pageWidth}px"><</div>`,
            `<div class="page_button page_num page1" style="width:${ave_pageWidth}px">1</div>`,
            `<div class="page_button page_num page2" style="width:${ave_pageWidth}px">2</div>`,
            `<div class="page_button page_num page3" style="width:${ave_pageWidth}px">3</div>`,
            `<div class="page_button page_turning" style="width:${ave_pageWidth}px">></div>`
        );
    } else if (all_devices_name.length <= 10) {
        $('#data_management .undertop_guide .device_area .list_page').append(
            `<div class="page_button page_turning" style="width:${ave_pageWidth}px"><</div>`,
            `<div class="page_button page_num page1" style="width:${ave_pageWidth}px">1</div>`,
            `<div class="page_button page_turning" style="width:${ave_pageWidth}px">></div>`
        );
    } else {
        $('#data_management .undertop_guide .device_area .list_page').append(
            `<div class="page_button page_turning" style="width:${ave_pageWidth}px"><</div>`,
            `<div class="page_button page_num page1" style="width:${ave_pageWidth}px">1</div>`,
            `<div class="page_button page_num page2" style="width:${ave_pageWidth}px">2</div>`,
            `<div class="page_button page_turning" style="width:${ave_pageWidth}px">></div>`
        );
    }

    $('#data_management .undertop_guide .device_area .list_page .page1').css({
        color: 'white',
        background: '#595959'
    })
    if (all_devices_name.length >= 10) {
        add_and_click(all_devices_name.slice(0, 10), 'data_management', 'device_list', 'device');
    } else {
        add_and_click(all_devices_name, 'data_management', 'device_list', 'device');
        let ave_deviceheight = $('#data_management .undertop_guide .device_area .device_list').children().last().css('height');
        let blankdiv = [];
        for (let i = 0; i < l * 10 - all_devices_name.length; i++) {
            blankdiv.push(`<div class="blank_device" style="height:${ave_deviceheight};padding: 10px 5px;"></div>`);
        }
        $('#data_management .undertop_guide .device_area .device_list').append(blankdiv);
    }

    $('#data_management .undertop_guide .device_area .list_page').on(
        'click',
        '.page_turning',
        function () {
            let pageturning_button = $(this);
            if (pageturning_button.prev().length == 0) {
                let num = Number(pageturning_button.next().attr('class').replace(/[^0-9]/ig, ""));
                if (num == 1) {
                    if (l > 3) {
                        pageturning_button.siblings('.page_num').remove();
                        switch (remainder) {
                            case 0: {
                                pageturning_button.after(
                                    `<div class="page_button page_num page${l - 2}" style="width:${ave_pageWidth}px">${l - 2}</div>`,
                                    `<div class="page_button page_num page${l - 1}" style="width:${ave_pageWidth}px">${l - 1}</div>`,
                                    `<div class="page_button page_num page${l}" style="width:${ave_pageWidth}px">${l}</div>`
                                );
                                break;
                            };
                            case 1: {
                                pageturning_button.after(
                                    `<div class="page_button page_num page${l}" style="width:${ave_pageWidth}px">${l}</div>`
                                );
                                break;
                            };
                            case 2: {
                                pageturning_button.after(
                                    `<div class="page_button page_num page${l - 1}" style="width:${ave_pageWidth}px">${l - 1}</div>`,
                                    `<div class="page_button page_num page${l}" style="width:${ave_pageWidth}px">${l}</div>`
                                );
                                break;
                            }
                        }
                        $(`#data_management .undertop_guide .device_area .list_page .page${l}`).css({
                            color: 'white',
                            background: '#595959'
                        })
                        $('#data_management .undertop_guide .device_area .device_list').children().remove();
                        add_and_click(all_devices_name.slice((l - 1) * 10, all_devices_name.length), 'data_management', 'device_list', 'device');
                        let ave_deviceheight = $('#data_management .undertop_guide .device_area .device_list').children().last().css('height');
                        let blankdiv = [];
                        for (let i = 0; i < l * 10 - all_devices_name.length; i++) {
                            blankdiv.push(`<div class="blank_device" style="height:${ave_deviceheight};padding: 10px 5px;"></div>`);
                        }
                        $('#data_management .undertop_guide .device_area .device_list').append(blankdiv);
                    }
                } else {
                    pageturning_button.siblings('.page_num').remove();
                    pageturning_button.after(
                        `<div class="page_button page_num page${num - 3}" style="width:${ave_pageWidth}px">${num - 3}</div>`,
                        `<div class="page_button page_num page${num - 2}" style="width:${ave_pageWidth}px">${num - 2}</div>`,
                        `<div class="page_button page_num page${num - 1}" style="width:${ave_pageWidth}px">${num - 1}</div>`,
                    )
                    $('#data_management .undertop_guide .device_area .list_page .page_num').last().css({
                        color: 'white',
                        background: '#595959'
                    })
                    $('#data_management .undertop_guide .device_area .device_list').children().remove();
                    add_and_click(all_devices_name.slice((num - 2) * 10, (num - 1) * 10), 'data_management', 'device_list', 'device');
                }
            } else if ($(this).next().length == 0) {
                if (l > 3) {
                    let num = Number(pageturning_button.prev().attr('class').replace(/[^0-9]/ig, ""));
                    if (num == l) {
                        pageturning_button.siblings('.page_num').remove();
                        pageturning_button.before(
                            `<div class="page_button page_num page1" style="width:${ave_pageWidth}px">1</div>`,
                            `<div class="page_button page_num page2" style="width:${ave_pageWidth}px">2</div>`,
                            `<div class="page_button page_num page3" style="width:${ave_pageWidth}px">3</div>`,
                        )
                        $('#data_management .undertop_guide .device_area .list_page .page1').css({
                            color: 'white',
                            background: '#595959'
                        })
                        $('#data_management .undertop_guide .device_area .device_list').children().remove();
                        add_and_click(all_devices_name.slice(0, 10), 'data_management', 'device_list', 'device');
                    } else if (num + 3 > l) {
                        pageturning_button.siblings('.page_num').remove();
                        switch (remainder) {
                            case 1: {
                                pageturning_button.before(
                                    `<div class="page_button page_num page${l}" style="width:${ave_pageWidth}px">${l}</div>`
                                );
                                break;
                            };
                            case 2: {
                                pageturning_button.before(
                                    `<div class="page_button page_num page${l - 1}" style="width:${ave_pageWidth}px">${l - 1}</div>`,
                                    `<div class="page_button page_num page${l}" style="width:${ave_pageWidth}px">${l}</div>`
                                );
                                break;
                            }
                        }
                        $('#data_management .undertop_guide .device_area .list_page .page_num').first().css({
                            color: 'white',
                            background: '#595959'
                        })
                        $('#data_management .undertop_guide .device_area .device_list').children().remove();
                        add_and_click(all_devices_name.slice(num * 10, (num + 1) * 10), 'data_management', 'device_list', 'device');
                        if (remainder == 1) {
                            let ave_deviceheight = $('#data_management .undertop_guide .device_area .device_list').children().last().css('height');
                            let blankdiv = [];
                            for (let i = 0; i < l * 10 - all_devices_name.length; i++) {
                                blankdiv.push(`<div class="blank_device" style="height:${ave_deviceheight};padding: 10px 5px;"></div>`);
                            }
                            $('#data_management .undertop_guide .device_area .device_list').append(blankdiv);
                        }
                    } else {
                        pageturning_button.siblings('.page_num').remove();
                        pageturning_button.before(
                            `<div class="page_button page_num page${num + 1}" style="width:${ave_pageWidth}px">${num + 1}</div>`,
                            `<div class="page_button page_num page${num + 2}" style="width:${ave_pageWidth}px">${num + 2}</div>`,
                            `<div class="page_button page_num page${num + 3}" style="width:${ave_pageWidth}px">${num + 3}</div>`,
                        );
                        $('#data_management .undertop_guide .device_area .list_page .page_num').first().css({
                            color: 'white',
                            background: '#595959'
                        })
                        $('#data_management .undertop_guide .device_area .device_list').children().remove();
                        add_and_click(all_devices_name.slice(num * 10, (num + 1) * 10), 'data_management', 'device_list', 'device');
                    }
                }
            }
        }
    )

    dm_device_item_hoverandclick();
    $('#data_management .undertop_guide .device_area .list_page').on(
        'click',
        '.page_num',
        function () {
            let num_button = $(this);
            let num = Number(num_button.attr('class').replace(/[^0-9]/ig, ""));
            num_button.siblings().css({
                color: 'black',
                background: '#CD2626'
            })
            num_button.css({
                color: 'white',
                background: '#595959'
            })
            $('#data_management .undertop_guide .device_area .device_list').children().remove();
            add_and_click(all_devices_name.slice(10 * num - 10, 10 * num), 'data_management', 'device_list', 'device');
            if (num == l) {
                let ave_deviceheight = $('#data_management .undertop_guide .device_area .device_list').children().last().css('height');
                let blankdiv = [];
                for (let i = 0; i < l * 10 - all_devices_name.length; i++) {
                    blankdiv.push(`<div class="blank_device" style="height:${ave_deviceheight};padding: 10px 5px;"></div>`);
                }
                $('#data_management .undertop_guide .device_area .device_list').append(blankdiv);
            }
        }
    )
}



function vm_device_click(all_videos, allvideos_url) {
    return function (num) {
        $('.video_list').children().remove();
        $('#video_display .video_area .the_video').attr({
            src: ''
        })
        add_and_click(all_videos[num], 'video_management', 'video_list', 'video', vm_video_click(allvideos_url));
    }
}

function vm_video_click(video_url) {
    return function (num) {
        $('#video_display .video_area .the_video').attr({
            src: video_url[num]
        })
    }
}



function data_management_show(){
    $('#data_management').css('display','flex');
    let all_devices = {
        device1: 'C:/Users/Dominator/Desktop/viewview/source/project.db', device2: 'url2', device3: 'url3', device4: 'url4', device5: 'url5',
        device6: 'url6', device7: 'url7', device8: 'url8', device9: 'url9', device10: 'url10',
        device11: 'url11', device12: 'url12', device13: 'url13', device14: 'url14', device15: 'url15',
        device16: 'url16', device17: 'url17', device18: 'url18', device19: 'url19', device20: 'url20',
        device21: 'url21', device22: 'url22', device23: 'url23', device24: 'url24', device25: 'url25',
        device26: 'url26', device27: 'url27', device28: 'url28', device29: 'url29', device30: 'url30',
        device31: 'url31', device32: 'url32', device33: 'url33', device34: 'url34', device35: 'url35',
        device36: 'url36', device37: 'url37', device38: 'url38', device39: 'url39', device40: 'url40',
        device41: 'url41', device42: 'url42', device43: 'url43', device44: 'url44', device45: 'url45',
        device46: 'url46', device47: 'url47', device48: 'url48', device49: 'url49', device50: 'url50',
        device51: 'url51', device52: 'url52', device53: 'url53', device54: 'url54', device55: 'url55',
        device56: 'url56', device57: 'url57', device58: 'url58', device59: 'url59', device60: 'url60',
        device61: 'url61', device62: 'url62', device63: 'url63', device64: 'url64', device65: 'url65',
        device66: 'url66', device67: 'url67', device68: 'url68', device69: 'url69', device70: 'url70',
        device71: 'url71', device72: 'url72', device73: 'url73', device74: 'url74', device75: 'url75',
        device76: 'url76', device77: 'url77', device78: 'url78', device79: 'url79', device80: 'url80'
    }
    ////all_devices_name存放所有的设备名称
    let all_devices_name = [
        'device1', 'device2', 'device3', 'device4', 'device5',
        'device6', 'device7', 'device8', 'device9', 'device10',
        'device11', 'device12', 'device13', 'device14', 'device15',
        'device16', 'device17', 'device18', 'device19', 'device20',
        'device21', 'device22', 'device23', 'device24', 'device25',
        'device26', 'device27', 'device28', 'device29', 'device30',
        'device31', 'device32', 'device33', 'device34', 'device35',
        'device36', 'device37', 'device38', 'device39', 'device40',
        'device41', 'device42', 'device43', 'device44', 'device45',
        'device46', 'device47', 'device48', 'device49', 'device50',
        'device51', 'device52', 'device53', 'device54', 'device55',
        'device56', 'device57', 'device58', 'device59', 'device60',
        'device61', 'device62', 'device63', 'device64', 'device65',
        'device66', 'device67', 'device68', 'device69', 'device70',
        'device71', 'device72', 'device73', 'device74', 'device75',
        // 'device76', 'device77', 'device78', 'device79', 'device80',
    ];
    ///all_devices_url存放对应设备url
    let all_devices_url = [
        'url1', 'url2', 'url3', 'url4', 'url5',
        'url6', 'url7', //'url8', 'url9', 'url10',
        // 'url11', 'url12', 'url13', 'url14', 'url15',
        // 'url16', 'url17', 'url18', 'url19', 'url20',
        // 'url21', 'url22', 'url23', 'url24', 'url25',
        // 'url26', 'url27', 'url28', 'url29', 'url30',
        // 'url31', 'url32', 'url33', 'url34', 'url35',
        // 'url36', 'url37', 'url38', 'url39', 'url40',
        // 'url41', 'url42', 'url43', 'url44', 'url45',
        // 'url46', 'url47', 'url48', 'url49', 'url50',
        // 'url51', 'url52', 'url53', 'url54', 'url55',
        // 'url56', 'url57', 'url58', 'url59', 'url60',
        // 'url61', 'url62', 'url63', 'url64', 'url65',
        // 'url66', 'url67', 'url68', 'url69', 'url70',
        // 'url71', 'url72', 'url73', 'url74', 'url75',
        //'url76', 'url77', 'url78', 'url79', 'url80',
    ];

    


    let all_videos = [                                   ///存放所有的设备的视频url
        ['video0', 'video1', 'video2'],
        ['video3', 'video4', 'video5'],
        ['video6', 'video7', 'video8']
    ]
    allvideos_url = ['./test0.mp4', './test1.mp4', './test2.mp4', '/test3.mp4'];


    //add_and_click(all_devices_name, 'data_management', 'device_list', 'device');
    dm_module_navbar_hover();
    dm_device_page(all_devices_name);
    let height = $('#data_management .undertop_guide .data_area').css('height');
    $('#data_management .undertop_guide .data_area .display_area').css('height', parseInt(height) * 0.85);
    choosetime_and_display(all_devices);
    //dm_display_chart();


    add_and_click(all_devices_name, 'video_management', 'device_list', 'device', vm_device_click(all_videos, allvideos_url));


}
function data_management_remove(){
    $('#data_management').css('display','none');
    $('#data_management .undertop_guide .device_area .device_list').empty();
    $('#data_management .undertop_guide .device_area .list_page').empty();
    $('#data_management .undertop_guide .device_area .list_page').empty();
    $('#data_management .undertop_guide .data_area .display_area').empty();
}


$(document).ready(
    function () {
        data_management_show()
    }
)