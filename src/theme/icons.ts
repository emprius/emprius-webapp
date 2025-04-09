import { FiMenu, FiMessageCircle, FiPlus, FiSearch, FiStar, FiTool, FiUser, FiUsers } from 'react-icons/fi'
import { PiHandArrowDownBold, PiHandHeartBold } from 'react-icons/pi'
import { FaHeartbeat, FaCalendar, FaRoute } from 'react-icons/fa'
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im'

export const icons = {
  user: FiUser,
  users: FiUsers,
  tools: FiTool,
  ratings: FiStar,
  request: PiHandArrowDownBold,
  loan: PiHandHeartBold,
  add: FiPlus,
  menu: FiMenu,
  messageBubble: FiMessageCircle,
  search: FiSearch,
  donate: FaHeartbeat,
  outbox: ImBoxRemove,
  inbox: ImBoxAdd,
  calendar: FaCalendar,
  nomadic: FaRoute,
}
