<template>
  <div class="withdraw-page">
    <!-- 页面标题和切换按钮 -->
    <div class="page-header">
      <h1 class="page-title">{{ currentView === 'withdraw' ? 'Withdraw Funds' : 'Withdraw History' }}</h1>
      <button 
        class="switch-view-btn" 
        @click="switchView"
      >
        {{ currentView === 'withdraw' ? 'Withdraw History' : 'Withdraw Funds' }}
      </button>
    </div>

    <!-- 提现表单视图 -->
    <div v-if="currentView === 'withdraw'" class="view-container">
      <WithdrawFunds 
        @withdraw-submitted="handleWithdrawSubmitted"
      />
    </div>

    <!-- 提现历史视图 -->
    <div v-else class="history-container">
      <div class="history-table-wrapper">
        <div class="table-responsive">
          <table class="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in currentPageData" :key="record.id">
                <td>#{{ record.id }}</td>
                <td>
                  <span class="method-badge">{{ record.method }}</span>
                </td>
                <td class="amount-cell">
                  ${{ formatAmount(record.amount) }}
                  <small class="pkr-small">PKR {{ formatPKR(record.amount * 277.65) }}</small>
                </td>
                <td>
                  <span :class="['status-badge', getStatusClass(record.status)]">
                    {{ record.status }}
                  </span>
                </td>
                <td>{{ formatDate(record.date) }}</td>
                <td>
                  <div class="action-buttons">
                    <button 
                      v-if="record.status === 'Pending'" 
                      @click="cancelWithdraw(record.id)"
                      class="btn btn-cancel"
                    >
                      Cancel
                    </button>
                    <button 
                      @click="viewDetails(record.id)"
                      class="btn btn-view"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 分页器 -->
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination.vue'
import WithdrawFunds from './components/WithdrawFunds.vue'

export default {
  name: 'Withdraw',
  components: {
    Pagination,
    WithdrawFunds
  },
  setup() {
    const currentView = ref('withdraw') // 'withdraw' 或 'history'
    const isMobile = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // 提现历史数据
    const allRecords = ref([
      {
        id: 1001,
        method: 'J99',
        amount: 100.00,
        status: 'Completed',
        date: new Date('2024-01-15')
      },
      {
        id: 1002,
        method: 'Bank Transfer',
        amount: 250.00,
        status: 'Pending',
        date: new Date('2024-01-14')
      },
      {
        id: 1003,
        method: 'USDT',
        amount: 75.50,
        status: 'Processing',
        date: new Date('2024-01-13')
      },
      {
        id: 1004,
        method: 'PayPal',
        amount: 150.00,
        status: 'Failed',
        date: new Date('2024-01-12')
      },
      {
        id: 1005,
        method: 'J99',
        amount: 300.00,
        status: 'Completed',
        date: new Date('2024-01-11')
      }
    ])

    // 计算属性
    const totalPages = computed(() => {
      return Math.ceil(allRecords.value.length / itemsPerPage.value)
    })

    const currentPageData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return allRecords.value.slice(start, end)
    })

    // 方法
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    const switchView = () => {
      console.log('Current view before switch:', currentView.value)
      currentView.value = currentView.value === 'withdraw' ? 'history' : 'withdraw'
      console.log('Current view after switch:', currentView.value)
    }

    const handleWithdrawSubmitted = (withdrawData) => {
      console.log('Withdraw submitted:', withdrawData)
      
      // 添加到历史记录
      const newRecord = {
        id: Date.now(),
        method: withdrawData.method,
        amount: withdrawData.amount,
        status: 'Pending',
        date: new Date()
      }
      allRecords.value.unshift(newRecord)
      
      // 切换到历史视图
      currentView.value = 'history'
    }

    const handlePageChange = (page) => {
      currentPage.value = page
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    }

    const formatPKR = (amount) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    }

    const getStatusClass = (status) => {
      const statusMap = {
        'Completed': 'status-completed',
        'Pending': 'status-pending',
        'Processing': 'status-processing',
        'Failed': 'status-failed',
        'Cancelled': 'status-cancelled'
      }
      return statusMap[status] || 'status-default'
    }

    const cancelWithdraw = async (id) => {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to cancel this withdraw request?',
          'Confirm Cancellation',
          {
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        
        // 模拟API调用
        console.log('Cancelling withdraw:', id)
        
        // 更新本地数据
        const record = allRecords.value.find(r => r.id === id)
        if (record) {
          record.status = 'Cancelled'
        }
        
        ElMessage.success('Withdraw request cancelled successfully')
      } catch {
        // 用户取消操作
      }
    }

    const viewDetails = (id) => {
      // 查看详情逻辑
      console.log('Viewing details for:', id)
      ElMessage.info(`Viewing details for withdraw #${id}`)
    }

    // 生命周期
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      currentView,
      isMobile,
      currentPage,
      allRecords,
      totalPages,
      currentPageData,
      switchView,
      handleWithdrawSubmitted,
      handlePageChange,
      formatDate,
      formatAmount,
      formatPKR,
      getStatusClass,
      cancelWithdraw,
      viewDetails
    }
  }
}
</script>

<style scoped>
.withdraw-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.switch-view-btn {
  background-color: #2d5016;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.switch-view-btn:hover {
  background-color: #1a2e0a;
}

/* 视图容器 */
.view-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 历史记录样式 */
.history-container {
  max-width: 1200px;
  margin: 0 auto;
}

.history-table-wrapper {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.table-responsive {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.history-table th,
.history-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.history-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.history-table td {
  font-size: 14px;
  color: #555;
}

.method-badge {
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.amount-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pkr-small {
  color: #999;
  font-size: 12px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cce5ff;
  color: #004085;
}

.status-failed {
  background-color: #f8d7da;
  color: #721c24;
}

.status-cancelled {
  background-color: #e2e3e5;
  color: #383d41;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
}

.btn-cancel:hover {
  background-color: #c82333;
}

.btn-view {
  background-color: #6c757d;
  color: white;
}

.btn-view:hover {
  background-color: #545b62;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .withdraw-page {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  
  
  .history-table-wrapper {
    padding: 15px;
  }
  
  .history-table {
    font-size: 12px;
  }
  
  .history-table th,
  .history-table td {
    padding: 8px 6px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .amount-cell {
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .history-table th:nth-child(n+4),
  .history-table td:nth-child(n+4) {
    display: none;
  }
  
  .method-badge {
    font-size: 10px;
    padding: 2px 6px;
  }
  
  .status-badge {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>
