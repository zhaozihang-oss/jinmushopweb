<template>
  <div class="bonus-log-container">
    <!-- Web版本 -->
    <div v-if="!isMobile" class="web-bonus-log">
      <!-- 顶部总金额显示 -->
      <div class="total-amount-section">
        <div class="amount-card">
          <div class="amount-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="amount-info">
            <div class="amount-value">${{ formatCurrency(totalAmount) }}</div>
            <div class="amount-label">Bonus Log Current Week</div>
          </div>
        </div>
      </div>

      <div class="log-content">
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
              <tr v-for="bonus in bonusLogs" :key="bonus.id" class="bonus-row">
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
    <div v-else class="mobile-bonus-log">
      <!-- 顶部总金额显示 -->
      <div class="mobile-total-amount">
        <div class="mobile-amount-card">
          <div class="mobile-amount-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="mobile-amount-info">
            <div class="mobile-amount-value">${{ formatCurrency(totalAmount) }}</div>
            <div class="mobile-amount-label">Bonus Log Current Week</div>
          </div>
        </div>
      </div>

      <div class="mobile-bonus-logs">
        <div 
          v-for="bonus in bonusLogs" 
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

export default {
  name: 'BonusLog',
  components: {
    Pagination
  },
  setup() {
    const isMobile = ref(window.innerWidth <= 768)
    const currentPage = ref(1)
    const pageSize = ref(12)
    const totalAmount = ref(8888.00)

    // 模拟奖励日志数据
    const allBonusLogs = ref([
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
      // 第二页数据
      {
        id: 13,
        amount: 25,
        details: 'Leadership Bonus from user123',
        datetime: '2025-02-04 14:22:00'
      },
      {
        id: 14,
        amount: 30,
        details: 'Team Performance Bonus',
        datetime: '2025-02-04 12:15:00'
      },
      {
        id: 15,
        amount: 20,
        details: 'Monthly Achievement Bonus',
        datetime: '2025-02-04 10:30:00'
      },
      {
        id: 16,
        amount: 15,
        details: 'Referral Commission from newuser',
        datetime: '2025-02-03 16:45:00'
      },
      {
        id: 17,
        amount: 35,
        details: 'Special Promotion Bonus',
        datetime: '2025-02-03 14:20:00'
      },
      {
        id: 18,
        amount: 15,
        details: 'Weekly Goal Achievement',
        datetime: '2025-02-03 11:30:00'
      },
      {
        id: 19,
        amount: 40,
        details: 'Volume Bonus Distribution',
        datetime: '2025-02-02 15:15:00'
      },
      {
        id: 20,
        amount: 15,
        details: 'Network Growth Bonus',
        datetime: '2025-02-02 13:40:00'
      },
      {
        id: 21,
        amount: 28,
        details: 'Binary Matching Bonus',
        datetime: '2025-02-01 17:25:00'
      },
      {
        id: 22,
        amount: 15,
        details: 'Infinite Bonus Calculation',
        datetime: '2025-02-01 16:10:00'
      },
      {
        id: 23,
        amount: 32,
        details: 'Rank Advancement Bonus',
        datetime: '2025-01-31 14:55:00'
      },
      {
        id: 24,
        amount: 15,
        details: 'Direct Sponsor Commission',
        datetime: '2025-01-31 12:30:00'
      }
    ])

    // 计算分页数据
    const bonusLogs = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return allBonusLogs.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(allBonusLogs.value.length / pageSize.value)
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
      // Scroll to top to show new page content
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
      bonusLogs,
      currentPage,
      totalPages,
      totalAmount,
      formatCurrency,
      formatDateTime,
      handlePageChange
    }
  }
}
</script>

<style scoped>
/* 容器样式 */
.bonus-log-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Web版本样式 */
.web-bonus-log {
  max-width: 1200px;
  margin: 0 auto;
}

/* 顶部总金额显示 */
.total-amount-section {
  margin-bottom: 30px;
}

.amount-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.amount-icon {
  width: 60px;
  height: 60px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.amount-info {
  flex: 1;
}

.amount-value {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.amount-label {
  font-size: 16px;
  color: #6c757d;
  font-weight: 500;
}

/* 日志内容 */
.log-content {
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
  background-color: #f8f9fa;
}

.bonus-table th {
  padding: 20px 24px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
}

.bonus-header {
  color: #28a745;
  font-weight: 700;
}

.bonus-table td {
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.bonus-row:hover {
  background-color: #f8f9fa;
}

.bonus-value {
  font-size: 16px;
  font-weight: 700;
  color: #28a745;
}

.details-text {
  color: #495057;
  font-weight: 500;
}

.datetime-text {
  color: #6c757d;
  font-size: 13px;
}

/* 移动版本样式 */
.mobile-bonus-log {
  max-width: 100%;
}

.mobile-total-amount {
  margin-bottom: 20px;
}

.mobile-amount-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.mobile-amount-icon {
  width: 50px;
  height: 50px;
  background: #28a745;
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
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 3px;
}

.mobile-amount-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.mobile-bonus-logs {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.mobile-bonus-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.bonus-card-header {
  background: #f8f9fa;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
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
  font-weight: 700;
  color: #28a745;
}

.bonus-card-body {
  padding: 15px 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
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
  font-weight: 500;
  text-align: right;
  flex: 1;
  margin-left: 10px;
}

.pagination-section {
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .bonus-log-container {
    padding: 15px;
  }
  
  .amount-card {
    padding: 20px;
    gap: 15px;
  }
  
  .amount-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .amount-value {
    font-size: 28px;
  }
  
  .amount-label {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .bonus-log-container {
    padding: 10px;
  }
  
  .mobile-amount-card {
    padding: 15px;
  }
  
  .mobile-amount-value {
    font-size: 24px;
  }
  
  .mobile-bonus-card {
    margin-bottom: 10px;
  }
  
  .bonus-card-header,
  .bonus-card-body {
    padding: 12px 15px;
  }
}
</style> 