<template>
  <div class="register-plan-container">
    <div class="page-header">
      <h1 class="page-title">Choose from a variety of packages</h1>
      <p class="page-description">*Packages can only be purchased once</p>
      <button class="order-list-btn" @click="handleOrderList">Order list</button>
    </div>
    
    <div class="packages-container">
      <div 
        v-for="(plan, index) in plans" 
        :key="index"
        class="package-card"
        :class="{ 'disabled': !plan.status }"
      >
        <div class="package-header">
          <div class="stars">
            <i 
              v-for="star in 5" 
              :key="star"
              class="star"
              :class="{ 'active': star <= plan.stars }"
            >★</i>
          </div>
          <h3 class="package-title">Register {{ plan.stars }} star</h3>
        </div>
        
        <div class="price-section">
          <span class="currency">$</span>
          <span class="price">{{ plan.price.toFixed(2) }}</span>
        </div>
        
        <button 
          class="register-btn"
          :class="plan.colorClass"
          :disabled="!plan.status"
          @click="handleRegister(plan)"
        >
          Register
        </button>
        
        <div class="package-details">
          <div class="detail-item">
            <span class="label">Pairing rate:</span>
            <span class="value">{{ plan.pairingRate }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">Direct rate:</span>
            <span class="value">{{ plan.directRate }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">Max Pairing bonus:</span>
            <span class="value">${{ plan.maxPairingBonus }}</span>
          </div>
          <div class="detail-item">
            <span class="label">InDirect rate:</span>
            <span class="value">{{ plan.indirectRate }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">ThankYou Share:</span>
            <span class="value">{{ plan.thankYouShare }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterPlan',
  setup() {
    const router = useRouter()
    
    const plans = ref([
      {
        stars: 1,
        price: 100.00,
        pairingRate: 8,
        directRate: 8,
        maxPairingBonus: 300,
        indirectRate: 3,
        thankYouShare: 0,
        colorClass: 'orange',
        status: true
      },
      {
        stars: 2,
        price: 200.00,
        pairingRate: 9,
        directRate: 10,
        maxPairingBonus: 600,
        indirectRate: 4,
        thankYouShare: 0,
        colorClass: 'blue',
        status: true
      },
      {
        stars: 3,
        price: 400.00,
        pairingRate: 10,
        directRate: 12,
        maxPairingBonus: 1200,
        indirectRate: 5,
        thankYouShare: 1,
        colorClass: 'green',
        status: true
      },
      {
        stars: 4,
        price: 800.00,
        pairingRate: 11,
        directRate: 14,
        maxPairingBonus: 2400,
        indirectRate: 6,
        thankYouShare: 2,
        colorClass: 'brown',
        status: false // 设置为不可点击状态
      },
      {
        stars: 5,
        price: 1200.00,
        pairingRate: 12,
        directRate: 16,
        maxPairingBonus: 3600,
        indirectRate: 7,
        thankYouShare: 3,
        colorClass: 'dark',
        status: true
      }
    ])

    const handleRegister = (plan) => {
      if (!plan.status) return
      console.log('Registering plan:', plan)
      // 跳转到products页面，并传递选中的套餐信息
      router.push({
        name: 'Products',
        query: {
          planId: plan.stars,
          price: plan.price
        }
      })
    }

    const handleOrderList = () => {
      // 跳转到products页面的orderList
      router.push({
        name: 'Products',
        query: {
          tab: 'orderList'
        }
      })
    }

    return {
      plans,
      handleRegister,
      handleOrderList
    }
  }
}
</script>

<style scoped>
.register-plan-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.page-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.order-list-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #2d5a3d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.order-list-btn:hover {
  background: #1e3d2a;
}

.packages-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.package-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, opacity 0.3s;
}

.package-card:hover:not(.disabled) {
  transform: translateY(-5px);
}

.package-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.package-header {
  text-align: center;
  margin-bottom: 15px;
}

.stars {
  margin-bottom: 10px;
}

.star {
  font-size: 1.2rem;
  color: #ddd;
  margin: 0 2px;
}

.star.active {
  color: #ffd700;
}

.package-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.price-section {
  text-align: center;
  margin: 20px 0;
}

.currency {
  font-size: 1.2rem;
  color: #666;
  margin-right: 5px;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
}

.register-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  transition: opacity 0.3s;
}

.register-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register-btn.orange {
  background: #ff8c42;
}

.register-btn.orange:hover:not(:disabled) {
  background: #e67a3a;
}

.register-btn.blue {
  background: #4a90e2;
}

.register-btn.blue:hover:not(:disabled) {
  background: #3a7bc8;
}

.register-btn.green {
  background: #5cb85c;
}

.register-btn.green:hover:not(:disabled) {
  background: #449d44;
}

.register-btn.brown {
  background: #a0845c;
}

.register-btn.brown:hover:not(:disabled) {
  background: #8a7250;
}

.register-btn.dark {
  background: #333;
}

.register-btn.dark:hover:not(:disabled) {
  background: #222;
}

.package-details {
  font-size: 0.9rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 4px 0;
}

.label {
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

/* Mobile (H5) 竖排布局 */
@media (max-width: 768px) {
  .register-plan-container {
    padding: 15px;
  }
  
  .packages-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .page-header {
    padding: 15px;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .order-list-btn {
    position: static;
    margin-top: 15px;
    width: 100px;
  }
  
  .package-card {
    padding: 15px;
  }
  
  .price {
    font-size: 2rem;
  }
}

/* 更小屏幕优化 */
@media (max-width: 480px) {
  .register-plan-container {
    padding: 10px;
  }
  
  .page-title {
    font-size: 1.2rem;
  }
  
  .price {
    font-size: 1.8rem;
  }
  
  .package-card {
    padding: 12px;
  }
}
</style> 