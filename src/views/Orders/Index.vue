<template>
  <div class="orders-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Order Management</h2>
      <div class="d-flex gap-2">
        <select class="form-select" v-model="selectedStatus" style="width: auto;">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button class="btn btn-outline-secondary" @click="resetFilters">
          <i class="fas fa-refresh"></i>
        </button>
      </div>
    </div>
    
    <!-- 订单统计 -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card stats-card-sm">
          <div class="card-body text-center">
            <i class="fas fa-clock fa-2x text-warning mb-2"></i>
            <h4>{{ orderStats.pending }}</h4>
            <small class="text-muted">Pending</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card stats-card-sm">
          <div class="card-body text-center">
            <i class="fas fa-spinner fa-2x text-info mb-2"></i>
            <h4>{{ orderStats.processing }}</h4>
            <small class="text-muted">Processing</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card stats-card-sm">
          <div class="card-body text-center">
            <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
            <h4>{{ orderStats.completed }}</h4>
            <small class="text-muted">Completed</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card stats-card-sm">
          <div class="card-body text-center">
            <i class="fas fa-times-circle fa-2x text-danger mb-2"></i>
            <h4>{{ orderStats.cancelled }}</h4>
            <small class="text-muted">Cancelled</small>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 订单列表 -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>
                  <div class="fw-semibold">{{ order.orderNumber }}</div>
                  <small class="text-muted">{{ order.id }}</small>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="user-avatar-sm me-2">
                      <i class="fas fa-user"></i>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ order.customer }}</div>
                      <small class="text-muted">{{ order.email }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{{ formatDate(order.date) }}</div>
                  <small class="text-muted">{{ formatTime(order.date) }}</small>
                </td>
                <td>
                  <div class="fw-semibold text-primary">{{ formatCurrency(order.amount) }}</div>
                  <small class="text-muted">{{ order.items }} items</small>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="getStatusClass(order.status)"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button 
                      class="btn btn-outline-primary btn-sm"
                      @click="viewOrder(order.id)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      v-if="order.status === 'pending'"
                      class="btn btn-outline-success btn-sm"
                      @click="updateOrderStatus(order.id, 'processing')"
                    >
                      <i class="fas fa-play"></i>
                    </button>
                    <button 
                      v-if="order.status === 'processing'"
                      class="btn btn-outline-success btn-sm"
                      @click="updateOrderStatus(order.id, 'completed')"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    <button 
                      v-if="order.status === 'pending' || order.status === 'processing'"
                      class="btn btn-outline-danger btn-sm"
                      @click="updateOrderStatus(order.id, 'cancelled')"
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
    
    <!-- 订单详情模态框 -->
    <div 
      class="modal fade" 
      :class="{ show: showDetailsModal }"
      style="display: block;"
      v-if="showDetailsModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Order Details - {{ selectedOrder?.orderNumber }}</h5>
            <button type="button" class="btn-close" @click="showDetailsModal = false"></button>
          </div>
          <div class="modal-body" v-if="selectedOrder">
            <div class="row">
              <div class="col-md-6">
                <h6>Customer Information</h6>
                <p><strong>Name:</strong> {{ selectedOrder.customer.name }}</p>
                <p><strong>Email:</strong> {{ selectedOrder.customer.email }}</p>
                <p><strong>Phone:</strong> {{ selectedOrder.customer.phone }}</p>
              </div>
              <div class="col-md-6">
                <h6>Order Information</h6>
                <p><strong>Order Number:</strong> {{ selectedOrder.orderNumber }}</p>
                <p><strong>Date:</strong> {{ formatDate(selectedOrder.date) }}</p>
                <p><strong>Status:</strong> 
                  <span :class="getStatusClass(selectedOrder.status)">
                    {{ getStatusText(selectedOrder.status) }}
                  </span>
                </p>
              </div>
            </div>
            
            <hr>
            
            <h6>Product List</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>${{ item.price }}</td>
                    <td>${{ (item.quantity * item.price).toFixed(2) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th colspan="3">Total</th>
                    <th>${{ selectedOrder.totalAmount }}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDetailsModal = false">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 模态框背景遮罩 -->
    <div 
      class="modal-backdrop fade show" 
      v-if="showDetailsModal"
      @click="showDetailsModal = false"
    ></div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'

export default {
  name: 'Orders',
  setup() {
    const selectedStatus = ref('')
    const showDetailsModal = ref(false)
    const selectedOrder = ref(null)
    
    // 订单统计
    const orderStats = reactive({
      pending: 12,
      processing: 8,
      completed: 45,
      cancelled: 3
    })
    
    // 模拟订单数据
    const orders = ref([
      {
        id: 1,
        orderNumber: 'ORD-2023-001',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        },
        date: new Date('2023-12-01 10:30:00'),
        status: 'completed',
        totalAmount: 299.99,
        items: [
          { id: 1, name: 'iPhone 14 Pro', quantity: 1, price: 299.99 }
        ]
      },
      {
        id: 2,
        orderNumber: 'ORD-2023-002',
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891'
        },
        date: new Date('2023-12-02 14:15:00'),
        status: 'processing',
        totalAmount: 149.50,
        items: [
          { id: 2, name: '无线蓝牙耳机', quantity: 1, price: 149.50 }
        ]
      },
      {
        id: 3,
        orderNumber: 'ORD-2023-003',
        customer: {
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+1234567892'
        },
        date: new Date('2023-12-03 09:45:00'),
        status: 'pending',
        totalAmount: 89.99,
        items: [
          { id: 3, name: '运动T恤', quantity: 3, price: 29.99 }
        ]
      },
      {
        id: 4,
        orderNumber: 'ORD-2023-004',
        customer: {
          name: 'Alice Wilson',
          email: 'alice@example.com',
          phone: '+1234567893'
        },
        date: new Date('2023-12-04 16:20:00'),
        status: 'completed',
        totalAmount: 199.00,
        items: [
          { id: 4, name: 'JavaScript高级编程', quantity: 4, price: 49.99 }
        ]
      },
      {
        id: 5,
        orderNumber: 'ORD-2023-005',
        customer: {
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          phone: '+1234567894'
        },
        date: new Date('2023-12-05 11:10:00'),
        status: 'cancelled',
        totalAmount: 79.99,
        items: [
          { id: 5, name: '智能台灯', quantity: 1, price: 79.99 }
        ]
      }
    ])
    
    // 过滤订单
    const filteredOrders = computed(() => {
      if (!selectedStatus.value) {
        return orders.value
      }
      return orders.value.filter(order => order.status === selectedStatus.value)
    })
    
    // 格式化货币
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    }
    
    // 格式化日期
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)
    }
    
    // 格式化时间
    const formatTime = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    // 获取状态样式
    const getStatusClass = (status) => {
      const statusMap = {
        'pending': 'bg-warning',
        'processing': 'bg-info',
        'completed': 'bg-success',
        'cancelled': 'bg-danger'
      }
      return statusMap[status] || 'bg-secondary'
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'pending': 'Pending',
        'processing': 'Processing',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      }
      return statusMap[status] || status
    }
    
    // 更新订单状态
    const updateOrderStatus = (orderId, newStatus) => {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = newStatus
        alert(`Order ${order.orderNumber} status updated to ${newStatus}`)
      }
    }
    
    // 查看订单详情
    const viewOrder = (orderId) => {
      selectedOrder.value = orders.value.find(o => o.id === orderId)
      showDetailsModal.value = true
    }
    
    // 删除订单
    const deleteOrder = (orderId) => {
      if (confirm('Are you sure you want to delete this order?')) {
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index > -1) {
          orders.value.splice(index, 1)
        }
      }
    }
    
    // 重置筛选
    const resetFilters = () => {
      selectedStatus.value = ''
    }
    
    return {
      selectedStatus,
      showDetailsModal,
      selectedOrder,
      orderStats,
      orders,
      filteredOrders,
      formatCurrency,
      formatDate,
      formatTime,
      getStatusClass,
      getStatusText,
      updateOrderStatus,
      viewOrder,
      deleteOrder,
      resetFilters
    }
  }
}
</script>

<style scoped>
.orders-page {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-card-sm {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stats-card-sm:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.user-avatar-sm {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.form-select.status-warning {
  border-color: #ffc107;
  color: #664d03;
}

.form-select.status-info {
  border-color: #0dcaf0;
  color: #055160;
}

.form-select.status-success {
  border-color: #198754;
  color: #0a3622;
}

.form-select.status-danger {
  border-color: #dc3545;
  color: #58151c;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.table th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .stats-card-sm {
    margin-bottom: 15px;
  }
  
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .user-avatar-sm {
    width: 28px;
    height: 28px;
  }
}
</style> 