<template>
  <div class="order-list-container">
    <!-- Web版本 -->
    <div class="web-order-list" v-if="!isMobile">
      <!-- Header -->
      <div class="order-header">
        <div class="header-left">
          <button class="btn btn-outline-secondary me-2" @click="goBack">
            <i class="fas fa-arrow-left me-1"></i>Back
          </button>
          <h3 class="order-title">Order List</h3>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline-success me-2" @click="refreshOrders">
            <i class="fas fa-refresh me-1"></i>Refresh
          </button>
        </div>
      </div>

      <div class="order-content">
        <!-- Order Table -->
        <div class="order-table">
          <div class="table-header">
            <div class="header-cell">Creation Time</div>
            <div class="header-cell">Order Number</div>
            <div class="header-cell">Order Type</div>
            <div class="header-cell">Actual Payment</div>
            <div class="header-cell">Status</div>
            <div class="header-cell">Operation</div>
          </div>
          
          <div 
            v-for="order in orders" 
            :key="order.id" 
            class="order-row"
          >
            <div class="time-cell">
              <span class="order-time">{{ formatTime(order.createdTime) }}</span>
            </div>
            
            <div class="number-cell">
              <span class="order-number">{{ order.orderNumber }}</span>
            </div>
            
            <div class="type-cell">
              <span class="order-type">{{ getOrderTypeText(order.orderType) }}</span>
            </div>
            
            <div class="amount-cell">
              <span class="order-amount">${{ formatPrice(order.actualPayment) }}</span>
            </div>
            
            <div class="status-cell">
              <span 
                class="status-badge" 
                :class="getStatusClass(order.status)"
              >
                {{ getStatusText(order.status) }}
              </span>
            </div>
            
            <div class="action-cell">
              <div class="action-buttons">
                <!-- Awaiting Shipment Status -->
                <template v-if="order.status === 'awaiting_shipment'">
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click="viewOrder(order)"
                  >
                    View Details
                  </button>
                </template>
                
                <!-- Awaiting Payment Status -->
                <template v-else-if="order.status === 'awaiting_payment'">
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click="viewOrder(order)"
                  >
                    View
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-ok" 
                    @click="payOrder(order)"
                  >
                    Pay
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click="deleteOrder(order)"
                  >
                    Delete
                  </button>
                </template>
                
                <!-- Awaiting Delivery Status -->
                <template v-else-if="order.status === 'awaiting_delivery'">
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click="viewOrder(order)"
                  >
                    View Details
                  </button>
                </template>
                
                <!-- Completed Status -->
                <template v-else-if="order.status === 'completed'">
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click="viewOrder(order)"
                  >
                    View Details
                  </button>
                </template>
              </div>
            </div>
          </div>
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
    <div class="mobile-order-list" v-else>
      <div class="mobile-header">
        <div class="mobile-header-left">
          <button class="btn btn-sm btn-outline-secondary me-2" @click="goBack">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h3 class="mobile-title">Order List</h3>
        </div>
        <button class="btn btn-sm btn-success" @click="refreshOrders">
          <i class="fas fa-refresh"></i>
        </button>
      </div>

      <div class="mobile-orders">
        <div 
          v-for="order in orders" 
          :key="order.id" 
          class="mobile-order-card"
        >
          <div class="card-header">
            <div class="order-info">
              <div class="order-number">{{ order.orderNumber }}</div>
              <div class="order-time">{{ formatTime(order.createdTime) }}</div>
            </div>
            <span 
              class="status-badge" 
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
          
          <div class="card-body">
            <div class="order-detail">
              <div class="detail-item">
                <span class="label">Order Type:</span>
                <span class="value">{{ getOrderTypeText(order.orderType) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Actual Payment:</span>
                <span class="value amount">${{ formatPrice(order.actualPayment) }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="mobile-actions">
              <!-- Awaiting Shipment Status -->
              <template v-if="order.status === 'awaiting_shipment'">
                <button 
                  class="btn btn-outline-primary btn-sm" 
                  @click="viewOrder(order)"
                >
                  View Details
                </button>
              </template>
              
              <!-- Awaiting Payment Status -->
              <template v-else-if="order.status === 'awaiting_payment'">
                <button 
                  class="btn btn-outline-primary btn-sm" 
                  @click="viewOrder(order)"
                >
                  View
                </button>
                <button 
                  class="btn btn-outline-ok btn-sm" 
                  @click="payOrder(order)"
                >
                  Pay
                </button>
                <button 
                  class="btn btn-outline-danger btn-sm" 
                  @click="deleteOrder(order)"
                >
                  Delete
                </button>
              </template>
              
              <!-- Awaiting Delivery Status -->
              <template v-else-if="order.status === 'awaiting_delivery'">
                <button 
                  class="btn btn-outline-primary btn-sm" 
                  @click="viewOrder(order)"
                >
                  View Details
                </button>
              </template>
              
              <!-- Completed Status -->
              <template v-else-if="order.status === 'completed'">
                <button 
                  class="btn btn-outline-primary btn-sm" 
                  @click="viewOrder(order)"
                >
                  View Details
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile Pagination -->
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        :is-mobile="true"
        @page-change="handlePageChange"
      />
    </div>

    <!-- 确认删除模态框 -->
    <div 
      v-if="showDeleteModal" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="closeDeleteModal"
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete order <strong>{{ orderToDelete?.orderNumber }}</strong>?</p>
            <p class="text-muted">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeDeleteModal"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="confirmDelete"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'OrderList',
  components: {
    Pagination
  },
  emits: ['go-back'],
  setup(props, { emit }) {
    const isMobile = ref(window.innerWidth <= 768)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const showDeleteModal = ref(false)
    const orderToDelete = ref(null)
    
    // 模拟订单数据 - 增加更多数据用于测试分页
    const allOrders = ref([
      {
        id: 1,
        createdTime: '2025-02-05 16:37:00',
        orderNumber: '202507251030151234561',
        orderType: 'register',
        actualPayment: 100,
        status: 'awaiting_shipment'
      },
      {
        id: 2,
        createdTime: '2025-02-05 16:37:00',
        orderNumber: '202507251030151234562',
        orderType: 'upgrade',
        actualPayment: 13.00,
        status: 'awaiting_payment'
      },
      {
        id: 3,
        createdTime: '2025-02-05 16:37:00',
        orderNumber: '202507251030151234563',
        orderType: 'repeat_purchase',
        actualPayment: 400,
        status: 'awaiting_delivery'
      },
      {
        id: 4,
        createdTime: '2025-02-05 16:37:00',
        orderNumber: '202507251030151234564',
        orderType: 'repeat_purchase',
        actualPayment: 800,
        status: 'completed'
      },
      {
        id: 5,
        createdTime: '2025-02-05 16:37:00',
        orderNumber: '202507251030151234565',
        orderType: 'repeat_purchase',
        actualPayment: 1200,
        status: 'completed'
      },
      {
        id: 6,
        createdTime: '2025-02-04 14:22:00',
        orderNumber: '202507251030151234566',
        orderType: 'register',
        actualPayment: 250,
        status: 'awaiting_shipment'
      },
      {
        id: 7,
        createdTime: '2025-02-04 12:15:00',
        orderNumber: '202507251030151234567',
        orderType: 'upgrade',
        actualPayment: 89.99,
        status: 'awaiting_payment'
      },
      {
        id: 8,
        createdTime: '2025-02-04 10:30:00',
        orderNumber: '202507251030151234568',
        orderType: 'repeat_purchase',
        actualPayment: 567.50,
        status: 'awaiting_delivery'
      },
      {
        id: 9,
        createdTime: '2025-02-03 18:45:00',
        orderNumber: '202507251030151234569',
        orderType: 'repeat_purchase',
        actualPayment: 1350.75,
        status: 'completed'
      },
      {
        id: 10,
        createdTime: '2025-02-03 16:20:00',
        orderNumber: '202507251030151234570',
        orderType: 'register',
        actualPayment: 199.99,
        status: 'completed'
      },
      {
        id: 11,
        createdTime: '2025-02-03 14:10:00',
        orderNumber: '202507251030151234571',
        orderType: 'upgrade',
        actualPayment: 45.50,
        status: 'awaiting_payment'
      },
      {
        id: 12,
        createdTime: '2025-02-02 20:33:00',
        orderNumber: '202507251030151234572',
        orderType: 'repeat_purchase',
        actualPayment: 789.25,
        status: 'awaiting_delivery'
      },
      {
        id: 13,
        createdTime: '2025-02-02 15:55:00',
        orderNumber: '202507251030151234573',
        orderType: 'register',
        actualPayment: 320.80,
        status: 'completed'
      },
      {
        id: 14,
        createdTime: '2025-02-01 11:40:00',
        orderNumber: '202507251030151234574',
        orderType: 'upgrade',
        actualPayment: 67.30,
        status: 'awaiting_shipment'
      },
      {
        id: 15,
        createdTime: '2025-02-01 09:25:00',
        orderNumber: '202507251030151234575',
        orderType: 'repeat_purchase',
        actualPayment: 1599.99,
        status: 'completed'
      }
    ])

    // 计算属性 - 分页相关
    const totalPages = computed(() => {
      return Math.ceil(allOrders.value.length / pageSize.value)
    })

    const orders = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return allOrders.value.slice(start, end)
    })

    // 响应式处理
    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    // 格式化时间
    const formatTime = (timeStr) => {
      return timeStr
    }

    // 格式化价格
    const formatPrice = (price) => {
      return price.toFixed(2)
    }

    // 获取订单类型文本
    const getOrderTypeText = (type) => {
      const typeMap = {
        'register': 'Register',
        'upgrade': 'Upgrade',
        'repeat_purchase': 'Repeat Purchase'
      }
      return typeMap[type] || type
    }

    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'awaiting_shipment': 'Awaiting Shipment',
        'awaiting_payment': 'Awaiting Payment',
        'awaiting_delivery': 'Awaiting Delivery',
        'completed': 'Completed'
      }
      return statusMap[status] || status
    }

    // 获取状态样式类
    const getStatusClass = (status) => {
      const classMap = {
        'awaiting_shipment': 'status-awaiting-shipment',
        'awaiting_payment': 'status-awaiting-payment',
        'awaiting_delivery': 'status-awaiting-delivery',
        'completed': 'status-completed'
      }
      return classMap[status] || ''
    }

    // 查看订单详情
    const viewOrder = (order) => {
      console.log('View order details:', order)
      // 这里可以跳转到订单详情页面或打开详情模态框
    }

    // 支付订单
    const payOrder = (order) => {
      console.log('Pay order:', order)
      // 这里可以跳转到支付页面
    }

    // 删除订单
    const deleteOrder = (order) => {
      orderToDelete.value = order
      showDeleteModal.value = true
    }

    // 关闭删除模态框
    const closeDeleteModal = () => {
      showDeleteModal.value = false
      orderToDelete.value = null
    }

    // 确认删除
    const confirmDelete = () => {
      if (orderToDelete.value) {
        const index = allOrders.value.findIndex(o => o.id === orderToDelete.value.id)
        if (index > -1) {
          allOrders.value.splice(index, 1)
                  // 如果删除后当前页没有数据，回到上一页
        if (orders.value.length === 0 && currentPage.value > 1) {
          currentPage.value--
        }
      }
      console.log('Delete order:', orderToDelete.value)
      }
      closeDeleteModal()
    }

    // 刷新订单
    const refreshOrders = () => {
      console.log('Refresh order list')
      // 这里可以重新获取订单数据
    }

    // 处理页面变化
    const handlePageChange = (page) => {
      currentPage.value = page
      // Scroll to top to show new page content
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 返回上一页
    const goBack = () => {
      emit('go-back')
    }

    return {
      isMobile,
      orders,
      currentPage,
      totalPages,
      showDeleteModal,
      orderToDelete,
      formatTime,
      formatPrice,
      getOrderTypeText,
      getStatusText,
      getStatusClass,
      viewOrder,
      payOrder,
      deleteOrder,
      closeDeleteModal,
      confirmDelete,
      refreshOrders,
      handlePageChange,
      goBack
    }
  }
}
</script>

<style scoped>
/* 容器样式 */
.order-list-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

/* Web版本样式 */
.web-order-list {
  max-width: 1200px;
  margin: 0 auto;
}

.order-header {
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

.order-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.order-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.order-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 0.8fr 0.8fr 0.8fr 1.2fr;
  gap: 15px;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #495057;
}

.header-cell {
  text-align: center;
}

.order-row {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 0.8fr 0.8fr 0.8fr 1.2fr;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid #f1f3f4;
  align-items: center;
  transition: background-color 0.2s;
}

.order-row:hover {
  background-color: #f8f9fa;
}

.time-cell, .number-cell, .type-cell, .amount-cell, .status-cell, .action-cell {
  text-align: center;
}

.order-time {
  font-size: 14px;
  color: #6c757d;
}

.order-number {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.order-type {
  font-size: 14px;
  color: #333;
}

.order-amount {
  font-size: 16px;
  font-weight: 600;
  color: #dc3545;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.status-awaiting-shipment {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-awaiting-payment {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-awaiting-delivery {
  background-color: #e8f5e8;
  color: #388e3c;
}

.status-completed {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-buttons .btn {
  font-size: 12px;
  padding: 2px 6px;
  border: none;
  background: none;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.action-buttons .btn:hover {
  color: #0056b3;
}

.action-buttons .btn.btn-outline-danger {
  color: #dc3545;
}

.action-buttons .btn.btn-outline-danger:hover {
  color: #c82333;
}
.action-buttons .btn.btn-outline-ok {
  color: #388e3c;
}

.action-buttons .btn.btn-outline-ok:hover {
  color: #2e7d32;
}


/* 移动版本样式 */
.mobile-order-list {
  padding: 10px;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.mobile-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.mobile-orders {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.order-info {
  flex: 1;
}

.order-info .order-number {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.order-info .order-time {
  font-size: 12px;
  color: #6c757d;
}

.card-body {
  padding: 15px;
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  font-size: 14px;
  color: #6c757d;
}

.detail-item .value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.detail-item .value.amount {
  color: #dc3545;
  font-weight: 600;
}

.card-footer {
  padding: 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.mobile-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.mobile-actions .btn {
  font-size: 12px;
  padding: 2px 6px;
  border: none;
  background: none;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.mobile-actions .btn:hover {
  color: #0056b3;
}

.mobile-actions .btn.btn-outline-danger {
  color: #dc3545;
}

.mobile-actions .btn.btn-outline-danger:hover {
  color: #c82333;
}

.mobile-actions .btn.btn-outline-ok {
  color: #388e3c;
}

.mobile-actions .btn.btn-outline-ok:hover {
  color: #2e7d32;
}
.action-buttons .btn.btn-outline-ok {
  color: #388e3c;
}

.action-buttons .btn.btn-outline-ok:hover {
  color: #388e3c;
}


/* 响应式适配 */
@media (max-width: 768px) {
  .order-list-container {
    padding: 10px;
  }
  
  .web-order-list {
    display: none;
  }
  
  .mobile-order-list {
    display: block;
  }
}

@media (min-width: 769px) {
  .mobile-order-list {
    display: none;
  }
  
  .web-order-list {
    display: block;
  }
}

/* 模态框样式 */
.modal {
  z-index: 1050;
}

.modal-content {
  border-radius: 8px;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 16px 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  color: #000;
  opacity: 0.5;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 0.75;
}
</style>
