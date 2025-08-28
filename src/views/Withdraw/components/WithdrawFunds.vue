<template>
  <div>
    <!-- 提现弹出框 -->
    <div 
      class="modal fade show" 
      v-if="showModal"
      style="display: block; z-index: 1050;"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered withdraw-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Withdraw Funds</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <!-- 选择网关 -->
              <div class="mb-3">
                <label class="form-label required">Method <span class="text-danger">*</span></label>
                <div class="select-wrapper">
                  <select 
                    class="form-select" 
                    v-model="withdrawForm.gateway"
                    required
                  >
                    <option value="">Select Gateway</option>
                    <option v-for="gateway in gateways" :key="gateway.id" :value="gateway.id">
                      {{ gateway.name }}
                    </option>
                  </select>
                  <i class="fas fa-chevron-down select-arrow"></i>
                </div>
              </div>
              
              <!-- 金额输入 -->
              <div class="mb-4">
                <label class="form-label required">Amount <span class="text-danger">*</span></label>
                <div class="amount-input-wrapper">
                  <input 
                    type="number" 
                    class="form-control amount-input" 
                    v-model="withdrawForm.amount"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  >
                  <span class="currency-label">USD</span>
                </div>
              </div>
              
              <!-- 提交按钮 -->
              <div class="submit-section">
                <button 
                  type="submit" 
                  class="btn btn-success btn-submit"
                  :disabled="isSubmitting"
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
    </div>
    
    <!-- 模态框背景遮罩 -->
    <div 
      class="modal-backdrop fade show" 
      v-if="showModal"
      style="z-index: 1045;"
      @click="closeModal"
    ></div>

    <!-- 提现历史按钮 (移动端显示) -->
    <div v-if="isMobile && showHistoryButton" class="withdraw-history-btn-container">
      <button class="btn btn-outline-secondary withdraw-history-btn" @click="showWithdrawHistory">
        Withdraw History
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'

export default {
  name: 'WithdrawFunds',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    showHistoryButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'submit', 'show-history'],
  setup(props, { emit }) {
    const { showMessage } = useMessage()
    
    // 响应式数据
    const showModal = computed(() => props.visible)
    const isSubmitting = ref(false)
    
    // 表单数据
    const withdrawForm = reactive({
      gateway: '',
      amount: ''
    })
    
    // 模拟网关数据
    const gateways = ref([
      { id: 'paypal', name: 'PayPal' },
      { id: 'bank_transfer', name: 'Bank Transfer' },
      { id: 'crypto', name: 'Cryptocurrency' },
      { id: 'wise', name: 'Wise (formerly TransferWise)' },
      { id: 'skrill', name: 'Skrill' }
    ])
    
    // 关闭模态框
    const closeModal = () => {
      emit('close')
      resetForm()
    }
    
    // 重置表单
    const resetForm = () => {
      withdrawForm.gateway = ''
      withdrawForm.amount = ''
      isSubmitting.value = false
    }
    
    // 显示提现历史
    const showWithdrawHistory = () => {
      emit('show-history')
    }
    
    // 表单验证
    const validateForm = () => {
      if (!withdrawForm.gateway) {
        showMessage('Please select a withdrawal method', 'error')
        return false
      }
      
      if (!withdrawForm.amount || parseFloat(withdrawForm.amount) <= 0) {
        showMessage('Please enter a valid amount', 'error')
        return false
      }
      
      if (parseFloat(withdrawForm.amount) < 10) {
        showMessage('Minimum withdrawal amount is $10', 'error')
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
        
        const withdrawalData = {
          gateway: withdrawForm.gateway,
          amount: parseFloat(withdrawForm.amount),
          timestamp: new Date().toISOString()
        }
        
        emit('submit', withdrawalData)
        showMessage('Withdrawal request submitted successfully!', 'success')
        closeModal()
      } catch (error) {
        showMessage('Failed to submit withdrawal request. Please try again.', 'error')
        console.error('Withdrawal submission error:', error)
      } finally {
        isSubmitting.value = false
      }
    }
    
    return {
      showModal,
      isSubmitting,
      withdrawForm,
      gateways,
      closeModal,
      handleSubmit,
      showWithdrawHistory
    }
  }
}
</script>

<style scoped>
/* 模态框基本样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem;
  pointer-events: none;
}

.withdraw-modal {
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0,0,0,.2);
  border-radius: 12px;
  outline: 0;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-close:hover {
  background-color: #f8f9fa;
  color: #333;
}

.btn-close::before {
  content: "×";
  font-size: 24px;
  line-height: 1;
}

.modal-body {
  padding: 1rem 1.5rem 1.5rem;
}

/* 表单样式 */
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

.mb-3 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 2rem;
}

/* 选择框样式 */
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background-color: #fff;
  color: #495057;
  appearance: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.form-select:focus {
  border-color: #28a745;
  outline: none;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
  font-size: 12px;
}

/* 金额输入框样式 */
.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input {
  width: 100%;
  padding: 12px 60px 12px 16px;
  font-size: 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background-color: #fff;
  color: #495057;
  transition: all 0.3s ease;
}

.amount-input:focus {
  border-color: #28a745;
  outline: none;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.amount-input::placeholder {
  color: #adb5bd;
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

/* 提交按钮样式 */
.submit-section {
  margin-top: 1rem;
}

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
}

.btn-submit {
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
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

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 提现历史按钮样式 */
.withdraw-history-btn-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.withdraw-history-btn {
  padding: 12px 20px;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid #6c757d;
  background-color: #fff;
  color: #6c757d;
  font-weight: 500;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.me-2 {
  margin-right: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .withdraw-modal {
    width: 95%;
    margin: 1rem auto;
  }
  
  .modal-header {
    padding: 1rem 1rem 0.5rem;
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .amount-input {
    font-size: 16px; /* 防止iOS缩放 */
  }
  
  .withdraw-history-btn-container {
    bottom: 15px;
    right: 15px;
  }
  
  .withdraw-history-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .withdraw-modal {
    width: 100%;
    margin: 0.5rem;
    border-radius: 8px;
  }
  
  .modal-content {
    border-radius: 8px;
  }
  
  .modal-header {
    padding: 0.75rem 1rem 0.5rem;
  }
  
  .modal-title {
    font-size: 16px;
  }
  
  .modal-body {
    padding: 0.75rem 1rem 1rem;
  }
  
  .form-select,
  .amount-input {
    padding: 10px 40px 10px 12px;
    font-size: 14px;
  }
  
  .amount-input {
    padding-right: 50px;
  }
  
  .btn-submit {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
