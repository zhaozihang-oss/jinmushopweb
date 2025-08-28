<template>
  <div class="bt-history-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">BT History</h2>
      <button class="btn btn-success" @click="goToBTNow">
        BT Now
      </button>
    </div>

    <!-- 主要内容 -->
    <div class="content-section">
      <!-- Desktop Table -->
      <div v-if="!isMobile" class="desktop-table">
        <div class="table-responsive">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>BT ID</th>
                <th>BT Amt</th>
                <th>Status</th>
                <th>BT Time</th>
                <th>Approved Time</th>
                <th>Approved User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in btRecords" :key="record.id">
                <td class="bt-id">{{ record.id }}</td>
                <td class="bt-amount">{{ formatAmount(record.amount) }}</td>
                <td>
                  <span class="status-badge" :class="getStatusClass(record.status)">
                    {{ record.status }}
                  </span>
                </td>
                <td class="bt-time">{{ formatDateTime(record.btTime) }}</td>
                <td class="approved-time">
                  {{ record.approvedTime ? formatDateTime(record.approvedTime) : '---' }}
                </td>
                <td class="approved-user">
                  {{ record.approvedUser || '---' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div v-else class="mobile-cards">
        <div 
          v-for="record in btRecords" 
          :key="record.id"
          class="mobile-card"
        >
          <div class="card-header">
            <div class="bt-id">{{ record.id }}</div>
            <span class="status-badge" :class="getStatusClass(record.status)">
              {{ record.status }}
            </span>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="label">Amount:</span>
              <span class="value amount">{{ formatAmount(record.amount) }}</span>
            </div>
            <div class="card-row">
              <span class="label">BT Time:</span>
              <span class="value">{{ formatDateTime(record.btTime) }}</span>
            </div>
            <div class="card-row" v-if="record.approvedTime">
              <span class="label">Approved Time:</span>
              <span class="value">{{ formatDateTime(record.approvedTime) }}</span>
            </div>
            <div class="card-row" v-if="record.approvedUser">
              <span class="label">Approved User:</span>
              <span class="value">{{ record.approvedUser }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'BTHistory',
  emits: ['back'],
  setup(props, { emit }) {
    // 响应式数据
    const isMobile = ref(window.innerWidth <= 768)

    // 模拟数据 - 完全匹配图片中的数据
    const btRecords = ref([
      {
        id: '301234567890000005',
        amount: 1.00,
        status: 'Pending',
        btTime: '2025-02-05T16:37:00',
        approvedTime: null,
        approvedUser: null
      },
      {
        id: '301234567890000004',
        amount: 1.00,
        status: 'Pending',
        btTime: '2025-02-05T15:37:00',
        approvedTime: null,
        approvedUser: null
      },
      {
        id: '301234567890000003',
        amount: 12.00,
        status: 'Failed',
        btTime: '2025-02-05T14:37:00',
        approvedTime: '2025-02-07T12:00:00',
        approvedUser: 'Sanaullah Khanum'
      },
      {
        id: '301234567890000002',
        amount: 99999.99,
        status: 'Settlement',
        btTime: '2025-02-05T13:37:00',
        approvedTime: '2025-02-07T12:00:00',
        approvedUser: 'Sanaullah Khanum'
      },
      {
        id: '301234567890000001',
        amount: 99999.99,
        status: 'Settlement',
        btTime: '2025-02-05T12:37:00',
        approvedTime: '2025-02-07T12:00:00',
        approvedUser: 'Sanaullah Khanum'
      }
    ])

    // 方法
    const formatAmount = (amount) => {
      return parseFloat(amount || 0).toFixed(2)
    }

    const formatDateTime = (dateTime) => {
      if (!dateTime) return '---'
      const date = new Date(dateTime)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }) + ' @' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'Pending':
          return 'status-pending'
        case 'Settlement':
          return 'status-settlement'
        case 'Failed':
          return 'status-failed'
        default:
          return ''
      }
    }

    const goToBTNow = () => {
      emit('back')
    }

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    return {
      isMobile,
      btRecords,
      formatAmount,
      formatDateTime,
      getStatusClass,
      goToBTNow
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.bt-history-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
}

/* 内容区域 */
.content-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
  overflow: hidden;
}

/* 桌面端表格 */
.desktop-table {
  padding: 0;
}

.table {
  margin-bottom: 0;
  font-size: 14px;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  border-top: none;
  padding: 1rem 1.5rem;
  white-space: nowrap;
}

.table td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
  border-top: 1px solid #dee2e6;
  color: #495057;
}

.bt-id {
  font-family: 'Courier New', monospace;
  font-weight: 500;
  color: #495057;
  font-size: 13px;
}

.bt-amount {
  font-weight: 600;
  color: #333;
}

/* 状态标签 */
.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  display: inline-block;
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

/* 移动端卡片 */
.mobile-cards {
  padding: 1rem;
}

.mobile-card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  background: #fff;
  margin-bottom: 1rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
}

.mobile-card:last-child {
  margin-bottom: 0;
}

.mobile-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  border-radius: 0.5rem 0.5rem 0 0;
}

.mobile-card .card-header .bt-id {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #495057;
  font-size: 13px;
}

.mobile-card .card-body {
  padding: 1rem;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-row:last-child {
  margin-bottom: 0;
}

.card-row .label {
  font-weight: 500;
  color: #6c757d;
  font-size: 14px;
}

.card-row .value {
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.card-row .value.amount {
  color: #333;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bt-history-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem;
  }
  
  .page-title {
    text-align: center;
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .bt-history-container {
    padding: 0.5rem;
  }
  
  .page-header,
  .content-section {
    border-radius: 0.25rem;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
}
</style>
