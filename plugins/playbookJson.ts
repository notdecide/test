interface Position {
    posPage: string, //start/quit/device/dispatch/init
    button: number//0:上下课，1：进度调（音量/mic场景），2.音量+/-,  3.设备控制，4.视频调度按钮，5.录课
}

interface Fun {
    type: number; //1面板按键  2接口变化 3外部调用
    keyClass: number | undefined; //1：PDU、2：大屏、3：投影仪、4：幕布、5：功放、6：录播主机、7：自定义设备、8：PC、9：OPS、10：'IDV、11：笔记本电脑、12：液晶显示器、13：电视
    keyID: string | undefined; //大屏1
    keyAction: string | undefined; //一键上课/开机、关机、升、降等
    position: Position | undefined;
    timeout: number;
}

interface Intf {
    type: number | undefined, //1：HDMIin, 2：HDMIout, 3：Linein, 4：Lineout, 5：USB, 6：232, 7：485, 8：IO, 9：PDU, 10：RTSPclient，11：RTSPServer，12：RTMP服务地址，12：http接口，13：ms接口  
    who: string | undefined,
    id: number | undefined
}
interface Para {
    spd: number | undefined,
    dbit: number | undefined,
    sbit: number | undefined,
    cks: number | undefined
}
interface WhenItem {
    type: number; //1：面板、AOP事件，2：串口/IO指令，3：接口up\down事件
    intf: Intf | undefined,
    para: Para,
    cmdRX: string | undefined,
    statusChg: number,
    dataType: number
}

interface ActionItem {
    type: number; //1：serial.串口发送, 2：sleep.等待，3：vroute.视频路由，4：function.调用另一个功能的action
    exec: Exec
}


interface Exec {
    //type == serial 
    intf: Intf | undefined;
    para: Para | undefined,
    cmdTx: string | undefined,
    dataType: number | undefined

    //type=vroute
    videoRouter: Intf[][] | undefined

    //type=function
    keyAction: string | undefined,
    keyID: string | undefined,

    //当type=ms
    topic: string | undefined,
    external: number | undefined,
    msg: string | undefined,

    //当type = http
    api: string | undefined,

    //当type=sleep
    sleepms: number | undefined
}
interface PlayBookItem {
    fun: Fun | undefined;
    when: WhenItem[] | undefined;
    action: ActionItem[] | undefined;
}

interface PlayBookJson {
    name: string;
    playBook: PlayBookItem[];
}
