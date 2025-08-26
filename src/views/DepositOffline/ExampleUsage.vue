<template>
  <div class="deposit-page">
    <!-- 页面标题和切换按钮 -->
    <div class="page-header">
      <h1 class="page-title">{{ currentView === 'deposit' ? 'Deposit Funds' : 'Deposit History' }}</h1>
      <button 
        class="switch-view-btn" 
        @click="switchView"
      >
        {{ currentView === 'deposit' ? 'Deposit History' : 'Deposit Now' }}
      </button>
    </div>

    <!-- 存款表单视图 -->
    <div v-if="currentView === 'deposit'" class="view-container">
      <DepositNew 
        @deposit-submitted="handleDepositSubmitted"
      />
    </div>

    <!-- 存款历史视图 -->
    <div v-else class="view-container">
      <DepositHistore 
        :records="depositRecords"
        @deposit-cancelled="handleDepositCancelled"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DepositNew from './components/DepositNew.vue'
import DepositHistore from './components/DepositHistore.vue'

export default {
  name: 'DepositOfflineExample',
  components: {
    DepositNew,
    DepositHistore
  },
  setup() {
    const currentView = ref('deposit') // 'deposit' 或 'history'
    
    // 存款记录数据（可以从API获取）
    const depositRecords = ref([
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

    // 切换视图
    const switchView = () => {
      currentView.value = currentView.value === 'deposit' ? 'history' : 'deposit'
    }

    // 处理存款提交成功
    const handleDepositSubmitted = (depositData) => {
      console.log('Deposit submitted:', depositData)
      
      // 可以在这里调用API保存数据
      // await depositAPI.createDeposit(depositData)
      
      // 添加到本地记录中（实际项目中应该重新获取数据）
      const newRecord = {
        id: `30123456789${Date.now()}`,
        amount: parseFloat(depositData.amount),
        status: 'Pending',
        depositTime: new Date().toISOString(),
        approvedTime: null,
        approvedUser: null,
        screenshot: URL.createObjectURL(depositData.file)
      }
      
      depositRecords.value.unshift(newRecord)
      
      ElMessage.success('Your deposit request has been submitted successfully!')
      
      // 自动切换到历史记录视图
      setTimeout(() => {
        currentView.value = 'history'
      }, 1500)
    }

    // 处理存款取消
    const handleDepositCancelled = (depositId) => {
      console.log('Deposit cancelled:', depositId)
      
      // 可以在这里调用API取消存款
      // await depositAPI.cancelDeposit(depositId)
      
      // 更新本地状态（实际项目中应该重新获取数据）
      const record = depositRecords.value.find(r => r.id === depositId)
      if (record) {
        record.status = 'Cancelled'
      }
    }

    return {
      currentView,
      depositRecords,
      switchView,
      handleDepositSubmitted,
      handleDepositCancelled
    }
  }
}
</script>

<style scoped>
.deposit-page {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .deposit-page {
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
}
</style> 