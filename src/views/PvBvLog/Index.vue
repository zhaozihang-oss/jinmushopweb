<template>
  <div class="pv-bv-log-container">
    <!-- Web版本 -->
    <div v-if="!isMobile" class="web-pv-bv-log">
      <!-- <div class="log-header">
        <div class="header-left">
          <h2 class="log-title">PV & BV Log</h2>
        </div>
        <div class="header-right">
          <button class="btn btn-sm btn-success" @click="refreshLogs">
            <i class="fas fa-refresh"></i>
            Refresh
          </button>
        </div>
      </div> -->

      <div class="log-content">
        <div class="table-container">
          <table class="log-table">
            <thead>
              <tr>
                <th class="bv-header">BV</th>
                <th class="pv-header">PV</th>
                <th>L/R</th>
                <th>Details</th>
                <th>Datetime</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id" class="log-row">
                <td class="bv-cell">
                  <span class="bv-value">+{{ log.bv }}</span>
                </td>
                <td class="pv-cell">
                  <span class="pv-value">+{{ log.pv }}</span>
                </td>
                <td class="lr-cell">
                  <span class="lr-badge" :class="log.side.toLowerCase()">
                    {{ log.side }}
                  </span>
                </td>
                <td class="details-cell">
                  <span class="details-text">{{ log.details }}</span>
                </td>
                <td class="datetime-cell">
                  <span class="datetime-text">{{ formatDateTime(log.datetime) }}</span>
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
    <div v-else class="mobile-pv-bv-log">
      <div class="mobile-header">
        <div class="mobile-header-left">
          <h3 class="mobile-title">PV & BV Log</h3>
        </div>
        <button class="btn btn-sm btn-success" @click="refreshLogs">
          <i class="fas fa-refresh"></i>
        </button>
      </div>

      <div class="mobile-logs">
        <div 
          v-for="log in logs" 
          :key="log.id" 
          class="mobile-log-card"
        >
          <div class="log-card-header">
            <div class="bv-pv-section">
              <div class="value-item">
                <span class="value-label">BV</span>
                <span class="bv-value">+{{ log.bv }}</span>
              </div>
              <div class="value-item">
                <span class="value-label">PV</span>
                <span class="pv-value">+{{ log.pv }}</span>
              </div>
            </div>
            <span class="lr-badge" :class="log.side.toLowerCase()">
              {{ log.side }}
            </span>
          </div>
          
          <div class="log-card-body">
            <div class="info-row">
              <span class="info-label">Details</span>
              <span class="info-value">{{ log.details }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Datetime</span>
              <span class="info-value">{{ formatDateTime(log.datetime) }}</span>
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'PvBvLog',
  components: {
    Pagination
  },
  setup() {
    const isMobile = ref(window.innerWidth <= 768)
    const currentPage = ref(1)
    const pageSize = ref(12)
    
    // 模拟PV BV日志数据
    const allLogs = ref([
      {
        id: 1,
        bv: 15,
        pv: 15,
        side: 'Right',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 2,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 3,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 4,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 5,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 6,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 7,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 8,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 9,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 10,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 11,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      {
        id: 12,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-05 16:37:00'
      },
      // 添加更多数据用于测试分页
      {
        id: 13,
        bv: 25,
        pv: 25,
        side: 'Right',
        details: 'Purchase bonus from user123',
        datetime: '2025-02-04 14:22:00'
      },
      {
        id: 14,
        bv: 30,
        pv: 30,
        side: 'Left',
        details: 'Referral bonus from newuser456',
        datetime: '2025-02-04 12:15:00'
      },
      {
        id: 15,
        bv: 20,
        pv: 20,
        side: 'Right',
        details: 'Monthly bonus distribution',
        datetime: '2025-02-04 10:30:00'
      },
      {
        id: 16,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Team performance bonus',
        datetime: '2025-02-03 16:45:00'
      },
      {
        id: 17,
        bv: 35,
        pv: 35,
        side: 'Right',
        details: 'Special promotion bonus',
        datetime: '2025-02-03 14:20:00'
      },
      {
        id: 18,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Weekly achievement bonus',
        datetime: '2025-02-03 11:30:00'
      },
      {
        id: 19,
        bv: 40,
        pv: 40,
        side: 'Right',
        details: 'Leadership bonus payout',
        datetime: '2025-02-02 15:15:00'
      },
      {
        id: 20,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Direct referral commission',
        datetime: '2025-02-02 13:40:00'
      },
      {
        id: 21,
        bv: 28,
        pv: 28,
        side: 'Right',
        details: 'Binary matching bonus',
        datetime: '2025-02-01 17:25:00'
      },
      {
        id: 22,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Infinite pv from zazng92',
        datetime: '2025-02-01 16:10:00'
      },
      {
        id: 23,
        bv: 32,
        pv: 32,
        side: 'Right',
        details: 'Volume bonus calculation',
        datetime: '2025-01-31 14:55:00'
      },
      {
        id: 24,
        bv: 15,
        pv: 15,
        side: 'Left',
        details: 'Network growth bonus',
        datetime: '2025-01-31 12:30:00'
      }
    ])

    // 计算分页数据
    const logs = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return allLogs.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(allLogs.value.length / pageSize.value)
    })

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

    // 刷新日志
    const refreshLogs = () => {
      console.log('Refresh PV BV logs')
      // 这里可以重新获取日志数据
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
      logs,
      currentPage,
      totalPages,
      formatDateTime,
      handlePageChange,
      refreshLogs
    }
  }
}
</script>

<style scoped>
/* 容器样式 */
.pv-bv-log-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

/* Web版本样式 */
.web-pv-bv-log {
  max-width: 1200px;
  margin: 0 auto;
}

.log-header {
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

.log-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 10px;
}

.log-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.log-table thead {
  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;
}

.log-table th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 500;
  color: #6c757d;
  white-space: nowrap;
  font-size: 14px;
}

.bv-header,
.pv-header {
  /* width: 120px; */
  min-width: 200px;
}

.log-table tbody tr {
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;
}

.log-table tbody tr:hover {
  background-color: #f8f9fa;
}

.log-table td {
  padding: 16px 12px;
  vertical-align: middle;
}

.bv-cell,
.pv-cell {
  width: 120px;
  min-width: 120px;
}

.bv-value,
.pv-value {
  font-weight: 600;
  color: #28a745;
  font-size: 15px;
}

.lr-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
  background-color: transparent;
}

.lr-badge.right {
  border-color: #74c0fc;
  color: white;
  background-color: #74c0fc;
}

.lr-badge.left {
  border-color: #a78bfa;
  color: white;
  background-color: #a78bfa;
}

.details-text {
  color: #6c757d;
}

.datetime-text {
  color: #495057;
  font-size: 13px;
}

/* 移动版本样式 */
.mobile-pv-bv-log {
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

.mobile-logs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-log-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #28a745;
}

.log-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bv-pv-section {
  display: flex;
  gap: 20px;
}

.value-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.value-label {
  font-size: 11px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
}

.bv-value,
.pv-value {
  font-size: 16px;
  font-weight: 600;
  color: #28a745;
}

.log-card-body {
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
  min-width: 60px;
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

/* 响应式调整 */
@media (max-width: 768px) {
  .pv-bv-log-container {
    padding: 15px;
  }
  
  .mobile-header {
    margin-bottom: 15px;
  }
  
  .mobile-logs {
    gap: 10px;
  }
  
  .mobile-log-card {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .pv-bv-log-container {
    padding: 10px;
  }
  
  .mobile-title {
    font-size: 16px;
  }
  
  .bv-pv-section {
    gap: 15px;
  }
  
  .value-item {
    gap: 2px;
  }
  
  .bv-value,
  .pv-value {
    font-size: 14px;
  }
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

.fas {
  font-size: 12px;
}
</style> 