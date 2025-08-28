<template>
  <div class="balance-transfer-container">
    <!-- Web版本 -->
    <div v-if="!isMobile && !showBTHistory" class="web-balance-transfer">
      <div class="transfer-header">
        <div class="header-left">
          <h2 class="transfer-title">Balance Transfer</h2>
        </div>
        <div class="header-right">
          <button class="btn btn-success" @click="viewHistory">
            <i class="fas fa-history me-1"></i>BT History
          </button>
        </div>
      </div>

      <div class="transfer-content">
        <div class="transfer-form-container">
          <form @submit.prevent="handleSubmit" class="transfer-form">
            <!-- Member ID -->
            <div class="form-group">
              <label class="form-label required">Member ID <span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control member-input" 
                v-model="transferForm.memberId"
                placeholder="ABC123"
                @blur="handleMemberIdBlur"
                @input="handleMemberIdInput"
                required
              >
              <div v-if="memberName" class="member-info">
                <span class="member-label">MemberName:</span>
                <span class="member-name">{{ memberName }}</span>
              </div>
            </div>

            <!-- Amount -->
            <div class="form-group">
              <label class="form-label required">Amount <span class="text-danger">*</span></label>
              <div class="amount-input-wrapper">
                <input 
                  type="number" 
                  class="form-control amount-input" 
                  v-model="transferForm.amount"
                  placeholder="1"
                  step="0.01"
                  min="0.01"
                  @input="handleAmountChange"
                  required
                >
                <span class="currency-label">USD</span>
              </div>
              <div class="pkr-conversion">
                PKR {{ formatAmount(pkrAmount) }}
              </div>
            </div>

            <!-- Balance Display -->
            <div class="balance-section">
              <div class="balance-row">
                <div class="balance-item">
                  <label class="balance-label">Current balance</label>
                  <div class="balance-value current-balance">${{ formatAmount(currentBalance) }}</div>
                </div>
                <div class="balance-item">
                  <label class="balance-label">Balance after transfer</label>
                  <div class="balance-value after-balance">${{ formatAmount(balanceAfterTransfer) }}</div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="submit-section">
              <button 
                type="submit" 
                class="btn btn-success btn-submit"
                :disabled="isSubmitting || !canSubmit"
              >
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin me-2"></i>Processing...
                </span>
                <span v-else>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 移动版本 -->
    <div v-else-if="isMobile && !showBTHistory" class="mobile-balance-transfer">
      <div class="mobile-header">
        <div class="mobile-header-left">
          <h3 class="mobile-title">Balance Transfer</h3>
        </div>
        <button class="btn btn-success btn-sm" @click="viewHistory">
          <i class="fas fa-history"></i>
        </button>
      </div>

      <div class="mobile-transfer-content">
        <form @submit.prevent="handleSubmit" class="mobile-transfer-form">
          <!-- Member ID -->
          <div class="mobile-form-group">
            <label class="mobile-form-label required">Member ID <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="mobile-form-control" 
              v-model="transferForm.memberId"
              placeholder="ABC123"
              @blur="handleMemberIdBlur"
              @input="handleMemberIdInput"
              required
            >
            <div v-if="memberName" class="mobile-member-info">
              <span class="mobile-member-label">MemberName:</span>
              <span class="mobile-member-name">{{ memberName }}</span>
            </div>
          </div>

          <!-- Amount -->
          <div class="mobile-form-group">
            <label class="mobile-form-label required">Amount <span class="text-danger">*</span></label>
            <div class="mobile-amount-wrapper">
              <input 
                type="number" 
                class="mobile-form-control mobile-amount-input" 
                v-model="transferForm.amount"
                placeholder="1"
                step="0.01"
                min="0.01"
                @input="handleAmountChange"
                required
              >
              <span class="mobile-currency-label">USD</span>
            </div>
            <div class="mobile-pkr-conversion">
              PKR {{ formatAmount(pkrAmount) }}
            </div>
          </div>

          <!-- Balance Cards -->
          <div class="mobile-balance-section">
            <div class="mobile-balance-card">
              <div class="mobile-balance-label">Current balance</div>
              <div class="mobile-balance-value">${{ formatAmount(currentBalance) }}</div>
            </div>
            <div class="mobile-balance-card">
              <div class="mobile-balance-label">Balance after transfer</div>
              <div class="mobile-balance-value">${{ formatAmount(balanceAfterTransfer) }}</div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mobile-submit-section">
            <button 
              type="submit" 
              class="btn btn-success mobile-btn-submit"
              :disabled="isSubmitting || !canSubmit"
            >
              <span v-if="isSubmitting">
                <i class="fas fa-spinner fa-spin me-2"></i>Processing...
              </span>
              <span v-else>Submit</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- BT History Page -->
    <BTHistory 
      v-if="showBTHistory"
      @back="closeBTHistory"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'
import BTHistory from './components/BTHistory.vue'

export default {
  name: 'BalanceTransfer',
  components: {
    BTHistory
  },
  setup() {
    const { showMessage } = useMessage()
    
    // 响应式数据
    const isMobile = ref(window.innerWidth <= 768)
    const isSubmitting = ref(false)
    const memberName = ref('')
    const currentBalance = ref(100.00) // 模拟当前余额
    const exchangeRate = ref(849.30) // PKR汇率
    const showBTHistory = ref(false)
    
    // 表单数据
    const transferForm = reactive({
      memberId: '',
      amount: ''
    })
    
    // 计算属性
    const pkrAmount = computed(() => {
      const amount = parseFloat(transferForm.amount) || 0
      return amount * exchangeRate.value
    })
    
    const balanceAfterTransfer = computed(() => {
      const amount = parseFloat(transferForm.amount) || 0
      return Math.max(0, currentBalance.value - amount)
    })
    
    const canSubmit = computed(() => {
      return transferForm.memberId && 
             transferForm.amount && 
             parseFloat(transferForm.amount) > 0 &&
             parseFloat(transferForm.amount) <= currentBalance.value &&
             memberName.value
    })
    
    // 格式化金额
    const formatAmount = (amount) => {
      return parseFloat(amount || 0).toFixed(2)
    }
    
    // 处理会员ID输入
    const handleMemberIdInput = () => {
      // 清除之前的会员信息
      if (!transferForm.memberId) {
        memberName.value = ''
      }
    }
    
    // 处理会员ID失去焦点
    const handleMemberIdBlur = async () => {
      if (transferForm.memberId) {
        await fetchMemberInfo(transferForm.memberId)
      }
    }
    
    // 模拟获取会员信息
    const fetchMemberInfo = async (memberId) => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟会员数据
        const mockMembers = {
          'ABC123': 'Samira Khan',
          'DEF456': 'John Smith',
          'GHI789': 'Maria Garcia',
          'JKL012': 'Ahmed Hassan'
        }
        
        if (mockMembers[memberId.toUpperCase()]) {
          memberName.value = mockMembers[memberId.toUpperCase()]
        } else {
          memberName.value = ''
          showMessage('Member not found', 'error')
        }
      } catch (error) {
        console.error('Error fetching member info:', error)
        showMessage('Error fetching member information', 'error')
      }
    }
    
    // 处理金额变化
    const handleAmountChange = () => {
      const amount = parseFloat(transferForm.amount)
      if (amount > currentBalance.value) {
        showMessage('Amount exceeds current balance', 'warning')
      }
    }
    
    // 表单验证
    const validateForm = () => {
      if (!transferForm.memberId) {
        showMessage('Please enter Member ID', 'error')
        return false
      }
      
      if (!memberName.value) {
        showMessage('Please enter a valid Member ID', 'error')
        return false
      }
      
      if (!transferForm.amount || parseFloat(transferForm.amount) <= 0) {
        showMessage('Please enter a valid amount', 'error')
        return false
      }
      
      if (parseFloat(transferForm.amount) > currentBalance.value) {
        showMessage('Amount exceeds current balance', 'error')
        return false
      }
      
      if (parseFloat(transferForm.amount) < 0.01) {
        showMessage('Minimum transfer amount is $0.01', 'error')
        return false
      }
      
      return true
    }
    
    // 处理表单提交
    const handleSubmit = async () => {
      if (!validateForm()) return
      
      isSubmitting.value = true
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const transferData = {
          memberId: transferForm.memberId,
          memberName: memberName.value,
          amount: parseFloat(transferForm.amount),
          pkrAmount: pkrAmount.value,
          timestamp: new Date().toISOString()
        }
        
        console.log('Transfer submitted:', transferData)
        
        // 更新余额
        currentBalance.value = balanceAfterTransfer.value
        
        showMessage('Balance transfer completed successfully!', 'success')
        
        // 重置表单
        resetForm()
        
      } catch (error) {
        showMessage('Failed to complete balance transfer. Please try again.', 'error')
        console.error('Transfer submission error:', error)
      } finally {
        isSubmitting.value = false
      }
    }
    
    // 重置表单
    const resetForm = () => {
      transferForm.memberId = ''
      transferForm.amount = ''
      memberName.value = ''
    }
    
    // 查看历史记录
    const viewHistory = () => {
      showBTHistory.value = true
    }

    // 关闭BT历史页面
    const closeBTHistory = () => {
      showBTHistory.value = false
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
      isSubmitting,
      memberName,
      currentBalance,
      exchangeRate,
      transferForm,
      pkrAmount,
      balanceAfterTransfer,
      canSubmit,
      showBTHistory,
      formatAmount,
      handleMemberIdInput,
      handleMemberIdBlur,
      handleAmountChange,
      handleSubmit,
      viewHistory,
      closeBTHistory
    }
  }
}
</script>

<style scoped>
/* 容器样式 */
.balance-transfer-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

/* Web版本样式 */
.web-balance-transfer {
  max-width: 800px;
  margin: 0 auto;
}

.transfer-header {
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

.transfer-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 10px;
}

.transfer-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.transfer-form-container {
  padding: 2rem;
}

.transfer-form {
  max-width: 600px;
  margin: 0 auto;
}

/* 表单样式 */
.form-group {
  margin-bottom: 2rem;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-label.required .text-danger {
  margin-left: 2px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background-color: #fff;
  color: #495057;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #28a745;
  outline: none;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.member-input {
  text-transform: uppercase;
}

.member-info {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 13px;
}

.member-label {
  color: #6c757d;
  margin-right: 8px;
}

.member-name {
  color: #495057;
  font-weight: 500;
}

/* 金额输入样式 */
.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input {
  padding-right: 60px;
  font-size: 16px;
}

.currency-label {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-weight: 500;
  font-size: 14px;
  pointer-events: none;
}

.pkr-conversion {
  margin-top: 6px;
  font-size: 12px;
  color: #6c757d;
}

/* 余额显示样式 */
.balance-section {
  margin-bottom: 2rem;
}

.balance-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.balance-item {
  text-align: center;
}

.balance-label {
  display: block;
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 8px;
  font-weight: 500;
}

.balance-value {
  padding: 16px 20px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #495057;
}

.current-balance {
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
}

.after-balance {
  background-color: #f3e5f5;
  border: 1px solid #ce93d8;
}

/* 按钮样式 */
.btn {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
  font-size: 14px;
  padding: 10px 20px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.submit-section {
  text-align: center;
}

.btn-submit {
  width: 100%;
  max-width: 300px;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
}

.me-1 {
  margin-right: 4px;
}

.me-2 {
  margin-right: 8px;
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 移动版本样式 */
.mobile-balance-transfer {
  padding: 0;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.mobile-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.mobile-transfer-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
  padding: 1.5rem;
}

.mobile-transfer-form {
  width: 100%;
}

.mobile-form-group {
  margin-bottom: 1.5rem;
}

.mobile-form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 13px;
}

.mobile-form-label.required .text-danger {
  margin-left: 2px;
}

.mobile-form-control {
  width: 100%;
  padding: 10px 12px;
  font-size: 16px; /* 防止iOS缩放 */
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background-color: #fff;
  color: #495057;
  transition: all 0.3s ease;
}

.mobile-form-control:focus {
  border-color: #28a745;
  outline: none;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.mobile-member-info {
  margin-top: 6px;
  padding: 6px 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
}

.mobile-member-label {
  color: #6c757d;
  margin-right: 6px;
}

.mobile-member-name {
  color: #495057;
  font-weight: 500;
}

.mobile-amount-wrapper {
  position: relative;
}

.mobile-amount-input {
  padding-right: 50px;
}

.mobile-currency-label {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-weight: 500;
  font-size: 13px;
  pointer-events: none;
}

.mobile-pkr-conversion {
  margin-top: 4px;
  font-size: 11px;
  color: #6c757d;
}

.mobile-balance-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 1.5rem;
}

.mobile-balance-card {
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.mobile-balance-card:first-child {
  background-color: #e3f2fd;
  border-color: #bbdefb;
}

.mobile-balance-card:last-child {
  background-color: #f3e5f5;
  border-color: #ce93d8;
}

.mobile-balance-label {
  font-size: 11px;
  color: #6c757d;
  margin-bottom: 4px;
  font-weight: 500;
}

.mobile-balance-value {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
}

.mobile-submit-section {
  text-align: center;
}

.mobile-btn-submit {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .balance-transfer-container {
    padding: 15px;
  }
  
  .mobile-transfer-content {
    margin: 0;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .balance-transfer-container {
    padding: 10px;
  }
  
  .mobile-header {
    padding: 0 10px;
  }
  
  .mobile-title {
    font-size: 18px;
  }
  
  .mobile-transfer-content {
    padding: 1rem;
  }
  
  .mobile-balance-section {
    gap: 10px;
  }
  
  .mobile-balance-card {
    padding: 10px;
  }
  
  .mobile-balance-value {
    font-size: 14px;
  }
}
</style> 