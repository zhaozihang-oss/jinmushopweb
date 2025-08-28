<template>
  <div class="st-history-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">Support Ticket History</h2>
      <button class="btn btn-success" @click="goBack">
        ST Now
      </button>
    </div>

    <!-- 工单历史列表 -->
    <div class="history-section">
      <div 
        v-for="ticket in ticketHistory" 
        :key="ticket.id"
        class="ticket-item"
        :class="{ 'expanded': ticket.expanded }"
      >
        <!-- 工单头部信息 -->
        <div class="ticket-header" @click="toggleTicket(ticket.id)">
          <div class="ticket-info">
            <div class="ticket-status">
              <i 
                :class="getStatusIcon(ticket.status)"
                :style="{ color: getStatusColor(ticket.status) }"
              ></i>
            </div>
            <div class="ticket-details">
              <h4 class="ticket-title">{{ ticket.subject }}</h4>
              <p class="ticket-meta">{{ ticket.date }} {{ ticket.time }}</p>
            </div>
          </div>
          <div class="ticket-actions">
            <span 
              class="status-badge"
              :class="getStatusClass(ticket.status)"
            >
              {{ ticket.status }}
            </span>
            <i 
              class="fas fa-chevron-down expand-icon"
              :class="{ 'rotated': ticket.expanded }"
            ></i>
          </div>
        </div>

        <!-- 工单详细信息（可展开） -->
        <div class="ticket-content" v-show="ticket.expanded">
          <div class="content-section">
            <!-- 回复信息 -->
            <div v-if="ticket.repliedBy" class="reply-info">
              <div class="info-row">
                <span class="info-label">Replied by:</span>
                <span class="info-value">{{ ticket.repliedBy }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Reply time:</span>
                <span class="info-value">{{ ticket.replyTime }}</span>
              </div>
            </div>

            <!-- 回复内容 -->
            <div v-if="ticket.replyContent" class="reply-content">
              <div class="info-row">
                <span class="info-label">Reply content:</span>
              </div>
              <div class="content-text">
                {{ ticket.replyContent }}
              </div>
            </div>

            <!-- 无回复信息的占位 -->
            <div v-if="!ticket.repliedBy && !ticket.replyTime && !ticket.replyContent" class="no-reply">
              <div class="info-row">
                <span class="info-label">Replied by:</span>
                <span class="info-value">——</span>
              </div>
              <div class="info-row">
                <span class="info-label">Reply time:</span>
                <span class="info-value">——</span>
              </div>
              <div class="info-row">
                <span class="info-label">Reply content:</span>
                <span class="info-value">——</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'STHistory',
  emits: ['back'],
  setup(props, { emit }) {
    // 工单历史数据
    const ticketHistory = ref([
      {
        id: 1,
        subject: 'About the product module',
        date: 'Feb 05 2025',
        time: '@4:37 pm',
        status: 'Replied',
        repliedBy: 'Fatima Hamid',
        replyTime: 'Feb 04 2025 @12:00 am',
        replyContent: 'If you want to know how to make a deposit, it is under the "Deposit" navigation menu. You enter the deposit amount, input the remark information, upload the remittance receipt or proof, and click "Submit". You can check the deposit records at any time by clicking the "Deposit History" button.',
        expanded: false
      },
      {
        id: 2,
        subject: 'Deduction',
        date: 'Feb 04 2025',
        time: '@12:00 am',
        status: 'Pending',
        repliedBy: null,
        replyTime: null,
        replyContent: null,
        expanded: false
      },
      {
        id: 3,
        subject: 'No subject',
        date: 'Feb 04 2025',
        time: '@12:00 am',
        status: 'Pending',
        repliedBy: null,
        replyTime: null,
        replyContent: null,
        expanded: false
      },
      {
        id: 4,
        subject: 'No subject',
        date: 'Feb 04 2025',
        time: '@12:00 am',
        status: 'Pending',
        repliedBy: null,
        replyTime: null,
        replyContent: null,
        expanded: false
      }
    ])

    // 切换工单展开状态
    const toggleTicket = (ticketId) => {
      const ticket = ticketHistory.value.find(t => t.id === ticketId)
      if (ticket) {
        ticket.expanded = !ticket.expanded
      }
    }

    // 获取状态图标
    const getStatusIcon = (status) => {
      switch (status) {
        case 'Replied':
          return 'fas fa-check-circle'
        case 'Pending':
          return 'fas fa-clock'
        default:
          return 'fas fa-circle'
      }
    }

    // 获取状态颜色
    const getStatusColor = (status) => {
      switch (status) {
        case 'Replied':
          return '#28a745'
        case 'Pending':
          return '#ffc107'
        default:
          return '#6c757d'
      }
    }

    // 获取状态样式类
    const getStatusClass = (status) => {
      switch (status) {
        case 'Replied':
          return 'status-replied'
        case 'Pending':
          return 'status-pending'
        default:
          return 'status-default'
      }
    }

    // 返回主页面
    const goBack = () => {
      emit('back')
    }

    return {
      ticketHistory,
      toggleTicket,
      getStatusIcon,
      getStatusColor,
      getStatusClass,
      goBack
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.st-history-container {
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

/* 历史记录区域 */
.history-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
  overflow: hidden;
}

/* 工单项 */
.ticket-item {
  border-bottom: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.ticket-item:last-child {
  border-bottom: none;
}

.ticket-item:hover {
  background-color: #f8f9fa;
}

/* 工单头部 */
.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticket-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ticket-status {
  font-size: 1.2rem;
}

.ticket-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ticket-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.ticket-meta {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.ticket-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 状态徽章 */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-replied {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-default {
  background-color: #e2e3e5;
  color: #383d41;
}

/* 展开图标 */
.expand-icon {
  font-size: 0.875rem;
  color: #6c757d;
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* 工单内容 */
.ticket-content {
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.content-section {
  padding: 1.5rem 2rem;
}

.reply-info,
.no-reply {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.75rem;
  align-items: flex-start;
}

.info-label {
  font-weight: 500;
  color: #495057;
  min-width: 120px;
  margin-right: 1rem;
}

.info-value {
  color: #333;
  flex: 1;
}

.reply-content {
  margin-top: 1rem;
}

.content-text {
  background: white;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
  margin-top: 0.5rem;
  line-height: 1.6;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .st-history-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    text-align: center;
  }
  
  .ticket-header {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .ticket-info {
    width: 100%;
  }
  
  .ticket-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .info-row {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .info-label {
    min-width: auto;
    margin-right: 0;
    font-size: 0.875rem;
  }
}

@media (max-width: 576px) {
  .st-history-container {
    padding: 0.5rem;
  }
  
  .page-header,
  .history-section {
    border-radius: 0.25rem;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .ticket-header {
    padding: 1rem 0.75rem;
  }
  
  .content-section {
    padding: 1rem 0.75rem;
  }
  
  .ticket-title {
    font-size: 1rem;
  }
  
  .ticket-meta {
    font-size: 0.8rem;
  }
}

/* 动画效果 */
.ticket-content {
  overflow: hidden;
  transition: all 0.3s ease;
}

.ticket-item.expanded .ticket-header {
  background-color: #f8f9fa;
}
</style>
