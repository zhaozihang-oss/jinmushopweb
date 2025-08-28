<template>
  <div class="transactions-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">E-wallet Transactions</h2>
    </div>

    <!-- 筛选区域 -->
    <div class="filters-section">
      <div class="row g-3">
        <!-- Remark -->
        <div class="col-md-3">
          <label class="form-label">
            Remark <span class="text-danger">*</span>
          </label>
          <select class="form-select" v-model="filters.remark">
            <option value="">Any</option>
            <option value="Recharge">Recharge</option>
            <option value="Deduction">Deduction</option>
            <option value="Transfer">Transfer</option>
            <option value="Order">Order</option>
          </select>
        </div>

        <!-- Transaction Amount -->
        <div class="col-md-4">
          <label class="form-label">
            Transaction amount <span class="text-danger">*</span>
          </label>
          <div class="amount-inputs">
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input 
                type="number" 
                class="form-control" 
                placeholder="Min.amount"
                v-model="filters.minAmount"
                step="0.01"
              >
            </div>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input 
                type="number" 
                class="form-control" 
                placeholder="Max.amount"
                v-model="filters.maxAmount"
                step="0.01"
              >
            </div>
          </div>
        </div>

        <!-- Date Range -->
        <div class="col-md-3">
          <label class="form-label">
            Start and end time <span class="text-danger">*</span>
          </label>
          <div class="date-inputs">
            <input 
              type="date" 
              class="form-control" 
              placeholder="Start date"
              v-model="filters.startDate"
            >
            <input 
              type="date" 
              class="form-control" 
              placeholder="End date"
              v-model="filters.endDate"
            >
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="col-md-2">
          <label class="form-label">&nbsp;</label>
          <div class="action-buttons">
            <button class="btn btn-success" @click="applyFilters">
              Filter
            </button>
            <button class="btn btn-outline-secondary" @click="resetFilters">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易记录列表 -->
    <div class="transactions-section">
      <!-- Desktop View -->
      <div v-if="!isMobile" class="desktop-transactions">
        <div 
          v-for="transaction in paginatedTransactions" 
          :key="transaction.id"
          class="transaction-item"
          :class="getTransactionClass(transaction.type)"
        >
          <div class="transaction-icon">
            <i :class="getTransactionIcon(transaction.type)"></i>
          </div>
          <div class="transaction-content">
            <div class="transaction-header">
              <h4 class="transaction-title">{{ transaction.remark }}</h4>
              <div class="transaction-amount" :class="getAmountClass(transaction.type)">
                {{ formatAmount(transaction.amount, transaction.type) }}
              </div>
            </div>
            <div class="transaction-details">
              <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
              <span class="transaction-balance">Balance: {{ formatBalance(transaction.balance) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile View -->
      <div v-else class="mobile-transactions">
        <div 
          v-for="transaction in paginatedTransactions" 
          :key="transaction.id"
          class="mobile-transaction-item"
          :class="getTransactionClass(transaction.type)"
        >
          <div class="mobile-transaction-header">
            <div class="mobile-transaction-left">
              <div class="transaction-icon">
                <i :class="getTransactionIcon(transaction.type)"></i>
              </div>
              <div class="transaction-info">
                <h5 class="transaction-title">{{ transaction.remark }}</h5>
                <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
              </div>
            </div>
            <div class="mobile-transaction-right">
              <div class="transaction-amount" :class="getAmountClass(transaction.type)">
                {{ formatAmount(transaction.amount, transaction.type) }}
              </div>
              <span class="transaction-balance">Balance: {{ formatBalance(transaction.balance) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTransactions.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-receipt"></i>
        </div>
        <h4>No Transactions Found</h4>
        <p class="text-muted">No transactions match your current filters.</p>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="filteredTransactions.length > 0" class="pagination-section">
      <nav aria-label="Transactions pagination">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
              <i class="fas fa-chevron-left"></i>
            </a>
          </li>
          <li 
            v-for="page in visiblePages" 
            :key="page"
            class="page-item" 
            :class="{ active: page === currentPage }"
          >
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
              <i class="fas fa-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'

export default {
  name: 'Transactions',
  setup() {
    // 响应式数据
    const isMobile = ref(window.innerWidth <= 768)
    const currentPage = ref(1)
    const pageSize = 6

    // 筛选条件
    const filters = reactive({
      remark: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: ''
    })

    // 模拟交易数据 - 基于图片中的数据
    const transactions = ref([
      {
        id: 1,
        remark: 'Recharge',
        type: 'credit',
        amount: 5.00,
        date: '2025-02-05T16:37:00',
        balance: 80.00
      },
      {
        id: 2,
        remark: 'Deduction',
        type: 'debit',
        amount: 5.00,
        date: '2025-02-04T12:00:00',
        balance: 75.00
      },
      {
        id: 3,
        remark: 'Transfer',
        type: 'debit',
        amount: 5.00,
        date: '2025-02-04T11:30:00',
        balance: 80.00
      },
      {
        id: 4,
        remark: 'Order',
        type: 'debit',
        amount: 5.00,
        date: '2025-02-04T10:23:00',
        balance: 85.00
      },
      {
        id: 5,
        remark: 'Order',
        type: 'debit',
        amount: 10.00,
        date: '2025-02-03T09:07:00',
        balance: 90.00
      },
      {
        id: 6,
        remark: 'Order',
        type: 'debit',
        amount: 5.00,
        date: '2025-02-03T08:00:00',
        balance: 100.00
      },
      // 添加更多测试数据
      {
        id: 7,
        remark: 'Recharge',
        type: 'credit',
        amount: 50.00,
        date: '2025-02-02T15:30:00',
        balance: 105.00
      },
      {
        id: 8,
        remark: 'Transfer',
        type: 'debit',
        amount: 15.00,
        date: '2025-02-02T14:20:00',
        balance: 55.00
      }
    ])

    // 计算属性
    const filteredTransactions = computed(() => {
      let filtered = transactions.value

      // 按备注筛选
      if (filters.remark) {
        filtered = filtered.filter(t => t.remark === filters.remark)
      }

      // 按金额范围筛选
      if (filters.minAmount) {
        filtered = filtered.filter(t => t.amount >= parseFloat(filters.minAmount))
      }
      if (filters.maxAmount) {
        filtered = filtered.filter(t => t.amount <= parseFloat(filters.maxAmount))
      }

      // 按日期范围筛选
      if (filters.startDate) {
        filtered = filtered.filter(t => {
          const transactionDate = new Date(t.date).toISOString().split('T')[0]
          return transactionDate >= filters.startDate
        })
      }
      if (filters.endDate) {
        filtered = filtered.filter(t => {
          const transactionDate = new Date(t.date).toISOString().split('T')[0]
          return transactionDate <= filters.endDate
        })
      }

      return filtered
    })

    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return filteredTransactions.value.slice(start, end)
    })

    const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / pageSize))

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, start + 4)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    // 方法
    const formatAmount = (amount, type) => {
      const sign = type === 'credit' ? '+' : '-'
      return `${sign}${parseFloat(amount).toFixed(2)}`
    }

    const formatBalance = (balance) => {
      return `${parseFloat(balance).toFixed(2)} USD`
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
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

    const getTransactionClass = (type) => {
      return type === 'credit' ? 'transaction-credit' : 'transaction-debit'
    }

    const getAmountClass = (type) => {
      return type === 'credit' ? 'amount-credit' : 'amount-debit'
    }

    const getTransactionIcon = (type) => {
      return type === 'credit' ? 'fas fa-plus' : 'fas fa-minus'
    }

    const applyFilters = () => {
      currentPage.value = 1
      // 筛选逻辑已在计算属性中处理
    }

    const resetFilters = () => {
      filters.remark = ''
      filters.minAmount = ''
      filters.maxAmount = ''
      filters.startDate = ''
      filters.endDate = ''
      currentPage.value = 1
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
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
      currentPage,
      filters,
      paginatedTransactions,
      filteredTransactions,
      totalPages,
      visiblePages,
      formatAmount,
      formatBalance,
      formatDate,
      getTransactionClass,
      getAmountClass,
      getTransactionIcon,
      applyFilters,
      resetFilters,
      goToPage
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.transactions-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}

/* 页面头部 */
.page-header {
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

/* 筛选区域 */
.filters-section {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.amount-inputs {
  display: flex;
  gap: 0.75rem;
}

.date-inputs {
  display: flex;
  gap: 0.75rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

/* 交易记录区域 */
.transactions-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
  margin-bottom: 2rem;
  overflow: hidden;
}

/* Desktop交易记录 */
.desktop-transactions {
  padding: 1.5rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.transaction-item:last-child {
  margin-bottom: 0;
}

.transaction-credit {
  background-color: #f0f9f0;
  border: 1px solid #d4edda;
}

.transaction-debit {
  background-color: #fdf2f2;
  border: 1px solid #f5c6cb;
}

.transaction-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.25rem;
}

.transaction-credit .transaction-icon {
  background-color: #d4edda;
  color: #155724;
}

.transaction-debit .transaction-icon {
  background-color: #f5c6cb;
  color: #721c24;
}

.transaction-content {
  flex: 1;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.transaction-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
}

.transaction-amount {
  font-size: 1.25rem;
  font-weight: 700;
}

.amount-credit {
  color: #28a745;
}

.amount-debit {
  color: #dc3545;
}

.transaction-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.transaction-date {
  font-weight: 500;
}

.transaction-balance {
  font-weight: 500;
}

/* Mobile交易记录 */
.mobile-transactions {
  padding: 1rem;
}

.mobile-transaction-item {
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.mobile-transaction-item:last-child {
  margin-bottom: 0;
}

.mobile-transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.mobile-transaction-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-transaction-left .transaction-icon {
  width: 40px;
  height: 40px;
  font-size: 1rem;
}

.transaction-info .transaction-title {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.transaction-info .transaction-date {
  font-size: 0.85rem;
  color: #6c757d;
}

.mobile-transaction-right {
  text-align: right;
}

.mobile-transaction-right .transaction-amount {
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.mobile-transaction-right .transaction-balance {
  font-size: 0.85rem;
  color: #6c757d;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.empty-state h4 {
  margin-bottom: 1rem;
  color: #495057;
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: center;
}

.pagination .page-link {
  color: #495057;
  border-color: #dee2e6;
  padding: 0.5rem 0.75rem;
}

.pagination .page-link:hover {
  color: #28a745;
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.pagination .page-item.active .page-link {
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  background-color: #fff;
  border-color: #dee2e6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .transactions-container {
    padding: 1rem;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .filters-section {
    padding: 1rem;
  }
  
  .filters-section .row {
    gap: 1rem;
  }
  
  .filters-section .col-md-3,
  .filters-section .col-md-4,
  .filters-section .col-md-2 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .amount-inputs,
  .date-inputs {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .transactions-container {
    padding: 0.5rem;
  }
  
  .page-header,
  .filters-section,
  .transactions-section {
    border-radius: 0.25rem;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .filters-section {
    padding: 1rem;
  }
}
</style> 