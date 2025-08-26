<template>
  <div class="withdraw-funds">
    <div class="card">
      <div class="card-header">Withdraw Funds</div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <label class="form-label" for="method">Method</label>
            <select id="method" v-model="form.method" class="form-control" required>
              <option disabled value="">Please select</option>
              <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>

          <div class="form-row">
            <label class="form-label" for="amount">Amount</label>
            <input
              id="amount"
              v-model.number="form.amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              class="form-control"
              required
            />
            <small class="hint">Min 1.00</small>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">Withdraw Now</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'WithdrawFunds',
  emits: ['withdraw-submitted'],
  setup(_, { emit }) {
    const methods = ['J99', 'Bank Transfer', 'USDT', 'PayPal']

    const form = ref({
      method: '',
      amount: null
    })

    const submitting = ref(false)

    const validate = () => {
      if (!form.value.method) {
        ElMessage.warning('Please select a method')
        return false
      }
      if (!form.value.amount || form.value.amount < 1) {
        ElMessage.warning('Amount must be at least 1.00')
        return false
      }
      return true
    }

    const handleSubmit = async () => {
      if (!validate()) return
      try {
        submitting.value = true
        // 模拟提交
        await new Promise(r => setTimeout(r, 400))
        emit('withdraw-submitted', {
          method: form.value.method,
          amount: Number(form.value.amount)
        })
        ElMessage.success('Withdraw request submitted')
        form.value = { method: '', amount: null }
      } finally {
        submitting.value = false
      }
    }

    return { methods, form, submitting, handleSubmit }
  }
}
</script>

<style scoped>
.withdraw-funds {
  max-width: 560px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}

.form-control {
  height: 40px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
}

.form-control:focus {
  border-color: #2d5016;
  box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.1);
}

.hint {
  color: #9ca3af;
  font-size: 12px;
  margin-top: 6px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
}

.btn-primary {
  background-color: #2d5016;
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .withdraw-funds { padding: 0 4px; }
  .form-actions { justify-content: center; }
  .btn { width: 100%; min-height: 44px; }
}
</style>
