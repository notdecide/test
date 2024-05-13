
/**
 * 用户信息
 */
interface UserInfo {
  userId: number,
  userName: string
}

/**
 * 项目表
 */
interface ProjectBase {
  /**
   * uuid随机数(主键，唯一不重复)
   */
  id: string,
  projectName: string, // 项目名称
  companyId?: string, //企业ID
  companyName?: string, //企业名称
  industry?: string, //行业
  area?: string, //区域
  phone?: string, //联系人手机
  remark?: string //备注
}

/**
 * 空间表
 */
interface ProjectSpaceBase {
  /**
   * Cosmo空间ID
   */
  id: string,
  /**
   * 空间名称
   */
  spaceName: string,
  /**
   * 设备空间ID
   */
  spaceId: string,
  /**
   * 项目ID
   */
  projectId: string,
  /**
   * 实施模板
   */
  templateName?: string,
  /**
   * 模板id
   */
  templateId?: string,
  /**
   * 配置状态 0未配置 1已配置 2被控设备
   */
  settingStatus?: number

}

//设备表
interface DeviceBase {
  /**
   * uuid随机数(主键，唯一不重复)
   */
  id?: string,

  /**
     * mac地址
     */
  mac?: string,

  /**
     * 设备名称
     */
  deviceName?: string,

  /**
     * 设备类型
     */
  deviceType?: string,

  /**
     * 是否为主设备
     */
  primary?: 0 | 1,

  /**
     * sn号
     */
  sn?: string,

  /**
     * ip地址
     */
  ip?: string,

  /**
     * 子网掩码
     */
  mask?: string,

  /**
     * 网关地址
     */
  gateway?: string,

  /**
     * dns
     */
  dns?: string,

  /**
     *  在线状况  1在线 0离线
     */
  online?: number,

  /**
     * 型号
     */
  model?: import('@/models/boradcast/enum/DeviceEnum').DeviceModel,

  /**
     * 软件版本号
     */
  verS?: string,

  /**
     * 软件版本号
     */
  verH?: string,

  /**
     * 关联的主设备id
     */
  parentId?: string

  /**
     * 主控设备类型，1 DE600 2，DE100
     */
  // vccType?: number
}

interface LinkDataBase {
  /**
   * uuid随机数(主键，唯一不重复)
   */
  id: string,

  linkName?:
  | 'HDMI_IN_1'
  | 'HDMI_IN_2'
  | 'HDMI_OUT_1'
  | 'HDMI_OUT_2'
  | 'LINE_IN_1'
  | 'LINE_OUT_1'
  | 'RS232_1'
  | 'RS232_2'
  | 'RS232_3'
  | 'RS232_4'
  | 'RS485_1'
  | 'RS485_2',

  /**
   *  1：HDMIin, 2：HDMIout, 3：Linein, 4：Lineout, 5：USB, 6：232, 7：485, 8：IO, 9：PDU, 10：RTSPclient，11：RTSPServer，12：RTMP服务地址
   */
  linkType?: number,

  /**
   * 关联接线设备id,如大屏等
   */
  linkDeviceId?: string,

  /**
   * 关联设备id 如DE100
   */
  deviceId?: string
}

/**
 * 设备明细表
 */
interface LinkDeviceInfoDataBase
  extends HDMIIN,
  HDMIOUT,
  LINEIN,
  LINEOUT,
  RS232,
  RS485 {}

interface LinkDeviceDataBase {
  /**
   * uuid随机数(主键，唯一不重复)
   */
  id: string,

  /**
   * 设备名称
   */
  linkDeviceName?: string,

  /**
   * 接囗设备类型  功放、液晶显示器、0PS、面板、等等
   * 1：PDU、2：大屏、3：投影仪、4：幕布、5：功放、6：录播主机、7：自定义设备、8：PC、9：OPS、10：'IDV、11：笔记本电脑、12：液晶显示器、13：电视
   */
  linkDeviceType?: typeof import('@/_Common/constant').externalAllDevices[number]['value'], //外接设备
  // 关联3.1.4 设备连线信息表id
  linkDeviceInfoId?: string,
  //1、受控  2、主控
  controller?: 1 | 2,
  //是否为主设备
  isRoot?: 0 | 1
}

/**
 * 串口事件接口配置表
 */
interface SerialPortEventDataBase{
  id: string, //配置id  uuid随机数(主键，唯一不重复)
  eventName: string, //事件名称
  eventCmd: string, //指令码
  isDefault?: 0 | 1, //是否默认
  delayTime?: number, //指令延迟
  retry?: number, //重发次数
  interval?: number, //发送间隔
  linkPortEventId?: string//串口配置id
}

// 路由配置表
interface RouterSettingBase {
  id: string,
  type: 1 | 2, //1、内置路由（不可删除）  2、面板路由（可新增删除）
  name: string//路由名称
}

// 路由明细表
interface RouterSettingDetailBase {
  id: string, //连线id  uuid随机数(主键，唯一不重复)
  inLinkId: string, //路由进口
  outLinkId: string, //出口
  type: 1 | 2, //1、视屏路由 2、音频路由
  routeId: string, //路由信息ID信息
  inType?: number,
  outType?: number
}

//功能配置表
interface FunctionDataBase {
  id: string, //配置id  uuid随机数(主键，唯一不重复)
  // funcName?: string, //功能名称（自定义）
  // funcRemark?: string, //功能备注
  funcShow?: 0 | 1 | 2, //1、面板 2、AOP
  funcType?: 1 | 2 | 3, //1、设备控制 2、信号显示3、其他
  linkDeviceId?: string, //归属设备
  button?: string, //自定按钮名称
  type?: 1 | 2 //1、内置（不可删除）
}

interface FunctionConditionBase {
  id: string,
  funcId?: string,
  code?: string,
  /*
    1、接口拔插
    2、接收串口事件
    3、面板控制
    4、受控指令码
  */
  conditionType?: string,
  //1 拔出、2 插入（当选择接口拔插）
  key?: string,
  linkId?: string
//   /*
//     Case:conditionType =2（主控设备）
//     串口事件ID
// */
//   serialPortEventId?: string
}

interface FunctionActionBase {
  id: string,
  // 1、动作   2、时间
  type?: number,
  funcId?: string,
  /*
    Case:actionType ==1
    串口事件
      Case:actionType ==2
      视屏路由
      Case:actionType ==3
      已有的功能
  */
  actionType?: string,
  /**
   * Case:actionType ==1
      串口事件ID
      Case:actionType ==2
      视屏路由ID
      Case:actionType ==3
      已有的功能ID
   */
  eventId?: string, //对应SerialPortEventDataBase中的id
  time?: number //当type==2  间隔事件（秒）
  // linkDeviceId?: string//外接设备id
}

// 摄像头配置
interface CameraBase {
  id: string, //配置id  uuid随机数(主键，唯一不重复)
  url?: string, //摄像头流地址
  name?: string, //摄像头名称
  isMainRoom: number, //是否是教室主画面0否1是
  parentId?: string //子码流父级id
}

// 3.1.14 流媒体配置
interface StreamBase{
  id: string, //配置id  uuid随机数(主键，唯一不重复)
  url?: string, //摄像头流地址
  name?: string, //摄像头名称
  protocol?: string, //流协议
  direction?: number //1流入2流出
}

interface PC {
  id: string,
  PCName: string,
  ip: string
}

