import {
  FiGlobe,
  FiHome,
  FiMenu,
  FiMessageCircle,
  FiPlus,
  FiSearch,
  FiShare2,
  FiStar,
  FiTool,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import { PiHandArrowDownBold, PiHandHeartBold } from 'react-icons/pi'
import { FaHeartbeat, FaCalendar, FaBalanceScale } from 'react-icons/fa'
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im'
import { EditIcon } from '@chakra-ui/icons'
import { RiUserCommunityFill } from 'react-icons/ri'
import { SlUser } from 'react-icons/sl'
import { IoMdHome } from 'react-icons/io'
import { RxColorWheel } from 'react-icons/rx'

export const icons = {
  user: FiUser,
  userInactive: SlUser,
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
  nomadic: RxColorWheel,
  edit: EditIcon,
  communities: RiUserCommunityFill,
  globe: FiGlobe,
  share: FiShare2,
  userHome: IoMdHome,
  userCommunity: FiHome,
  karma: FaBalanceScale,
}
