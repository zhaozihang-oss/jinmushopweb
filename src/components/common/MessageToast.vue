<template>
  <Teleport to="body">
    <div 
      v-if="visible" 
      class="message-toast"
      :class="[`toast-${type}`, { 'toast-show': visible }]"
    >
      <div class="toast-content">
        <div class="toast-icon">
          <i v-if="type === 'success'" class="fas fa-check-circle"></i>
          <i v-if="type === 'error'" class="fas fa-exclamation-circle"></i>
          <i v-if="type === 'warning'" class="fas fa-exclamation-triangle"></i>
          <i v-if="type === 'info'" class="fas fa-info-circle"></i>
        </div>
        <span class="toast-message">{{ message }}</span>
        <button class="toast-close" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  name: 'MessageToast',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    let timer = null

    const close = () => {
      emit('close')
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    const startTimer = () => {
      if (props.duration > 0) {
        timer = setTimeout(() => {
          close()
        }, props.duration)
      }
    }

    watch(() => props.visible, (newVal) => {
      if (newVal) {
        startTimer()
      } else {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      }
    })

    onMounted(() => {
      if (props.visible) {
        startTimer()
      }
    })

    return {
      close
    }
  }
}
</script>

<style scoped>
.message-toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
  padding: 0;
  margin: 0;
}

.message-toast.toast-show {
  transform: translateY(0);
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.toast-icon {
  margin-right: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 12px;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

/* 成功状态 */
.toast-success .toast-content {
  background-color: #d4edda;
  color: #155724;
  border-left: 4px solid #28a745;
}

.toast-success .toast-icon {
  color: #28a745;
}

.toast-success .toast-close {
  color: #155724;
}

/* 错误状态 */
.toast-error .toast-content {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.toast-error .toast-icon {
  color: #dc3545;
}

.toast-error .toast-close {
  color: #721c24;
}

/* 警告状态 */
.toast-warning .toast-content {
  background-color: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.toast-warning .toast-icon {
  color: #ffc107;
}

.toast-warning .toast-close {
  color: #856404;
}

/* 信息状态 */
.toast-info .toast-content {
  background-color: #cce7ff;
  color: #004085;
  border-left: 4px solid #007bff;
}

.toast-info .toast-icon {
  color: #007bff;
}

.toast-info .toast-close {
  color: #004085;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toast-content {
    padding: 10px 12px;
  }
  
  .toast-message {
    font-size: 13px;
  }
  
  .toast-icon {
    font-size: 14px;
    margin-right: 6px;
  }
  
  .toast-close {
    margin-left: 8px;
    font-size: 12px;
  }
}
</style> 