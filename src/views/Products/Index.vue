<template>
  <div class="cart-container">
    <!-- 订单列表组件 -->
    <OrderList v-if="showOrderList" @go-back="toggleOrderList" />
    
    <!-- Web版本 -->
    <div class="web-cart" v-if="!isMobile && !showOrderList">
      <!-- Header -->
      <div class="cart-header">
        <div class="location-info">
          <i class="fas fa-map-marker-alt text-success me-2"></i>
          <span>Self-pickup (Pakistan)</span>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline-success me-2" @click="openAddressModal">
            Change of address
          </button>
          <button class="btn btn-success" @click="toggleOrderList">
            Order list
          </button>
        </div>
      </div>

      <div class="cart-content">
        <!-- Left Section - Product List -->
        <div class="product-section">
          <div class="product-table">
            <div class="table-header">
              <div class="header-cell">Trade name</div>
              <div class="header-cell">Unit Price</div>
              <div class="header-cell">Promo Price</div>
              <div class="header-cell">Quantity</div>
              <div class="header-cell">Subtotal</div>
            </div>
            
            <div 
              v-for="product in products" 
              :key="product.id" 
              class="product-row"
            >
              <div class="product-info">
                <div class="product-image">
                  <img :src="product.image" :alt="product.name">
                </div>
                <div class="product-details">
                  <h6 class="product-name">{{ product.name }}</h6>
                </div>
              </div>
              
              <div class="price-cell">
                <span class="unit-price">${{ formatPrice(product.unitPrice) }}</span>
              </div>
              
              <div class="price-cell">
                <span class="promo-price">${{ formatPrice(product.promoPrice) }}</span>
              </div>
              
              <div class="quantity-cell">
                <div class="quantity-controls">
                  <button 
                    class="qty-btn" 
                    @click="decreaseQuantity(product.id)"
                    :disabled="product.quantity <= 0"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    class="qty-input" 
                    v-model="product.quantity"
                    min="0"
                    @change="updateQuantity(product.id, $event.target.value)"
                  >
                  <button 
                    class="qty-btn" 
                    @click="increaseQuantity(product.id)"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div class="subtotal-cell">
                <span class="subtotal">
                  {{ product.quantity > 0 ? `$${formatPrice(product.promoPrice * product.quantity)}` : '--' }}
                </span>
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

        <!-- Right Section - Payment Module -->
        <div class="payment-module">
          <!-- Discount Info -->
          <div class="discount-section">
            <div class="discount-info">
              <span class="discount-amount">{{ memberDiscount }} Current discount</span>
              <span class="member-level">{{ memberLevel }}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="payment-section">
            <h6 class="section-title">Method of payment:</h6>
            <div class="payment-options">
              <div class="payment-option">
                <input 
                  type="radio" 
                  id="balance" 
                  name="payment" 
                  value="balance"
                  v-model="selectedPayment"
                  class="payment-radio"
                >
                <label for="balance" class="payment-label">
                  Balance-${{ formatPrice(balance) }}
                </label>
              </div>
              <div class="payment-option">
                <input 
                  type="radio" 
                  id="online" 
                  name="payment" 
                  value="online"
                  v-model="selectedPayment"
                  class="payment-radio"
                >
                <label for="online" class="payment-label">
                  Online payment
                </label>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="summary-section">
            <div class="summary-row">
              <span class="summary-label">Totally</span>
              <span class="summary-value">${{ formatPrice(totalAmount) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Promo Price</span>
              <span class="summary-value">${{ formatPrice(promoTotal) }}</span>
            </div>
            <div class="summary-row final-summary">
              <span class="summary-label">Actual payment</span>
              <span class="summary-value actual-payment">${{ formatPrice(actualPayment) }}</span>
            </div>
          </div>

          <!-- Pay Button -->
          <div class="pay-section">
            <button class="pay-button" @click="handlePayment">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile版本 -->
    <div class="mobile-cart" v-if="isMobile && !showOrderList">
      <!-- Header -->
      <div class="cart-header">
        <div class="location-info">
          <i class="fas fa-map-marker-alt text-success me-2"></i>
          <span>Self-pickup (Pakistan)</span>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline-success me-2" @click="openAddressModal">
            Change of address
          </button>
          <button class="btn btn-success" @click="toggleOrderList">
            Order list
          </button>
        </div>
      </div>

      <!-- Product List -->
      <div class="product-list">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-item"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name">
          </div>
          
          <div class="product-details">
            <h6 class="product-name">{{ product.name }}</h6>
            
            <div class="price-info">
              <div class="price-row">
                <span class="price-label">Unit Price:</span>
                <span class="unit-price">${{ formatPrice(product.unitPrice) }}</span>
              </div>
              <div class="price-row">
                <span class="price-label">Promo Price:</span>
                <span class="promo-price">${{ formatPrice(product.promoPrice) }}</span>
              </div>
            </div>
            
            <div class="quantity-section">
              <div class="price-display">
                <span class="current-price">
                  {{ product.quantity > 0 ? `$${formatPrice(product.promoPrice)}` : '$---' }}
                </span>
              </div>
              
              <div class="quantity-controls">
                <button 
                  class="qty-btn minus-btn" 
                  @click="decreaseQuantity(product.id)"
                  :disabled="product.quantity <= 0"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <span class="qty-display">{{ product.quantity }}</span>
                <button 
                  class="qty-btn plus-btn" 
                  @click="increaseQuantity(product.id)"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
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

      <!-- Discount Info -->
      <div class="discount-section">
        <div class="discount-info">
          <span class="discount-amount">{{ memberDiscount }} Current discount</span>
          <span class="member-level">{{ memberLevel }}</span>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="payment-section">
        <h6 class="section-title">Method of payment:</h6>
        <div class="payment-options">
          <div class="payment-option">
            <input 
              type="radio" 
              id="balance-mobile" 
              name="payment-mobile" 
              value="balance"
              v-model="selectedPayment"
              class="payment-radio"
            >
            <label for="balance-mobile" class="payment-label">
              Balance-${{ formatPrice(balance) }}
            </label>
          </div>
          <div class="payment-option">
            <input 
              type="radio" 
              id="online-mobile" 
              name="payment-mobile" 
              value="online"
              v-model="selectedPayment"
              class="payment-radio"
            >
            <label for="online-mobile" class="payment-label">
              Online payment
            </label>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="summary-section">
        <div class="summary-row">
          <span class="summary-label">Totally</span>
          <span class="summary-value">${{ formatPrice(totalAmount) }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Promo Price</span>
          <span class="summary-value">${{ formatPrice(promoTotal) }}</span>
        </div>
        <div class="summary-row final-summary">
          <span class="summary-label">Actual payment</span>
          <span class="summary-value actual-payment">${{ formatPrice(actualPayment) }}</span>
        </div>
      </div>

      <!-- Pay Button -->
      <div class="pay-section">
        <button class="pay-button" @click="handlePayment">
          Pay Now
        </button>
      </div>
    </div>

    <!-- 地址管理组件 -->
    <AddressList ref="addressListRef" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Pagination from '@/components/Pagination.vue'
import AddressList from './components/list.vue'
import OrderList from './components/orderList.vue'

export default {
  name: 'Cart',
  components: {
    Pagination,
    AddressList,
    OrderList
  },
  setup() {
    const isMobile = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const selectedPayment = ref('balance')
    const memberDiscount = ref('0.65')
    const memberLevel = ref('Silver Diamond Member')
    const balance = ref(4.00)
    const addressListRef = ref(null)
    const showOrderList = ref(false)

    // 模拟产品数据
    const allProducts = ref([
      {
        id: 1,
        name: 'Rose Hyaluronic Acid Skin Care Pack',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 99999.00,
        promoPrice: 64999.00,
        quantity: 0
      },
      {
        id: 2,
        name: 'SOOTHINGANDREVITALIZNGIPLAT INUMESSENCE LOTION',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 10.00,
        promoPrice: 6.50,
        quantity: 0
      },
      {
        id: 3,
        name: 'Rose Hyaluronic Acid Skin Care Pack',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 10.00,
        promoPrice: 6.50,
        quantity: 0
      },
      {
        id: 4,
        name: 'Rose Hyaluronic Acid Skin Care Pack',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 10.00,
        promoPrice: 6.50,
        quantity: 0
      },
      {
        id: 5,
        name: 'Rose Hyaluronic Acid Skin Care Pack',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 10.00,
        promoPrice: 6.50,
        quantity: 0
      },
      {
        id: 6,
        name: 'Rose Hyaluronic Acid Skin Care Pack',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 10.00,
        promoPrice: 6.50,
        quantity: 0
      },
      {
        id: 7,
        name: 'Vitamin C Brightening Serum',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 89.99,
        promoPrice: 58.49,
        quantity: 0
      },
      {
        id: 8,
        name: 'Anti-Aging Collagen Cream',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 129.99,
        promoPrice: 84.49,
        quantity: 0
      },
      {
        id: 9,
        name: 'Hydrating Facial Mask Set (5pcs)',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 45.99,
        promoPrice: 29.89,
        quantity: 0
      },
      {
        id: 10,
        name: 'Niacinamide Pore Minimizer',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 39.99,
        promoPrice: 25.99,
        quantity: 0
      },
      {
        id: 11,
        name: 'Retinol Night Recovery Cream',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 149.99,
        promoPrice: 97.49,
        quantity: 0
      },
      {
        id: 12,
        name: 'Green Tea Cleansing Foam',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 24.99,
        promoPrice: 16.24,
        quantity: 0
      },
      {
        id: 13,
        name: 'Peptide Eye Cream',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 79.99,
        promoPrice: 51.99,
        quantity: 0
      },
      {
        id: 14,
        name: 'Ceramide Moisturizing Lotion',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 34.99,
        promoPrice: 22.74,
        quantity: 0
      },
      {
        id: 15,
        name: 'Salicylic Acid Exfoliating Toner',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 29.99,
        promoPrice: 19.49,
        quantity: 0
      },
      {
        id: 16,
        name: 'Sunscreen SPF 50+ PA+++',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 19.99,
        promoPrice: 12.99,
        quantity: 0
      },
      {
        id: 17,
        name: 'Argan Oil Hair Treatment',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 54.99,
        promoPrice: 35.74,
        quantity: 0
      },
      {
        id: 18,
        name: 'Biotin Hair Growth Supplement',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 39.99,
        promoPrice: 25.99,
        quantity: 0
      },
      {
        id: 19,
        name: 'Coconut Oil Body Moisturizer',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 27.99,
        promoPrice: 18.19,
        quantity: 0
      },
      {
        id: 20,
        name: 'Lavender Essential Oil Set',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 49.99,
        promoPrice: 32.49,
        quantity: 0
      },
      {
        id: 21,
        name: 'Charcoal Detox Face Mask',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 15.99,
        promoPrice: 10.39,
        quantity: 0
      },
      {
        id: 22,
        name: 'Aloe Vera Soothing Gel',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 12.99,
        promoPrice: 8.44,
        quantity: 0
      },
      {
        id: 23,
        name: 'Jojoba Oil Facial Cleanser',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 31.99,
        promoPrice: 20.79,
        quantity: 0
      },
      {
        id: 24,
        name: 'Shea Butter Hand Cream',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 18.99,
        promoPrice: 12.34,
        quantity: 0
      },
      {
        id: 25,
        name: 'Tea Tree Oil Spot Treatment',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 22.99,
        promoPrice: 14.94,
        quantity: 0
      },
      {
        id: 26,
        name: 'Rosehip Oil Anti-Aging Serum',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 67.99,
        promoPrice: 44.19,
        quantity: 0
      },
      {
        id: 27,
        name: 'Bamboo Charcoal Toothbrush Set',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 9.99,
        promoPrice: 6.49,
        quantity: 0
      },
      {
        id: 28,
        name: 'Organic Lip Balm Trio',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 16.99,
        promoPrice: 11.04,
        quantity: 0
      },
      {
        id: 29,
        name: 'Himalayan Salt Body Scrub',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 25.99,
        promoPrice: 16.89,
        quantity: 0
      },
      {
        id: 30,
        name: 'Ginseng Energy Face Serum',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 89.99,
        promoPrice: 58.49,
        quantity: 0
      },
      {
        id: 31,
        name: 'Cucumber Hydrating Mist',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 19.99,
        promoPrice: 12.99,
        quantity: 0
      },
      {
        id: 32,
        name: 'Moringa Oil Hair Mask',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 43.99,
        promoPrice: 28.59,
        quantity: 0
      },
      {
        id: 33,
        name: 'Turmeric Brightening Face Pack',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 21.99,
        promoPrice: 14.29,
        quantity: 0
      },
      {
        id: 34,
        name: 'Vitamin E Night Repair Cream',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 56.99,
        promoPrice: 37.04,
        quantity: 0
      },
      {
        id: 35,
        name: 'Dead Sea Mineral Mud Mask',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 33.99,
        promoPrice: 22.09,
        quantity: 0
      },
      {
        id: 36,
        name: 'Chamomile Calming Toner',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 28.99,
        promoPrice: 18.84,
        quantity: 0
      },
      {
        id: 37,
        name: 'Honey Oat Exfoliating Scrub',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 24.99,
        promoPrice: 16.24,
        quantity: 0
      },
      {
        id: 38,
        name: 'Arnica Healing Balm',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 17.99,
        promoPrice: 11.69,
        quantity: 0
      },
      {
        id: 39,
        name: 'Grape Seed Antioxidant Serum',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 72.99,
        promoPrice: 47.44,
        quantity: 0
      },
      {
        id: 40,
        name: 'Eucalyptus Body Wash',
        image: '/src/assets/img/shangpin.png',
        unitPrice: 13.99,
        promoPrice: 9.09,
        quantity: 0
      }
    ])

    // 计算属性 - 分页相关
    const totalPages = computed(() => {
      return Math.ceil(allProducts.value.length / itemsPerPage.value)
    })

    const products = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return allProducts.value.slice(start, end)
    })

    // 计算属性 - 价格相关
    const totalAmount = computed(() => {
      return allProducts.value.reduce((sum, product) => {
        return sum + (product.unitPrice * product.quantity)
      }, 0)
    })

    const promoTotal = computed(() => {
      return allProducts.value.reduce((sum, product) => {
        return sum + (product.promoPrice * product.quantity)
      }, 0)
    })

    const actualPayment = computed(() => {
      return promoTotal.value
    })

    // 方法
    const formatPrice = (price) => {
      return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const increaseQuantity = (productId) => {
      const product = allProducts.value.find(p => p.id === productId)
      if (product) {
        product.quantity++
      }
    }

    const decreaseQuantity = (productId) => {
      const product = allProducts.value.find(p => p.id === productId)
      if (product && product.quantity > 0) {
        product.quantity--
      }
    }

    const updateQuantity = (productId, value) => {
      const product = allProducts.value.find(p => p.id === productId)
      if (product) {
        product.quantity = Math.max(0, parseInt(value) || 0)
      }
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      // 滚动到顶部以便用户看到新页面的内容
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handlePayment = () => {
      if (actualPayment.value > 0) {
        alert(`Processing payment of $${formatPrice(actualPayment.value)}`)
      } else {
        alert('Please add items to cart before payment')
      }
    }

    const checkDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth <= 768
      
      isMobile.value = isMobileDevice || isSmallScreen
    }

    const openAddressModal = () => {
      if (addressListRef.value) {
        addressListRef.value.openAddressModal()
      }
    }

    const toggleOrderList = () => {
      showOrderList.value = !showOrderList.value
    }

    onMounted(() => {
      checkDeviceType()
      window.addEventListener('resize', checkDeviceType)
    })

    return {
      isMobile,
      currentPage,
      totalPages,
      selectedPayment,
      memberDiscount,
      memberLevel,
      balance,
      products,
      totalAmount,
      promoTotal,
      actualPayment,
      addressListRef,
      showOrderList,
      formatPrice,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      handlePageChange,
      handlePayment,
      openAddressModal,
      toggleOrderList
    }
  }
}
</script>

<style scoped>
.cart-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Web版本样式 */
.web-cart {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 0.3s ease-in-out;
}

.web-cart .cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.web-cart .location-info {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.web-cart .header-actions .btn {
  font-size: 14px;
  padding: 8px 16px;
}

.web-cart .cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
}

.web-cart .product-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.web-cart .payment-module {
  position: sticky;
  top: 20px;
}

.web-cart .product-table {
  margin-bottom: 20px;
}

.web-cart .table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #495057;
}

.web-cart .header-cell {
  text-align: center;
}

.web-cart .product-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid #f1f3f4;
  align-items: center;
}

.web-cart .product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.web-cart .product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.web-cart .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.web-cart .product-name {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
}

.web-cart .price-cell {
  text-align: center;
}

.web-cart .unit-price {
  color: #6c757d;
  text-decoration: line-through;
  font-size: 14px;
}

.web-cart .promo-price {
  color: #dc3545;
  font-weight: 600;
  font-size: 16px;
}

.web-cart .quantity-cell {
  display: flex;
  justify-content: center;
}

.web-cart .quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
}

.web-cart .qty-btn {
  border: none;
  background: #f8f9fa;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.web-cart .qty-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.web-cart .qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.web-cart .qty-input {
  border: none;
  text-align: center;
  width: 50px;
  padding: 8px;
  font-size: 14px;
}

.web-cart .qty-input:focus {
  outline: none;
}

.web-cart .subtotal-cell {
  text-align: center;
}

.web-cart .subtotal {
  font-weight: 600;
  color: #28a745;
  font-size: 16px;
}

.web-cart .payment-module .discount-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.web-cart .payment-module .discount-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.web-cart .payment-module .discount-amount {
  font-size: 16px;
  font-weight: 600;
  color: #28a745;
}

.web-cart .payment-module .member-level {
  font-size: 14px;
  color: #6c757d;
}

.web-cart .payment-module .payment-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.web-cart .payment-module .section-title {
  font-weight: 600;
  margin-bottom: 15px;
  color: #495057;
}

.web-cart .payment-module .payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.web-cart .payment-module .payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.web-cart .payment-module .payment-radio {
  width: 18px;
  height: 18px;
  accent-color: #28a745;
  cursor: pointer;
  margin: 0;
  vertical-align: middle;
  appearance: auto;
  -webkit-appearance: radio;
  -moz-appearance: radio;
}

.web-cart .payment-module .payment-label {
  font-size: 14px;
  cursor: pointer;
}

.web-cart .payment-module .summary-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.web-cart .payment-module .summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.web-cart .payment-module .summary-label {
  font-size: 14px;
  color: #6c757d;
}

.web-cart .payment-module .summary-value {
  font-weight: 600;
  font-size: 16px;
}

.web-cart .payment-module .final-summary {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.web-cart .payment-module .actual-payment {
  color: #fd7e14;
  font-size: 18px;
}

.web-cart .payment-module .pay-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.web-cart .payment-module .pay-button {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.web-cart .payment-module .pay-button:hover {
  background: #218838;
}

/* Mobile版本样式 */
.mobile-cart {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 100px;
  animation: fadeIn 0.3s ease-in-out;
}

.mobile-cart .cart-header {
  background: white;
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
}

.mobile-cart .location-info {
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-bottom: 15px;
}

.mobile-cart .header-actions {
  display: flex;
  gap: 10px;
}

.mobile-cart .header-actions .btn {
  flex: 1;
  font-size: 14px;
  padding: 10px;
}

.mobile-cart .product-list {
  padding: 15px;
}

.mobile-cart .product-item {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  gap: 15px;
}

.mobile-cart .product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-cart .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-cart .product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-cart .product-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: #333;
}

.mobile-cart .price-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mobile-cart .price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-cart .price-label {
  font-size: 12px;
  color: #6c757d;
}

.mobile-cart .unit-price {
  font-size: 12px;
  color: #6c757d;
  text-decoration: line-through;
}

.mobile-cart .promo-price {
  font-size: 14px;
  color: #dc3545;
  font-weight: 600;
}

.mobile-cart .quantity-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.mobile-cart .price-display {
  flex: 1;
}

.mobile-cart .current-price {
  font-size: 18px;
  font-weight: 700;
  color: #fd7e14;
}

.mobile-cart .quantity-controls {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 4px;
  gap: 15px;
}

.mobile-cart .qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #28a745;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.mobile-cart .qty-btn:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.mobile-cart .qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-cart .qty-display {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 20px;
  text-align: center;
}

.mobile-cart .pagination-section {
  padding: 20px 15px;
  background: white;
  margin: 15px 0;
}

.mobile-cart .discount-section {
  background: white;
  padding: 15px;
  margin: 15px 0;
}

.mobile-cart .discount-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mobile-cart .discount-amount {
  font-size: 16px;
  font-weight: 600;
  color: #28a745;
}

.mobile-cart .member-level {
  font-size: 14px;
  color: #6c757d;
}

.mobile-cart .payment-section {
  background: white;
  padding: 15px;
  margin: 15px 0;
}

.mobile-cart .section-title {
  font-weight: 600;
  margin-bottom: 15px;
  color: #495057;
  font-size: 16px;
}

.mobile-cart .payment-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-cart .payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-cart .payment-radio {
  width: 20px;
  height: 20px;
  accent-color: #28a745;
  cursor: pointer;
  margin: 0;
  vertical-align: middle;
  appearance: auto;
  -webkit-appearance: radio;
  -moz-appearance: radio;
}

.mobile-cart .payment-label {
  font-size: 16px;
  cursor: pointer;
  color: #333;
}

.mobile-cart .summary-section {
  background: white;
  padding: 15px;
  margin: 15px 0;
}

.mobile-cart .summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mobile-cart .summary-label {
  font-size: 16px;
  color: #6c757d;
}

.mobile-cart .summary-value {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.mobile-cart .final-summary {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.mobile-cart .actual-payment {
  color: #fd7e14;
  font-size: 18px;
  font-weight: 700;
}

.mobile-cart .pay-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 15px;
  border-top: 1px solid #e9ecef;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.mobile-cart .pay-button {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.mobile-cart .pay-button:hover {
  background: #218838;
}

/* 动画效果 */
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

/* 响应式设计 - 参考Dashboard的媒体查询 */
@media (max-width: 992px) {
  .web-cart .cart-content {
    grid-template-columns: 1fr;
  }
  
  .web-cart .payment-module {
    position: static;
  }
}

@media (max-width: 768px) {
  .web-cart .cart-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .web-cart .header-actions {
    display: flex;
    gap: 10px;
  }
  
  .web-cart .table-header,
  .web-cart .product-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .web-cart .header-cell {
    display: none;
  }
  
  .web-cart .product-info {
    justify-content: center;
  }
  
  .web-cart .price-cell,
  .web-cart .quantity-cell,
  .web-cart .subtotal-cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .mobile-cart .product-item {
    padding: 12px;
    gap: 12px;
  }
  
  .mobile-cart .product-image {
    width: 70px;
    height: 70px;
  }
  
  .mobile-cart .product-name {
    font-size: 13px;
  }
  
  .mobile-cart .current-price {
    font-size: 16px;
  }
  
  .mobile-cart .qty-btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .mobile-cart .qty-display {
    font-size: 14px;
  }
  
  .mobile-cart .header-actions .btn {
    font-size: 13px;
    padding: 8px;
  }
}

@media (max-width: 576px) {
  .web-cart {
    padding: 15px;
  }
  
  .mobile-cart .product-item {
    padding: 10px;
    gap: 10px;
  }
  
  .mobile-cart .product-image {
    width: 60px;
    height: 60px;
  }
  
  .mobile-cart .product-name {
    font-size: 12px;
  }
  
  .mobile-cart .current-price {
    font-size: 14px;
  }
  
  .mobile-cart .qty-btn {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
  
  .mobile-cart .qty-display {
    font-size: 12px;
  }
}

@media (max-width: 375px) {
  .web-cart {
    padding: 10px;
  }
  
  .mobile-cart .product-item {
    padding: 8px;
    gap: 8px;
  }
  
  .mobile-cart .product-image {
    width: 50px;
    height: 50px;
  }
  
  .mobile-cart .product-name {
    font-size: 11px;
  }
  
  .mobile-cart .current-price {
    font-size: 13px;
  }
  
  .mobile-cart .qty-btn {
    width: 22px;
    height: 22px;
    font-size: 9px;
  }
  
  .mobile-cart .qty-display {
    font-size: 11px;
  }
}
</style> 