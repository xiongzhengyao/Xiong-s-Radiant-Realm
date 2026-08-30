import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

export const toast = {
  success: message => ElMessage.success(message),
  error: message => ElMessage.error(message)
}
