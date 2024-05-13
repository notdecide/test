interface BaseLink {

  /**
   * uuid随机数(主键，唯一不重复)
   */
  id: string

  // /**
  //  * 设备名称
  //  */
  // linkDeviceName: string,

  // /**
  //  * 接囗设备类型  功放、液晶显示器、0PS、面板、等等
  //  * 1：PDU、2：大屏、3：投影仪、4：幕布、5：功放、6：录播主机、7：自定义设备、8：PC、9：OPS、10：'IDV、11：笔记本电脑、12：液晶显示器、13：电视
  //  */
  // linkDeviceType: typeof import('@/_Common/constant').externalAllDevices[number]['value'], //外接设备
  // 关联3.1.4 设备连线信息表id
  // linkId: string
}

interface HDMIIN extends BaseLink {

}

interface HDMIOUT extends BaseLink {}

interface LINEIN extends BaseLink {}

interface LINEOUT extends BaseLink {}

interface RS232
  extends BaseLink,
  PDU,
  LargeScreen,
  Projector,
  Curtain,
  Amplifier,
  Recording {
  controller?: 1 | 2, //1、受控  2、主控
  product?: string, //厂商
  model?: string, //型号
  baud?: number, //波特率
  parity?: number //校验码
}

interface RS485 extends RS232 {}

//PDU 1
interface PDU
  extends Record<`pduLinkDeviceId${number}`, string | undefined>, //设备ID
  Record<`delayTime${number}`, number | undefined>, //通电后，发送开机指令码延迟时间
  Record<`blackoutDelayTime${number}`, number | undefined>, //下课后，发送关机指令码到断电延迟时间
  Record<`blackout${number}`, 0 | 1 | undefined> { //下课断电
  openPDUEvents?: string, //开启PDU指令集
  closePDUEvents?: string //关闭PDU指令集
}

// 大屏 2
interface LargeScreen {
  instructionNumber?: number, //指令码连续发送次数
  timeout?: number, // 源切换超时时间
  interval?: number, // 指令码连续发送间隔
  openTime?: number, // 大屏开启时间
  closeTime?: number, // 大屏关闭时间
  portEventsId?: string //串口事件
}

// 投影仪 3
interface Projector {
  instructionNumber?: number, //指令码连续发送次数
  interval?: number, // 指令码连续发送间隔
  openTime?: number, // 开启时间
  closeTime?: number, // 关闭时间
  portEventsId?: string //串口事件
}

// 幕布 4
interface Curtain {
  delayTime?: number, // 幕布升降延时
  portEventsId?: string //串口事件
}

// 功放 5
interface Amplifier {
  codeFormat?: number, // 指令码格式
  portInterval?: number, // 串口指令时间间隔
  qaEventsId?: string, //探测与应答事件
  volumeCodes?: string, //功放音阶控制码
  volumeControl?: number, //1百分比2增减控制
  volumePercent?: number, //功放音量最大百分比
  defaultVolume?: number, //功放音量默认值
  addVolumeCode?: string, //音量增加指令码
  lowerVolumeCode?: string, //音量减少指令码
  muteVolumeCode?: string, //音量静音指令码
  recoveryVolumeCode?: string, //音量恢复指令码
  addMicrophoneCode?: string, //麦克风音量增加指令码
  lowerMicrophoneCode?: string, //麦克风音量减少指令码
  muteMicrophoneCode?: string, //麦克风音量静音指令码
  recoveryMicrophoneCode?: string, //麦克风音量恢复指令码
  volumeSendingOrder?: 1 | 2, // 功放控制码发送顺序 1  取消静音+调整音量值 2 调整音量值+取消静音
  microphoneControl?: number, // 麦克风音量控制方式1百分比2增减控制
  microphonePercent?: number, //麦克音量最大百分比
  defaultMicrophoneVolume?: number, //麦克音量默认值
  microphoneSendingOrder?: 1 | 2, // 麦克控制码发送顺序 1  取消静音+调整音量值 2 调整音量值+取消静音
  microphoneVolumeCodes?: string, // 麦克风音阶控制码
  portEventsId?: string //串口事件
}

// 录播主机 6
interface Recording {
  rdwp?: 0 | 1, //录制关联一键上下课
  autoClose?: 0 | 1, //下课自动关机
  timeout?: number, // 超时时长
  startDelayTime?: number, // 开机到开始录制的延时
  endDelayTime?: number, // 下课到结束录制的延时
  closeDelayTime?: number, // 结束录制到关机的延时
  qaEventsId?: string, //探测与应答事件
  portEventsId?: string //串口事件
}

// 自定义设备 7
interface CustomEvents {
  portEventsId?: string //串口事件
}

