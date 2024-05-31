
/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
  test: 'controller.example.test',
  sqlitedbOperation: 'controller.framework.sqlitedbOperation',
  ballSqliteOperation: 'controller.framework.ballSqliteOperation',
  selectFolder: 'controller.os.selectFolder'
}

export {
  ipcApiRoute
}

