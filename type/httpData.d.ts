interface AllSettingData {
  device?: DeviceBase[],
  space?: ProjectSpaceBase[],
  link?: LinkDataBase[],
  linkDevice?: LinkDeviceDataBase[],
  linkDeviceInfo?: LinkDeviceInfoDataBase[],
  serialPortEvent?: SerialPortEventDataBase[],
  router?: RouterSettingBase[],
  router_detail?: RouterSettingDetailBase[],
  function?: FunctionDataBase[],
  functionCondition?: FunctionConditionBase[],
  functionAction?: FunctionActionBase[],
  camera?: CameraBase[],
  stream?: StreamBase[]
}
