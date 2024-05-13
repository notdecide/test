import { v4 as uuidv4 } from 'uuid';


interface PBOperation {

}
declare global {

    interface Window {
        //cosmo提供
        pBDevices: DeviceBase[];
        pBLinks?: LinkDataBase[];
        pBLinkDevices?: LinkDeviceDataBase[];
        pBLinkDeviceInfos?: LinkDeviceInfoDataBase[];
        pBSerialPortEvents?: SerialPortEventDataBase[];

        //剧本生成器生成和维护
        pBRouters?: RouterSettingBase[];
        pBRouter_details?: RouterSettingDetailBase[];
        pBFunctions?: FunctionDataBase[];
        pBFunctionConditions?: FunctionConditionBase[];
        pBFunctionActions?: FunctionActionBase[];

        pBOperations: PBOperation[];
    }
}


//1、设置拓扑、接线、指令码 和操作表 (操作表可空)
function setBasicInfo(devices: DeviceBase[], links?: LinkDataBase[], linkDevices?: LinkDeviceDataBase[], linkDeviceInfos?: LinkDeviceInfoDataBase[], serialPortEvents?: SerialPortEventDataBase[], operation?: PBOperation[]): void {
    window.pBDevices = devices;
    window.pBLinks = links;
    window.pBLinkDevices = linkDevices;
    window.pBLinkDeviceInfos = linkDeviceInfos;
    window.pBSerialPortEvents = serialPortEvents;
    window.pBRouters = [];
    window.pBRouter_details = [];
    window.pBFunctions = [];
    window.pBFunctionConditions = [];
    window.pBFunctionActions = [];

    //window.PBOperation = operation;

    //PDU全上电，幕布上电

    //生成设备的function
    links?.forEach(link => {
        if (link.linkType == 6 || link.linkType == 7 /* 232 485*/) {
            linkDevices?.forEach(linkDevice => {
                if (linkDevice.id == link.deviceId) {
                    linkDevice.linkDeviceName;
                    linkDeviceInfos?.forEach(linkDeviceInfo => {
                        serialPortEvents?.forEach(serialPortEvent => {
                            if (serialPortEvent.linkPortEventId == linkDeviceInfo.portEventsId) {
                                //生成function
                                const functionid = uuidv4();
                                const functionData: FunctionDataBase = {
                                    id: functionid,
                                    funcShow: 1,//1、面板 2、AOP
                                    funcType: 1,//1、设备控制 2、信号显示3、其他
                                    linkDeviceId: linkDevice.id, //归属设备
                                    button: serialPortEvent.eventName,//自定按钮名称
                                    type: 1 //1、内置（不可删除）
                                };
                                const functionAction: FunctionActionBase = {
                                    id: uuidv4(), // 唯一标识符
                                    type: 1, // 1 表示动作，2 表示时间
                                    funcId: functionid, // 功能的 ID
                                    actionType: '1',
                                    eventId: serialPortEvent.linkPortEventId, // 与动作相关联的事件的 ID
                                    time: 0 // 仅在类型为 2（时间）时才需要，表示间隔的秒数
                                };
                                window.pBFunctions?.push(functionData);
                                window.pBFunctionActions?.push(functionAction);
                            }
                        });

                    });
                }
            });

        }
        //console.log(link);
    });
    //生成路由
    //主电脑流化加显示，其他设备有接HDMIOUT就流化
    const classOnRouterSettingBase: RouterSettingBase = {
        id: uuidv4(),
        type: 1, //1、内置路由（不可删除）  2、面板路由（可新增删除）
        name: "上课路由"//路由名称
    };

    const classOnFunctionData: FunctionDataBase = {
        id: uuidv4(),
        funcShow: 1,//1、面板 2、AOP
        funcType: 2,//1、设备控制 2、信号显示3、其他
        linkDeviceId: "", //归属设备
        button: "上课路由",//自定按钮名称
        type: 1 //1、内置（不可删除）
    };
    const classOnFunctionAction: FunctionActionBase = {
        id: uuidv4(), // 唯一标识符
        type: 1, // 1 表示动作，2 表示时间
        funcId: classOnFunctionData.id, // 功能的 ID
        actionType: '2', //视频路由
        eventId: classOnRouterSettingBase.id, // 与动作相关联的事件的 ID
        time: 0 // 仅在类型为 2（时间）时才需要，表示间隔的秒数
    };

    const classOffFunctionData: FunctionDataBase = {
        id: uuidv4(),
        funcShow: 1,//1、面板 2、AOP
        funcType: 2,//1、设备控制 2、信号显示3、其他
        linkDeviceId: "", //归属设备
        button: "下课路由",//自定按钮名称
        type: 1 //1、内置（不可删除）
    };
    const classOffRouterSettingBase: RouterSettingBase = {
        id: uuidv4(),
        type: 1, //1、内置路由（不可删除）  2、面板路由（可新增删除）
        name: "下课"//路由名称
    };
    const classOffFunctionAction: FunctionActionBase = {
        id: uuidv4(), // 唯一标识符
        type: 1, // 1 表示动作，2 表示时间
        funcId: classOffFunctionData.id, // 功能的 ID
        actionType: '2', //视频路由
        eventId: classOffRouterSettingBase.id, // 与动作相关联的事件的 ID
        time: 0 // 仅在类型为 2（时间）时才需要，表示间隔的秒数
    };

    window.pBRouters?.push(classOnRouterSettingBase);
    window.pBFunctions?.push(classOnFunctionData);
    window.pBFunctionActions?.push(classOnFunctionAction);

    window.pBFunctions?.push(classOffFunctionData);
    window.pBFunctionActions?.push(classOffFunctionAction);
    window.pBRouters?.push(classOffRouterSettingBase);
    let mainDevice;
    let mainLink: LinkDataBase;
    //找主电脑
    const link = links?.find(link => link.linkType === 1 /* hdmi in */);
    if (link) {
        const mainLinkDevice = linkDevices?.find(linkDevice => link.linkDeviceId === linkDevice.id && linkDevice.isRoot);
        if (mainLinkDevice) {
            mainDevice = devices.find(device => device.id === link.deviceId);
            if (mainDevice) {
                mainLink = link;
                console.log("find main hdmi in");
            }
        }
    }
    //生成路由
    links?.forEach(link => {
        if (link.linkType == 2 /*hdmi out*/) {
            const linkDevice = linkDevices?.find(linkDevice => link.linkDeviceId === linkDevice.id);
            if (linkDevice) {
                const device = devices.find(device => device.id === link.deviceId);
                if (device) {
                    // 生成路由
                    const routerSettingDetailBase: RouterSettingDetailBase = {
                        id: uuidv4(), // 连线id uuid随机数(主键，唯一不重复)
                        inLinkId: mainLink.id, // 路由进口
                        outLinkId: link.id, // 出口
                        type: 1, // 1、视屏路由 2、音频路由
                        routeId: classOnRouterSettingBase.id // 路由信息ID信息
                    };
                    window.pBRouter_details?.push(routerSettingDetailBase);
                }
            }
        }
    });

    // //生成PDU事件
    // links?.forEach(link => {
    //     if (link.linkType == 9 /* PDU*/) {
    //         linkDevices?.forEach(linkDevice => {
    //             if (linkDevice.id == link.deviceId) {
    //                 if (linkDevice.linkDeviceType == 1  /*PDU*/) {

    //                     linkDeviceInfos?.forEach(linkDeviceInfo => {
    //                         if (linkDevice.linkDeviceInfoId == linkDeviceInfo.id) {
    //                             let count = 0;
    //                             let openPDUEvents = undefined;
    //                             let closePDUEvents = undefined;

    //                             if (typeof linkDeviceInfo.openPDUEvents === 'string') {
    //                                 count = linkDeviceInfo.openPDUEvents.split('\n').length;
    //                                 openPDUEvents = linkDeviceInfo.openPDUEvents.split('\n')
    //                             }
    //                             if (typeof linkDeviceInfo.closePDUEvents === 'string') {
    //                                 count = linkDeviceInfo.closePDUEvents.split('\n').length;
    //                                 closePDUEvents = linkDeviceInfo.closePDUEvents.split('\n')
    //                             }
    //                             for (let i = 0; i <= count; i++) {
    //                                 const propDeviceId = `pduLinkDeviceId${i + 1}`;
    //                                 const propDelayTime = `delayTime${i + 1}`;
    //                                 const propBlackoutDelayTime = `blackoutDelayTime${i + 1}`;
    //                                 const propBlackout = `blackout${i + 1}`;

    //                                 const pduLinkDeviceId = linkDeviceInfo[propDeviceId];
    //                                 const delayTime = linkDeviceInfo[propDelayTime];
    //                                 const blackoutDelayTime = linkDeviceInfo[propBlackoutDelayTime];
    //                                 const blackout = linkDeviceInfo[propBlackout];
    //                                 linkDevices?.forEach(linkDevice2 => {
    //                                     if (pduLinkDeviceId == linkDevice2.id) {

    //                                         if (linkDevice2.linkDeviceType == 4 /*幕布*/) {

    //                                         } else {

    //                                             //找指令
    //                                             // openPDUEvents[i]
    //                                             //口


    //                                         }
    //                                     }


    //                                 });

    //                             }



    //                         };

    //                     });

    //                 }


    //             }
    //         });

    //     }
    //     //console.log(link);
    // });

}
//2、获取路由列表、功能列表等
function getRouters(): RouterSettingBase[] | undefined {
    return window.pBRouters;
}
function getRouterDetails(): RouterSettingDetailBase[] | undefined {
    return window.pBRouter_details;
}
function getFunctions(): FunctionDataBase[] | undefined {
    return window.pBFunctions;
}
function getFunctionConditions(): FunctionConditionBase[] | undefined {
    return window.pBFunctionConditions;
}
function getFunctionActions(): FunctionActionBase[] | undefined {
    return window.pBFunctionActions;
}
//3、增删查改 路由列表
//3.1添加路由,返回路由id
function addRouter(): string {
    return "";
}
//3.2添加路由detail ，返回detailId
function addRouterDetail(routeId: string, inLinkId: string, outLinkId: string, type: 1 | 2): string {
    return "";
}
//3.3修改路由detail. 可修改除了id以外的信息
function modifyRouterDetail(routerDetail: RouterSettingDetailBase): RouterSettingDetailBase {
    return routerDetail;
}
//3.4 删除路由
function removeRouter(routerId: string) {

}
//3.5删除detail
function removeRouterDetail(routerDetailId: string) {

}
//4、增删查改功能列表
//4.1 添加功能，返回id
function addFunction(funcShow?: 0 | 1 | 2, funcType?: 1 | 2 | 3, linkDeviceId?: string, button?: string): string {
    return "";
}
//4.2 添加condition,返回conditionid
function addFunctionCondition(funcId?: string, code?: string, conditionType?: string, key?: string, linkId?: string, serialPortEventId?: string): string {
    return "";
}
//4.3 添加action,返回actionId
function addFunctionAction(funcId?: string, type?: number, actionType?: string, eventId?: string, time?: number): string {
    return "";
}

//5、获取操作表，一起保存到设备端
function getOperations(): PBOperation[] | undefined {
    return undefined;
}
function extractNumberAfterUnderscore(input: string): number | undefined {
    // 使用正则表达式匹配_后的数字  
    const match = input.match(/_(\d+)/);
    if (match && match.length > 1) {
        // 如果找到了匹配项，将匹配到的数字转换为number类型并返回  
        return parseInt(match[1], 10);
    }
    return undefined;
}


//6、获取剧本json,最后要下发剧本到设备的时候调用。
function getPlayBook(): string {
    interface PlayBookJson {
        name: string;
        playBook: PlayBookItem[];
    }
    let playBookItems: PlayBookItem[] = [];
    let playBookJson: PlayBookJson = {
        name: "playBook",
        playBook: playBookItems
    }


    window.pBFunctions?.forEach(functionData => {
        let actionItems: ActionItem[] = [];
        window.pBFunctionActions?.forEach(functionAction => {
            if (functionAction.funcId == functionData.id) {
                //串口
                let para: Para;
                let dataType = 1;
                let intf: Intf = {
                    type: undefined, //1：HDMIin, 2：HDMIout, 3：Linein, 4：Lineout, 5：USB, 6：232, 7：485, 8：IO, 9：PDU, 10：RTSPclient，11：RTSPServer，12：RTMP服务地址，12：http接口，13：ms接口  
                    who: undefined,
                    id: undefined
                };


                let videoIntfs: Intf[][] = [];

                let exec: Exec = {
                    intf: undefined,
                    para: undefined,
                    cmdTx: undefined,
                    dataType: undefined,
                    videoRouter: videoIntfs,
                    keyAction: undefined,
                    keyID: undefined,
                    topic: undefined,
                    external: undefined,
                    msg: undefined,
                    api: undefined,
                    sleepms: undefined
                };
                let actionItem: ActionItem = {
                    type: 0,
                    exec: exec
                };

                if (functionAction.type == 2) { // sleep
                    actionItem.type = 2;
                    if (typeof functionAction.time === 'number') {
                        exec.sleepms = functionAction.time * 1000;
                    } else {
                        exec.sleepms = 0;
                    }

                } else {
                    if (functionAction.actionType == "1") {//串口发送
                        actionItem.type = 1;
                        const foundSerialPortEvent = window.pBSerialPortEvents?.find(serialPortEvent => serialPortEvent.id == functionAction.eventId);
                        if (foundSerialPortEvent) {
                            const foundLinkDeviceInfo = window.pBLinkDeviceInfos?.find(linkDeviceInfo => linkDeviceInfo.portEventsId == foundSerialPortEvent.id);
                            if (foundLinkDeviceInfo) {
                                const foundLinkDevice = window.pBLinkDevices?.find(linkDevice => linkDevice.linkDeviceInfoId == foundLinkDeviceInfo.id);
                                if (foundLinkDevice) {
                                    const foundLink = window.pBLinks?.find(link => link.linkDeviceId == foundLinkDevice.id);
                                    if (foundLink) {
                                        intf.type = foundLink?.linkType;
                                        intf.id = extractNumberAfterUnderscore(foundLink.linkName!);
                                        const foundDevice = window.pBDevices?.find(device => device.id == foundLink.deviceId);
                                        if (foundDevice) {
                                            intf.who = foundDevice.mac;
                                        }
                                    }
                                    exec.intf = intf;

                                }
                                para = {
                                    spd: foundLinkDeviceInfo.baud,
                                    sbit: 1,
                                    dbit: 8,
                                    cks: 0
                                };

                            }

                        }

                    } else if (functionAction.actionType == "2") {//路由
                        actionItem.type = 3;
                        let routerItems: Intf[] = [];
                        const foundRouterSetting = window.pBRouters?.find(routerSetting => routerSetting.id == functionAction.eventId);
                        if (foundRouterSetting) {
                            window.pBRouter_details?.forEach(routerSettingDetail => {
                                if (routerSettingDetail.routeId == foundRouterSetting.id) {
                                    routerSettingDetail.inLinkId
                                    routerSettingDetail.outLinkId
                                    window.pBLinks?.forEach(link => {
                                        let mac;
                                        if (link.id == routerSettingDetail.inLinkId) {
                                            const id = extractNumberAfterUnderscore(link.linkName!);
                                            const foundDevice = window.pBDevices?.find(device => device.id == link.deviceId);
                                            if (foundDevice) {
                                                mac = foundDevice.mac;
                                            }
                                        } else if (link.id == routerSettingDetail.outLinkId) {
                                            const id = extractNumberAfterUnderscore(link.linkName!);
                                            const foundDevice = window.pBDevices?.find(device => device.id == link.deviceId);
                                            if (foundDevice) {
                                                mac = foundDevice.mac;
                                            }
                                        }
                                        const interfaceId = extractNumberAfterUnderscore(link.linkName!);
                                        const routerInterface: Intf = {
                                            type: link.linkType,
                                            who: mac,
                                            id: interfaceId,
                                        };
                                        routerItems.push(routerInterface);
                                    });
                                }
                            });
                        }
                        videoIntfs?.push(routerItems);

                    } else if (functionAction.actionType == "3") {//调用其他function
                        actionItem.type = 4;
                        const foundFunction = window.pBFunctions?.find(functionSetting => functionSetting.id == functionAction.eventId);
                        if (foundFunction) {
                            exec.keyAction = foundFunction.button;
                            if (foundFunction.funcType == 2) {
                                exec.keyID = "路由";

                            } else if (foundFunction.funcType == 1) {
                                const foundLinkDevice = window.pBLinkDevices?.find(linkdevice => foundFunction.linkDeviceId == linkdevice.id);
                                if (foundLinkDevice) {
                                    exec.keyID = foundLinkDevice.linkDeviceName;
                                }
                            } else if (foundFunction.funcType == 3) {

                                exec.keyID = exec.keyAction;
                            }
                        }
                    }
                }
                actionItems.push(actionItem);
            }

        });
        let position: Position = {
            posPage: "",
            button: 1
        };

        let fun: Fun = {
            type: functionData.funcShow == 1 ? 1 : 2, //1面板按键  2接口变化 3外部调用
            keyClass: 1, //1：PDU、2：大屏、3：投影仪、4：幕布、5：功放、6：录播主机、7：自定义设备、8：PC、9：OPS、10：'IDV、11：笔记本电脑、12：液晶显示器、13：电视
            keyID: "", //大屏1
            keyAction: functionData.button, //一键上课/开机、关机、升、降等
            position: position,
            timeout: 10
        };
        let playBookItem: PlayBookItem = {
            fun: fun,
            when: undefined,
            action: actionItems
        };
        playBookItems.push(playBookItem);
        if (functionData.funcType == 2) {
            fun.keyID = "路由";
            position.posPage = "dispatch";
            position.button = 4;
        } else if (functionData.funcType == 1) {
            const foundLinkDevice = window.pBLinkDevices?.find(linkdevice => functionData.linkDeviceId == linkdevice.id);
            if (foundLinkDevice) {
                fun.keyID = foundLinkDevice.linkDeviceName;
                fun.keyClass = foundLinkDevice.linkDeviceType;
                position.posPage = "device";
                if (foundLinkDevice.linkDeviceType == 5 /*攻放*/) {

                    const foundLinkDeviceInfo = window.pBLinkDeviceInfos?.find(linkdeviceInfo => foundLinkDevice.linkDeviceInfoId == linkdeviceInfo.id);
                    if (foundLinkDeviceInfo) {
                        if (foundLinkDeviceInfo.microphoneControl == 1) {
                            position.button = 1;
                        } else if (foundLinkDeviceInfo.microphoneControl == 2) {
                            position.button = 2;
                        }
                    }

                } else {
                    position.button = 3;
                }
            }
        } else if (functionData.funcType == 3) {
            fun.keyID = fun.keyAction;
            if (functionData.button == "上课") {
                position.posPage = "start";
                position.button = 0;
            } else if (functionData.button == "下课") {
                position.posPage = "quit";
                position.button = 0;
            }
        }
    });
    const jsonString = JSON.stringify(playBookJson, null, 2); // 使用2个空格进行缩进，使JSON更易于阅读  
    console.log(jsonString);
    return jsonString;
}

