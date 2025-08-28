<template>
  <div class="withdraw-history-container">
    <!-- Web版本 -->
    <div v-if="!isMobile" class="web-withdraw-history">
      <div class="history-header">
        <div class="header-left">
          <h2 class="history-title">Withdraw History</h2>
        </div>
        <div class="header-right">
          <button class="btn btn-success" @click="withdrawNow">
            <i class="fas fa-plus me-1"></i>Withdraw Now
          </button>
        </div>
      </div>

      <div class="history-content">
        <div class="table-container">
          <table class="withdraw-table">
            <thead>
              <tr>
                <th>Withdrawal ID</th>
                <th>Withdrawal Amt</th>
                <th>Status</th>
                <th>Withdrawal Time</th>
                <th>Approved Time</th>
                <th>Approved User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="withdrawal in withdrawals" :key="withdrawal.id" class="withdraw-row">
                <td class="id-cell">
                  <span class="withdrawal-id">{{ withdrawal.withdrawalId }}</span>
                </td>
                <td class="amount-cell">
                  <span class="amount-value">${{ formatAmount(withdrawal.amount) }}</span>
                </td>
                <td class="status-cell">
                  <span class="status-badge" :class="getStatusClass(withdrawal.status)">
                    {{ getStatusText(withdrawal.status) }}
                  </span>
                </td>
                <td class="time-cell">
                  <span class="time-text">{{ withdrawal.withdrawalTime }}</span>
                </td>
                <td class="approved-time-cell">
                  <span class="approved-time-text">{{ withdrawal.approvedTime || '---' }}</span>
                </td>
                <td class="user-cell">
                  <span class="user-text">{{ withdrawal.approvedUser || '---' }}</span>
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
    <div v-else class="mobile-withdraw-history">
      <div class="mobile-header">
        <div class="mobile-header-left">
          <h3 class="mobile-title">Withdraw History</h3>
        </div>
        <button class="btn btn-success btn-sm" @click="withdrawNow">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <!-- Withdraw Funds Section -->
      <div class="withdraw-funds-section">
        <h4 class="section-title">Withdraw Funds</h4>
        <div class="mobile-withdrawals">
          <div 
            v-for="withdrawal in withdrawals" 
            :key="withdrawal.id" 
            class="mobile-withdraw-card"
            :class="getCardClass(withdrawal.status)"
          >
            <div class="withdraw-card-header">
              <div class="withdrawal-info">
                <div class="withdrawal-id-section">
                  <span class="id-label">Withdrawal ID</span>
                  <span class="id-value">{{ withdrawal.withdrawalId }}</span>
                </div>
                <div class="amount-section">
                  <span class="amount-label">Withdrawal Amt</span>
                  <span class="amount-value">${{ formatAmount(withdrawal.amount) }}</span>
                </div>
              </div>
              <span class="status-badge" :class="getStatusClass(withdrawal.status)">
                {{ getStatusText(withdrawal.status) }}
              </span>
            </div>
            
            <div class="withdraw-card-body">
              <div class="info-row">
                <span class="info-label">Withdrawal Time</span>
                <span class="info-value">{{ withdrawal.withdrawalTime }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Approved Time</span>
                <span class="info-value">{{ withdrawal.approvedTime || '---' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Approved User</span>
                <span class="info-value">{{ withdrawal.approvedUser || '---' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-section">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          :is-mobile="true"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- WithdrawFunds Component -->
    <WithdrawFunds 
      :visible="showWithdrawModal"
      :is-mobile="isMobile"
      :show-history-button="false"
      @close="closeWithdrawModal"
      @submit="handleWithdrawSubmit"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Pagination from '@/components/Pagination.vue'
import WithdrawFunds from './components/WithdrawFunds.vue'

export default {
  name: 'WithdrawHistory',
  components: {
    Pagination,
    WithdrawFunds
  },
  setup() {
    const isMobile = ref(window.innerWidth <= 768)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const showWithdrawModal = ref(false)
    
    // 模拟提现历史数据
    const allWithdrawals = ref([
      {
        id: 1,
        withdrawalId: '301234567890000005',
        amount: 1.00,
        status: 'pending',
        withdrawalTime: 'Feb 05 2025 @4:37:pm',
        approvedTime: null,
        approvedUser: null
      },
      {
        id: 2,
        withdrawalId: '301234567890000004',
        amount: 1.00,
        status: 'pending',
        withdrawalTime: 'Feb 05 2025 @3:37:pm',
        approvedTime: null,
        approvedUser: null
      },
      {
        id: 3,
        withdrawalId: '301234567890000003',
        amount: 12.00,
        status: 'failed',
        withdrawalTime: 'Feb 05 2025 @2:37:pm',
        approvedTime: 'Feb 07 2025 @12:00:pm',
        approvedUser: 'Sanaullah Khanum'
      },
      {
        id: 4,
        withdrawalId: '301234567890000002',
        amount: 99999.99,
        status: 'settlement',
        withdrawalTime: 'Feb 05 2025 @1:37:pm',
        approvedTime: 'Feb 07 2025 @12:00:pm',
        approvedUser: 'Sanaullah Khanum'
      },
      {
        id: 5,
        withdrawalId: '301234567890000001',
        amount: 99999.99,
        status: 'settlement',
        withdrawalTime: 'Feb 05 2025 @12:37:am',
        approvedTime: 'Feb 07 2025 @12:00:pm',
        approvedUser: 'Sanaullah Khanum'
      },
      // 添加更多数据用于测试分页
      {
        id: 6,
        withdrawalId: '301234567890000006',
        amount: 250.00,
        status: 'pending',
        withdrawalTime: 'Feb 04 2025 @6:15:pm',
        approvedTime: null,
        approvedUser: null
      },
      {
        id: 7,
        withdrawalId: '301234567890000007',
        amount: 500.00,
        status: 'settlement',
        withdrawalTime: 'Feb 04 2025 @2:30:pm',
        approvedTime: 'Feb 06 2025 @10:45:am',
        approvedUser: 'Admin User'
      },
      {
        id: 8,
        withdrawalId: '301234567890000008',
        amount: 75.50,
        status: 'failed',
        withdrawalTime: 'Feb 03 2025 @11:20:am',
        approvedTime: 'Feb 04 2025 @9:15:am',
        approvedUser: 'System Admin'
      },
      {
        id: 9,
        withdrawalId: '301234567890000009',
        amount: 1000.00,
        status: 'settlement',
        withdrawalTime: 'Feb 02 2025 @4:45:pm',
        approvedTime: 'Feb 03 2025 @1:30:pm',
        approvedUser: 'Sanaullah Khanum'
      },
      {
        id: 10,
        withdrawalId: '301234567890000010',
        amount: 25.00,
        status: 'pending',
        withdrawalTime: 'Feb 01 2025 @8:00:am',
        approvedTime: null,
        approvedUser: null
      },
      {
        id: 11,
        withdrawalId: '301234567890000011',
        amount: 150.00,
        status: 'settlement',
        withdrawalTime: 'Jan 31 2025 @3:15:pm',
        approvedTime: 'Feb 01 2025 @11:00:am',
        approvedUser: 'Finance Team'
      },
      {
        id: 12,
        withdrawalId: '301234567890000012',
        amount: 300.00,
        status: 'failed',
        withdrawalTime: 'Jan 30 2025 @7:30:pm',
        approvedTime: 'Jan 31 2025 @2:45:pm',
        approvedUser: 'Admin User'
      }
    ])

    // 计算分页数据
    const withdrawals = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return allWithdrawals.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(allWithdrawals.value.length / pageSize.value)
    })

    // 格式化金额
    const formatAmount = (amount) => {
      return amount.toFixed(2)
    }

    // 获取状态样式类
    const getStatusClass = (status) => {
      switch (status) {
        case 'pending':
          return 'status-pending'
        case 'settlement':
          return 'status-settlement'
        case 'failed':
          return 'status-failed'
        default:
          return 'status-pending'
      }
    }

    // 获取状态文本
    const getStatusText = (status) => {
      switch (status) {
        case 'pending':
          return 'Pending'
        case 'settlement':
          return 'Settlement'
        case 'failed':
          return 'Failed'
        default:
          return 'Pending'
      }
    }

    // 获取卡片样式类
    const getCardClass = (status) => {
      switch (status) {
        case 'settlement':
          return 'card-success'
        case 'failed':
          return 'card-failed'
        case 'pending':
        default:
          return 'card-pending'
      }
    }

    // 处理页面变化
    const handlePageChange = (page) => {
      currentPage.value = page
      // Scroll to top to show new page content
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 提现按钮点击
    const withdrawNow = () => {
      showWithdrawModal.value = true
    }

    // 关闭提现模态框
    const closeWithdrawModal = () => {
      showWithdrawModal.value = false
    }

    // 处理提现提交
    const handleWithdrawSubmit = (withdrawalData) => {
      console.log('Withdrawal submitted:', withdrawalData)
      // 这里可以添加API调用逻辑
      // 可以选择将新的提现记录添加到列表中
      const newWithdrawal = {
        id: Date.now(),
        withdrawalId: `301${Date.now()}`,
        amount: withdrawalData.amount,
        status: 'pending',
        withdrawalTime: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(',', ' @') + 'm',
        approvedTime: null,
        approvedUser: null
      }
      
      // 将新的提现记录添加到列表顶部
      allWithdrawals.value.unshift(newWithdrawal)
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
      withdrawals,
      currentPage,
      totalPages,
      showWithdrawModal,
      formatAmount,
      getStatusClass,
      getStatusText,
      getCardClass,
      handlePageChange,
      withdrawNow,
      closeWithdrawModal,
      handleWithdrawSubmit
    }
  }
}
</script>

<style scoped>
/* 容器样式 */
.withdraw-history-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

/* Web版本样式 */
.web-withdraw-history {
  max-width: 1200px;
  margin: 0 auto;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 10px;
}

.history-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.withdraw-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.withdraw-table thead {
  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;
}

.withdraw-table th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 500;
  color: #6c757d;
  white-space: nowrap;
  font-size: 14px;
}

.withdraw-table tbody tr {
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;
}

.withdraw-table tbody tr:hover {
  background-color: #f8f9fa;
}

.withdraw-table td {
  padding: 16px 12px;
  vertical-align: middle;
}

.withdrawal-id {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #495057;
}

.amount-value {
  font-weight: 600;
  color: #28a745;
  font-size: 15px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-settlement {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-failed {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.time-text,
.approved-time-text,
.user-text {
  color: #495057;
  font-size: 13px;
}

/* 移动版本样式 */
.mobile-withdraw-history {
  padding: 0;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mobile-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mobile-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.withdraw-funds-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  padding: 0 20px;
}

.mobile-withdrawals {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-withdraw-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
}

.card-pending {
  border-left-color: #ffc107;
}

.card-settlement {
  border-left-color: #28a745;
}

.card-failed {
  border-left-color: #dc3545;
}

.withdraw-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.withdrawal-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.withdrawal-id-section,
.amount-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.id-label,
.amount-label {
  font-size: 11px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
}

.id-value {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #495057;
  font-weight: 500;
}

.amount-value {
  font-size: 16px;
  font-weight: 600;
  color: #28a745;
}

.withdraw-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.info-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  min-width: 100px;
}

.info-value {
  font-size: 13px;
  color: #495057;
  text-align: right;
  flex: 1;
}

.pagination-section {
  margin-top: 20px;
  padding: 0 20px;
}

/* 按钮样式 */
.btn {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 14px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
  transform: translateY(-1px);
}

.me-1 {
  margin-right: 4px;
}

.fas {
  font-size: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .withdraw-history-container {
    padding: 15px;
  }
  
  .mobile-header {
    margin-bottom: 15px;
  }
  
  .mobile-withdrawals {
    gap: 10px;
  }
  
  .mobile-withdraw-card {
    padding: 14px;
  }
  
  .section-title {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .withdraw-history-container {
    padding: 10px;
  }
  
  .mobile-title {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 14px;
    padding: 0 10px;
  }
  
  .withdrawal-info {
    gap: 6px;
  }
  
  .id-value {
    font-size: 12px;
  }
  
  .amount-value {
    font-size: 14px;
  }
  
  .info-label {
    min-width: 80px;
    font-size: 11px;
  }
  
  .info-value {
    font-size: 12px;
  }
}
</style>
