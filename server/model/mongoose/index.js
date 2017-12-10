//连接数据库
import dbConnetion from './connection'
import BLR from './modules/BLR'
import EPB from './modules/EPB'
import DRC from './modules/DRC'
import WA from './modules/WA'
import FB from './modules/FB'
import user from './modules/user'
import log from './modules/log'
//引入数据库操作模型

const db = {
  dbConnetion,
  BLR,
  EPB,
  WA,
  FB,
  DRC,
  user,
  log
}

export default db