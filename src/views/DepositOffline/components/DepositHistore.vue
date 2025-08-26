<template>
  <div class="deposit-history-container">
    <!-- 桌面端表格 -->
    <div class="desktop-table" v-show="!isMobile">
      <div class="table-container">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Deposit ID</th>
                <th>Deposit Amt</th>
                <th>Status</th>
                <th>Deposit Time</th>
                <th>Approved Time</th>
                <th>Approved User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in currentPageData" :key="record.id">
                <td class="deposit-id">{{ record.id }}</td>
                <td class="amount">{{ formatAmount(record.amount) }}</td>
                <td>
                  <span class="status-badge" :class="getStatusClass(record.status)">
                    {{ record.status }}
                  </span>
                </td>
                <td>{{ formatDateTime(record.depositTime) }}</td>
                <td>{{ record.approvedTime ? formatDateTime(record.approvedTime) : '---' }}</td>
                <td>{{ record.approvedUser || '---' }}</td>
                <td>
                  <div class="action-buttons">
                    <button 
                      v-if="record.screenshot" 
                      class="view-screenshot-btn"
                      @click="viewScreenshot(record.screenshot)"
                      title="View Screenshot"
                    >
                      <i class="fas fa-image"></i>
                    </button>
                    <button 
                      v-if="record.status === 'Pending'"
                      class="cancel-btn"
                      @click="cancelDeposit(record.id)"
                      title="Cancel Deposit"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 移动端卡片 -->
    <div class="mobile-records" v-show="isMobile">
      <div 
        v-for="record in currentPageData" 
        :key="record.id" 
        class="record-card"
      >
        <div class="record-header">
          <div class="record-id">ID: {{ record.id }}</div>
          <div class="record-amount">{{ formatAmount(record.amount) }}</div>
        </div>
        
        <div class="record-body">
          <div class="record-item">
            <span class="label">Status:</span>
            <span class="status-badge" :class="getStatusClass(record.status)">
              {{ record.status }}
            </span>
          </div>
          
          <div class="record-item">
            <span class="label">Deposit Time:</span>
            <span class="value">{{ formatDateTime(record.depositTime) }}</span>
          </div>
          
          <div class="record-item" v-if="record.approvedTime">
            <span class="label">Approved Time:</span>
            <span class="value">{{ formatDateTime(record.approvedTime) }}</span>
          </div>

          <div class="record-item" v-if="record.approvedUser">
            <span class="label">Approved User:</span>
            <span class="value">{{ record.approvedUser }}</span>
          </div>
          
          <div class="record-actions">
            <button 
              v-if="record.screenshot" 
              class="view-screenshot-btn mobile"
              @click="viewScreenshot(record.screenshot)"
            >
              <i class="fas fa-image me-1"></i>
              View Screenshot
            </button>
            
            <button 
              v-if="record.status === 'Pending'"
              class="cancel-btn mobile"
              @click="cancelDeposit(record.id)"
            >
              <i class="fas fa-times me-1"></i>
              Cancel Deposit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!allRecords.length" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-history"></i>
      </div>
      <h3>No Deposit History</h3>
      <p>You haven't made any deposits yet.</p>
    </div>

    <!-- 分页 -->
    <Pagination 
      v-if="allRecords.length > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      :is-mobile="isMobile"
      @page-change="handlePageChange"
    />

    <!-- 截图查看模态框 -->
    <div v-if="showScreenshotModal" class="screenshot-modal" @click="closeScreenshotModal">
      <div class="screenshot-modal-content" @click.stop>
        <button class="close-modal-btn" @click="closeScreenshotModal">
          <i class="fas fa-times"></i>
        </button>
        <img :src="currentScreenshot" alt="Payment Screenshot" class="screenshot-image" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'DepositHistore',
  components: {
    Pagination
  },
  props: {
    // 可以通过props接收外部数据
    records: {
      type: Array,
      default: () => []
    }
  },
  emits: ['deposit-cancelled'],
  setup(props, { emit }) {
    const isMobile = ref(false)
    const currentPage = ref(1)
    const showScreenshotModal = ref(false)
    const currentScreenshot = ref('')
    
    // 存款历史数据 - 如果没有传入props则使用默认数据
    const allRecords = ref(props.records.length > 0 ? props.records : [
      {
        id: '301234567890000005',
        amount: 3.00,
        status: 'Pending',
        depositTime: '2025-02-05T16:37:00Z',
        approvedTime: null,
        approvedUser: null,
        screenshot: 'https://via.placeholder.com/400x300/FF9800/white?text=Payment+Screenshot'
      },
      {
        id: '301234567890000004',
        amount: 1.00,
        status: 'Pending',
        depositTime: '2025-02-05T15:37:00Z',
        approvedTime: null,
        approvedUser: null,
        screenshot: 'https://via.placeholder.com/400x300/FF9800/white?text=Payment+Screenshot'
      },
      {
        id: '301234567890000003',
        amount: 12.00,
        status: 'Failed',
        depositTime: '2025-02-05T14:37:00Z',
        approvedTime: '2025-02-07T12:00:00Z',
        approvedUser: 'Sanaullah Khanum',
        screenshot: 'https://via.placeholder.com/400x300/F44336/white?text=Payment+Screenshot'
      },
      {
        id: '301234567890000002',
        amount: 99999.99,
        status: 'Settlement',
        depositTime: '2025-02-05T13:37:00Z',
        approvedTime: '2025-02-07T12:00:00Z',
        approvedUser: 'Sanaullah Khanum',
        screenshot: 'https://via.placeholder.com/400x300/4CAF50/white?text=Payment+Screenshot'
      },
      {
        id: '301234567890000001',
        amount: 99999.99,
        status: 'Settlement',
        depositTime: '2025-02-05T12:37:00Z',
        approvedTime: '2025-02-07T12:00:00Z',
        approvedUser: 'Sanaullah Khanum',
        screenshot: 'https://via.placeholder.com/400x300/4CAF50/white?text=Payment+Screenshot'
      }
    ])

    // 响应式检测移动设备
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }
    
    // 根据设备类型设置每页显示数量
    const pageSize = computed(() => {
      return isMobile.value ? 5 : 10
    })

    // 计算属性
    const totalPages = computed(() => {
      return Math.ceil(allRecords.value.length / pageSize.value)
    })

    const currentPageData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return allRecords.value.slice(start, end)
    })

    // 历史记录相关方法
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return '---'
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    }

    const getStatusClass = (status) => {
      const statusClasses = {
        'Settlement': 'status-settlement',
        'Pending': 'status-pending', 
        'Failed': 'status-failed'
      }
      return statusClasses[status] || ''
    }

    const viewScreenshot = (screenshot) => {
      currentScreenshot.value = screenshot
      showScreenshotModal.value = true
    }

    const closeScreenshotModal = () => {
      showScreenshotModal.value = false
      currentScreenshot.value = ''
    }

    const cancelDeposit = async (id) => {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to cancel this deposit request?',
          'Confirm Cancellation',
          {
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        
        // 模拟API调用
        console.log('Cancelling deposit:', id)
        
        // 更新本地数据
        const record = allRecords.value.find(r => r.id === id)
        if (record) {
          record.status = 'Cancelled'
        }
        
        // 触发父组件事件
        emit('deposit-cancelled', id)
        
        ElMessage.success('Deposit request cancelled successfully')
      } catch {
        // 用户取消操作
      }
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
      isMobile,
      currentPage,
      showScreenshotModal,
      currentScreenshot,
      allRecords,
      totalPages,
      currentPageData,
      handlePageChange,
      formatDateTime,
      formatAmount,
      getStatusClass,
      viewScreenshot,
      closeScreenshotModal,
      cancelDeposit
    }
  }
}
</script>

<style scoped>
/* 存款历史样式 */
.deposit-history-container {
  max-width: 1200px;
  margin: 0 auto;
}

.desktop-table .table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin: 0;
  font-size: 14px;
}

.table th {
  background-color: #f8f9fa;
  border-top: none;
  border-bottom: 2px solid #e9ecef;
  color: #495057;
  font-weight: 600;
  padding: 16px 12px;
  white-space: nowrap;
}

.table td {
  padding: 16px 12px;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
}

.deposit-id {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #666;
}

.amount {
  font-weight: 600;
  color: #28a745;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-settlement {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-failed {
  background-color: #f8d7da;
  color: #721c24;
}

.view-screenshot-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-screenshot-btn:hover {
  background-color: #0056b3;
}

.view-screenshot-btn.mobile {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  min-width: auto;
  height: auto;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn:hover {
  background-color: #c82333;
}

.cancel-btn.mobile {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  width: 100%;
  min-width: auto;
  height: auto;
  margin-top: 10px;
}

/* 移动端历史记录样式 */
.mobile-records {
  margin-bottom: 20px;
}

.record-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.record-id {
  font-size: 13px;
  color: #6c757d;
  font-family: 'Courier New', monospace;
}

.record-amount {
  font-size: 18px;
  font-weight: 600;
  color: #28a745;
}

.record-body {
  padding: 16px 20px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-item:last-child {
  margin-bottom: 0;
}

.record-item .label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
  min-width: 100px;
}

.record-item .value {
  font-size: 14px;
  color: #333;
  text-align: right;
  flex: 1;
}

.record-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 48px;
  color: #dee2e6;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #495057;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* 截图模态框 */
.screenshot-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.screenshot-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.close-modal-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.screenshot-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .deposit-history-container {
    padding: 0 15px;
  }
  
  .record-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .record-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .record-item .value {
    text-align: left;
  }
}

@media (max-width: 576px) {
  .table th,
  .table td {
    padding: 8px 6px;
    font-size: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .view-screenshot-btn,
  .cancel-btn {
    padding: 4px 6px;
    font-size: 10px;
    min-width: 28px;
    height: 28px;
  }
}
</style>
