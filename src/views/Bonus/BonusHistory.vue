<template>
  <div class="bonus-history-container">
    <!-- Web版本 -->
    <div v-if="!isMobile" class="web-bonus-history">
      <!-- 顶部总金额显示 -->
      <div class="total-amount-section">
        <div class="amount-card">
          <div class="amount-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="amount-info">
            <div class="amount-value">${{ formatCurrency(totalAmount) }}</div>
            <div class="amount-label">Bonus History Details</div>
          </div>
        </div>
        
        <!-- 日期筛选区域 -->
        <DateRangeFilter 
          v-model:start-date="startDate"
          v-model:end-date="endDate"
          @filter="applyFilter"
          @reset="resetFilter"
        />
      </div>

      <div class="history-content">
        <div class="table-container">
          <table class="bonus-table">
            <thead>
              <tr>
                <th class="bonus-header">Bonus</th>
                <th class="details-header">Details</th>
                <th class="datetime-header">Datetime</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bonus in bonusHistory" :key="bonus.id" class="bonus-row">
                <td class="bonus-cell">
                  <span class="bonus-value">${{ bonus.amount }}</span>
                </td>
                <td class="details-cell">
                  <span class="details-text">{{ bonus.details }}</span>
                </td>
                <td class="datetime-cell">
                  <span class="datetime-text">{{ formatDateTime(bonus.datetime) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 移动版本 -->
    <div v-else class="mobile-bonus-history">
      <!-- 顶部总金额显示 -->
      <div class="mobile-total-amount">
        <div class="mobile-amount-card">
          <div class="mobile-amount-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="mobile-amount-info">
            <div class="mobile-amount-value">${{ formatCurrency(totalAmount) }}</div>
            <div class="mobile-amount-label">Bonus History Details</div>
          </div>
        </div>
      </div>

      <!-- 移动端日期筛选 -->
      <DateRangeFilter 
        v-model:start-date="startDate"
        v-model:end-date="endDate"
        @filter="applyFilter"
        @reset="resetFilter"
      />

      <div class="mobile-bonus-history-list">
        <div 
          v-for="bonus in bonusHistory" 
          :key="bonus.id" 
          class="mobile-bonus-card"
        >
          <div class="bonus-card-header">
            <div class="bonus-amount-section">
              <span class="bonus-label">Bonus</span>
              <span class="bonus-amount">${{ bonus.amount }}</span>
            </div>
          </div>
          
          <div class="bonus-card-body">
            <div class="info-row">
              <span class="info-label">Details</span>
              <span class="info-value">{{ bonus.details }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Datetime</span>
              <span class="info-value">{{ formatDateTime(bonus.datetime) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Pagination -->
      <div class="pagination-section">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          :is-mobile="true"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Pagination from '@/components/Pagination.vue'
import DateRangeFilter from '@/components/DateRangeFilter.vue'

export default {
  name: 'BonusHistory',
  components: {
    Pagination,
    DateRangeFilter
  },
  setup() {
    const isMobile = ref(window.innerWidth <= 768)
    const currentPage = ref(1)
    const pageSize = ref(12)
    const totalAmount = ref(8888.00)
    const startDate = ref('')
    const endDate = ref('')
    const originalBonusHistory = ref([])
    const filteredBonusHistory = ref([])

    // 模拟奖励历史数据
    const allBonusHistory = ref([
      {
        id: 1,
        amount: 15,
        details: 'Rank from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 2,
        amount: 15,
        details: 'HonorRank from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 3,
        amount: 15,
        details: 'Self pv from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 4,
        amount: 15,
        details: 'Self pv from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 5,
        amount: 15,
        details: 'Repeat Purchase from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 6,
        amount: 15,
        details: 'Direct Bonus zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 7,
        amount: 15,
        details: 'InDirect Bonus from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 8,
        amount: 15,
        details: 'Pairing Bonus from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 9,
        amount: 15,
        details: 'ThankYou Bonus from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 10,
        amount: 15,
        details: 'Contribute Bonus from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 11,
        amount: 15,
        details: 'Honor Bonus from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 12,
        amount: 15,
        details: 'Honor Bonus from zaznq92',
        datetime: '2025-02-05 16:37:00'
      },
      // 添加更多历史数据用于分页测试
      {
        id: 13,
        amount: 25,
        details: 'Leadership Bonus from user123',
        datetime: '2021-11-06 14:20:00'
      },
      {
        id: 14,
        amount: 20,
        details: 'Team Bonus from user456',
        datetime: '2021-11-05 12:15:00'
      },
      {
        id: 15,
        amount: 30,
        details: 'Achievement Bonus from system',
        datetime: '2021-11-04 10:30:00'
      },
      {
        id: 16,
        amount: 15,
        details: 'Referral Bonus from newuser',
        datetime: '2021-11-03 16:45:00'
      },
      {
        id: 17,
        amount: 40,
        details: 'Monthly Bonus from admin',
        datetime: '2021-11-02 09:00:00'
      },
      {
        id: 18,
        amount: 15,
        details: 'Activity Bonus from zaznq92',
        datetime: '2021-11-01 18:30:00'
      },
      {
        id: 19,
        amount: 35,
        details: 'Performance Bonus from manager',
        datetime: '2021-10-31 11:20:00'
      },
      {
        id: 20,
        amount: 15,
        details: 'Welcome Bonus from zaznq92',
        datetime: '2021-10-30 15:10:00'
      }
    ])

    // 初始化数据
    originalBonusHistory.value = [...allBonusHistory.value]
    filteredBonusHistory.value = [...allBonusHistory.value]

    // 计算分页数据
    const bonusHistory = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredBonusHistory.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredBonusHistory.value.length / pageSize.value)
    })

    // 格式化货币
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    }

    // 格式化日期时间
    const formatDateTime = (datetime) => {
      const date = new Date(datetime)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(',', ' @').replace(' ', ' ').toLowerCase().replace('am', 'am').replace('pm', 'pm')
    }

    // 处理页面变化
    const handlePageChange = (page) => {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 应用日期筛选
    const applyFilter = (filterData) => {
      let filtered = [...originalBonusHistory.value]
      
      if (filterData.startDate || filterData.endDate) {
        filtered = filtered.filter(bonus => {
          const bonusDate = new Date(bonus.datetime)
          const start = filterData.startDate ? new Date(filterData.startDate) : null
          const end = filterData.endDate ? new Date(filterData.endDate + ' 23:59:59') : null
          
          if (start && bonusDate < start) return false
          if (end && bonusDate > end) return false
          return true
        })
      }
      
      filteredBonusHistory.value = filtered
      currentPage.value = 1 // 重置到第一页
    }

    // 重置筛选
    const resetFilter = () => {
      filteredBonusHistory.value = [...originalBonusHistory.value]
      currentPage.value = 1
    }

    // 监听窗口大小变化
    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    return {
      isMobile,
      bonusHistory,
      currentPage,
      totalPages,
      totalAmount,
      startDate,
      endDate,
      formatCurrency,
      formatDateTime,
      handlePageChange,
      applyFilter,
      resetFilter
    }
  }
}
</script>

<style scoped>
/* 基础容器样式 */
.bonus-history-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Web版本样式 */
.web-bonus-history {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.total-amount-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.amount-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.amount-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.amount-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.amount-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.amount-label {
  font-size: 16px;
  color: #6c757d;
  margin: 0;
}

/* 日期筛选组件样式调整 */
.total-amount-section :deep(.date-range-filter) {
  margin: 0;
}

/* 历史记录内容样式 */
.history-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.bonus-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.bonus-table thead {
  background: #f8f9fa;
}

.bonus-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.bonus-header {
  width: 120px;
}

.details-header {
  width: auto;
}

.datetime-header {
  width: 200px;
}

.bonus-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
}

.bonus-row:hover {
  background-color: #f8f9fa;
}

.bonus-value {
  font-weight: 600;
  color: #28a745;
  font-size: 16px;
}

.details-text {
  color: #495057;
}

.datetime-text {
  color: #6c757d;
  font-size: 13px;
}

/* 移动端样式 */
.mobile-bonus-history {
  padding: 15px;
}

.mobile-total-amount {
  margin-bottom: 20px;
}

.mobile-amount-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mobile-amount-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.mobile-amount-info {
  flex: 1;
}

.mobile-amount-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.mobile-amount-label {
  font-size: 14px;
  color: #6c757d;
}

/* 移动端样式调整 */
.mobile-bonus-history :deep(.date-range-filter) {
  margin-bottom: 20px;
}

/* 移动端历史记录列表 */
.mobile-bonus-history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.mobile-bonus-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.mobile-bonus-card:hover {
  transform: translateY(-2px);
}

.bonus-card-header {
  background: #f8f9fa;
  padding: 15px 20px;
  border-bottom: 1px solid #dee2e6;
}

.bonus-amount-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bonus-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.bonus-amount {
  font-size: 18px;
  font-weight: bold;
  color: #28a745;
}

.bonus-card-body {
  padding: 15px 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
  min-width: 80px;
}

.info-value {
  font-size: 14px;
  color: #495057;
  text-align: right;
  flex: 1;
  margin-left: 15px;
  word-break: break-word;
}

/* 分页样式 */
.pagination-section {
  padding: 20px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .total-amount-section {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
}
</style> 