
interface Window {
  /**
   * 接收广播信息
   * @param param 接收参数
   * @returns
   */
  loadBroadcast: (param: string | null) => void
}

interface WPF {
  // 关闭App
  closeApp: () => void,
  // 开启关闭APP Ddbug
  debugApp: (open: boolean) => void,
  // 根据文件路径,读取文件内容，内容为JSON对象
  readFile: (filePath: string) => string,
  // 将数据保存到文件中
  saveFile: (filePath: string, content: string) => string,
  // 获取当前目录路径
  getDirectory: () => string,
  // 发送广播内容
  // sendBroadcast: (id: string, content: string) => boolean,
  // 发送广播内容
  sendBroadcast: (id: string, content: string, msgType: MsgType) => boolean,
  // 读取目录下的所有文件名
  getFilesInDirectory: (dirPath: string) => string[],
  // 读取目录下的所有文件里的内容并返回JSONArr数组
  readDirectory: (dirPath: string) => string,
  // 打印错误日志
  logError: (message: string) => void,
  // 打印info日志
  logInfo: (message: string) => void,
  // 打印warn日志
  logWarn: (message: string) => void
}

declare const AppContainerObj: WPF | undefined;
