<template>
  <div class="date-range-filter">
    <!-- Web版本 -->
    <div v-if="!isMobile" class="date-filter-section">
      <div class="date-inputs">
        <div class="date-input-wrapper">
          <input 
            type="date" 
            v-model="localStartDate" 
            class="date-input"
            :placeholder="startPlaceholder"
          />
          <label class="date-label">{{ startLabel }}</label>
        </div>
        <div class="date-input-wrapper">
          <input 
            type="date" 
            v-model="localEndDate" 
            class="date-input"
            :placeholder="endPlaceholder"
          />
          <label class="date-label">{{ endLabel }}</label>
        </div>
      </div>
      <div class="filter-buttons">
        <button class="btn-filter" @click="handleFilter">{{ filterText }}</button>
        <button class="btn-reset" @click="handleReset">{{ resetText }}</button>
      </div>
    </div>

    <!-- 移动版本 -->
    <div v-else class="mobile-date-filter">
      <div class="mobile-date-row">
        <div class="mobile-date-input-wrapper">
          <input 
            type="date" 
            v-model="localStartDate" 
            class="mobile-date-input"
            :placeholder="startPlaceholder"
          />
          <label class="mobile-date-label">{{ startLabel }}</label>
        </div>
        <div class="mobile-date-input-wrapper">
          <input 
            type="date" 
            v-model="localEndDate" 
            class="mobile-date-input"
            :placeholder="endPlaceholder"
          />
          <label class="mobile-date-label">{{ endLabel }}</label>
        </div>
      </div>
      <div class="mobile-filter-buttons">
        <button class="mobile-btn-filter" @click="handleFilter">{{ filterText }}</button>
        <button class="mobile-btn-reset" @click="handleReset">{{ resetText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'DateRangeFilter',
  props: {
    // 双向绑定的开始日期
    startDate: {
      type: String,
      default: ''
    },
    // 双向绑定的结束日期
    endDate: {
      type: String,
      default: ''
    },
    // 开始日期标签
    startLabel: {
      type: String,
      default: 'Start date'
    },
    // 结束日期标签
    endLabel: {
      type: String,
      default: 'End date'
    },
    // 开始日期占位符
    startPlaceholder: {
      type: String,
      default: 'Start date'
    },
    // 结束日期占位符
    endPlaceholder: {
      type: String,
      default: 'End date'
    },
    // 筛选按钮文本
    filterText: {
      type: String,
      default: 'Filter'
    },
    // 重置按钮文本
    resetText: {
      type: String,
      default: 'Reset'
    },
    // 是否自动触发筛选（当日期改变时）
    autoFilter: {
      type: Boolean,
      default: false
    },
    // 主题色
    primaryColor: {
      type: String,
      default: '#28a745'
    }
  },
  emits: ['update:startDate', 'update:endDate', 'filter', 'reset', 'change'],
  setup(props, { emit }) {
    const isMobile = ref(window.innerWidth <= 768)
    
    // 本地状态管理
    const localStartDate = ref(props.startDate)
    const localEndDate = ref(props.endDate)

    // 监听外部prop变化，同步到本地状态
    watch(() => props.startDate, (newVal) => {
      localStartDate.value = newVal
    })

    watch(() => props.endDate, (newVal) => {
      localEndDate.value = newVal
    })

    // 监听本地状态变化，同步到外部
    watch(localStartDate, (newVal) => {
      emit('update:startDate', newVal)
      if (props.autoFilter) {
        handleFilter()
      } else {
        emit('change', { startDate: newVal, endDate: localEndDate.value })
      }
    })

    watch(localEndDate, (newVal) => {
      emit('update:endDate', newVal)
      if (props.autoFilter) {
        handleFilter()
      } else {
        emit('change', { startDate: localStartDate.value, endDate: newVal })
      }
    })

    // 处理筛选
    const handleFilter = () => {
      const filterData = {
        startDate: localStartDate.value,
        endDate: localEndDate.value
      }
      emit('filter', filterData)
    }

    // 处理重置
    const handleReset = () => {
      localStartDate.value = ''
      localEndDate.value = ''
      const resetData = {
        startDate: '',
        endDate: ''
      }
      emit('reset', resetData)
    }

    // 监听窗口大小变化
    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    // 计算样式变量
    const cssVars = computed(() => ({
      '--primary-color': props.primaryColor,
      '--primary-color-rgb': hexToRgb(props.primaryColor)
    }))

    // 十六进制颜色转RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '40, 167, 69'
    }

    return {
      isMobile,
      localStartDate,
      localEndDate,
      handleFilter,
      handleReset,
      cssVars
    }
  }
}
</script>

<style scoped>
.date-range-filter {
  --primary-color: v-bind('primaryColor');
  --primary-color-rgb: v-bind('cssVars["--primary-color-rgb"]');
}

/* Web版本样式 */
.date-filter-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.date-inputs {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.date-input-wrapper {
  position: relative;
  width: 160px;
}

.date-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
  outline: none;
}

.date-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
}

.date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.date-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

.date-label {
  position: absolute;
  top: -8px;
  left: 12px;
  background: white;
  padding: 0 4px;
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  pointer-events: none;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-filter, .btn-reset {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-filter {
  background: var(--primary-color);
  color: white;
}

.btn-filter:hover {
  filter: brightness(0.9);
  transform: translateY(-1px);
}

.btn-reset {
  background: #6c757d;
  color: white;
}

.btn-reset:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* 移动端样式 */
.mobile-date-filter {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mobile-date-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.mobile-date-input-wrapper {
  flex: 1;
  position: relative;
  min-width: 140px;
}

.mobile-date-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
  outline: none;
}

.mobile-date-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
}

.mobile-date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.mobile-date-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

.mobile-date-label {
  position: absolute;
  top: -8px;
  left: 14px;
  background: white;
  padding: 0 4px;
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  pointer-events: none;
}

.mobile-filter-buttons {
  display: flex;
  gap: 10px;
}

.mobile-btn-filter, .mobile-btn-reset {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-btn-filter {
  background: var(--primary-color);
  color: white;
}

.mobile-btn-filter:hover {
  filter: brightness(0.9);
}

.mobile-btn-reset {
  background: #6c757d;
  color: white;
}

.mobile-btn-reset:hover {
  background: #5a6268;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .date-filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .date-inputs {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  
  .date-input-wrapper {
    width: 100%;
  }
  
  .filter-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .btn-filter, .btn-reset {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .mobile-date-row {
    flex-direction: column;
  }
  
  .mobile-date-input-wrapper {
    width: 100%;
  }
}
</style> 