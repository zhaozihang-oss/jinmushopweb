import { ref, reactive } from 'vue'

// 全局消息状态
const messageState = reactive({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000
})

export function useMessage() {
  const showMessage = (message, type = 'info', duration = 3000) => {
    messageState.message = message
    messageState.type = type
    messageState.duration = duration
    messageState.visible = true
  }

  const hideMessage = () => {
    messageState.visible = false
  }

  const showSuccess = (message, duration = 3000) => {
    showMessage(message, 'success', duration)
  }

  const showError = (message, duration = 3000) => {
    showMessage(message, 'error', duration)
  }

  const showWarning = (message, duration = 3000) => {
    showMessage(message, 'warning', duration)
  }

  const showInfo = (message, duration = 3000) => {
    showMessage(message, 'info', duration)
  }

  return {
    messageState,
    showMessage,
    hideMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
} 