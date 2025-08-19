<template>
  <div class="dashboard">
    <!-- 页面标题 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Dashboard</h2>
      <div class="text-muted">
        {{ currentTime }}
      </div>
    </div>
    
    <!-- 主要数据卡片区域 -->
    <div class="row mb-4">
      <!-- Total Left PV -->
      <div class="col-lg-3 col-md-6 mb-4">
        <DataCard
          title="Total Left PV"
          :mainValue="pvData.totalLeftPV.main"
          icon="fas fa-database"
          iconBgColor="#6f42c1"
          :subStats="pvData.totalLeftPV.subStats"
        />
      </div>
      
      <!-- Total Right PV -->
      <div class="col-lg-3 col-md-6 mb-4">
        <DataCard
          title="Total Right PV"
          :mainValue="pvData.totalRightPV.main"
          icon="fas fa-chart-line"
          iconBgColor="#fd7e14"
          :subStats="pvData.totalRightPV.subStats"
        />
      </div>
      
      <!-- Direct Sponsor PV -->
      <div class="col-lg-3 col-md-6 mb-4">
        <DataCard
          title="Direct Sponsor PV"
          :mainValue="pvData.directSponsorPV.main"
          icon="fas fa-users"
          iconBgColor="#20c997"
          :subStats="pvData.directSponsorPV.subStats"
        />
      </div>
      
      <!-- InDirect Sponsor PV -->
      <div class="col-lg-3 col-md-6 mb-4">
        <DataCard
          title="InDirect Sponsor PV"
          :mainValue="pvData.indirectSponsorPV.main"
          icon="fas fa-sitemap"
          iconBgColor="#e83e8c"
          :subStats="pvData.indirectSponsorPV.subStats"
        />
      </div>
    </div>
    
    <!-- 奖金数据卡片区域 -->
    <div class="row mb-4">
      <!-- Direct Bonus -->
      <div class="col-lg-3 col-md-6 mb-4">
        <BonusCard
          title="Direct Bonus"
          :amount="bonusData.directBonus"
          icon="fas fa-money-bill-wave"
          iconBgColor="#6c757d"
        />
      </div>
      
      <!-- InDirect Bonus -->
      <div class="col-lg-3 col-md-6 mb-4">
        <BonusCard
          title="InDirect Bonus"
          :amount="bonusData.indirectBonus"
          icon="fas fa-coins"
          iconBgColor="#6c757d"
        />
      </div>
      
      <!-- Paring Bonus -->
      <div class="col-lg-3 col-md-6 mb-4">
        <BonusCard
          title="Paring Bonus"
          :amount="bonusData.paringBonus"
          icon="fas fa-balance-scale"
          iconBgColor="#6c757d"
        />
      </div>
      
      <!-- Thank you Bonus -->
      <div class="col-lg-3 col-md-6 mb-4">
        <BonusCard
          title="Thank you Bonus"
          :amount="bonusData.thankYouBonus"
          icon="fas fa-gift"
          iconBgColor="#6c757d"
        />
      </div>
    </div>
    
    <!-- 社交媒体链接 -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="social-links-card">
          <h5 class="mb-3">Connect with us</h5>
          <div class="social-buttons">
            <a href="#" class="social-btn twitter">
              <i class="fab fa-twitter"></i>
              <span>Twitter</span>
            </a>
            <a href="#" class="social-btn wechat">
              <i class="fab fa-weixin"></i>
              <span>WeChat</span>
            </a>
            <a href="#" class="social-btn facebook">
              <i class="fab fa-facebook"></i>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import DataCard from '@/components/DataCard.vue'
import BonusCard from '@/components/BonusCard.vue'

export default {
  name: 'Dashboard',
  components: {
    DataCard,
    BonusCard
  },
  setup() {
    const currentTime = ref('')
    const timer = ref(null)
    
    // PV数据
    const pvData = reactive({
      totalLeftPV: {
        main: '40,689',
        subStats: [
          { label: 'Newly Added', value: '1,221', color: '#28a745' },
          { label: 'Total', value: '50,000', color: '#28a745' }
        ]
      },
      totalRightPV: {
        main: '999',
        subStats: [
          { label: 'Newly Added', value: '29', color: '#28a745' },
          { label: 'Total', value: '50,000', color: '#28a745' }
        ]
      },
      directSponsorPV: {
        main: '310',
        subStats: [
          { label: 'Newly Added', value: '121', color: '#28a745' },
          { label: 'New Users', value: '100', color: '#28a745' },
          { label: 'Total Users', value: '10,000', color: '#6c757d' }
        ]
      },
      indirectSponsorPV: {
        main: '9,000',
        subStats: [
          { label: 'Newly Added', value: '31', color: '#28a745' },
          { label: 'New Users', value: '12', color: '#28a745' },
          { label: 'Total Users', value: '319', color: '#6c757d' }
        ]
      }
    })
    
    // 奖金数据
    const bonusData = reactive({
      directBonus: 40689,
      indirectBonus: 193,
      paringBonus: 89000,
      thankYouBonus: 2040
    })
    
    // 更新当前时间
    const updateCurrentTime = () => {
      currentTime.value = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date())
    }
    
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
    const formatTime = (time) => {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(time)
    }
    

    
    onMounted(() => {
      updateCurrentTime()
      timer.value = setInterval(updateCurrentTime, 1000)
    })
    
    onBeforeUnmount(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })
    
    return {
      currentTime,
      pvData,
      bonusData,
      formatCurrency,
      formatDate,
      formatTime
    }
  }
}
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease-in-out;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
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

/* 社交媒体链接卡片 */
.social-links-card {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  text-align: center;
}

.social-links-card h5 {
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #fff;
  min-width: 120px;
  justify-content: center;
}

.social-btn i {
  margin-right: 8px;
  font-size: 18px;
}

.social-btn.twitter {
  background: #1da1f2;
}

.social-btn.twitter:hover {
  background: #0d8bd9;
  transform: translateY(-2px);
  color: #fff;
}

.social-btn.wechat {
  background: #07c160;
}

.social-btn.wechat:hover {
  background: #06ad56;
  transform: translateY(-2px);
  color: #fff;
}

.social-btn.facebook {
  background: #4267b2;
}

.social-btn.facebook:hover {
  background: #365899;
  transform: translateY(-2px);
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .row {
    margin-left: 0;
    margin-right: 0;
  }
  
  .col-lg-3, .col-md-6 {
    padding-left: 10px;
    padding-right: 10px;
  }
  
  .social-buttons {
    gap: 15px;
  }
  
  .social-btn {
    min-width: 100px;
    padding: 10px 16px;
  }
}

@media (max-width: 576px) {
  .col-lg-3, .col-md-6 {
    padding-left: 5px;
    padding-right: 5px;
  }
  
  .mb-4 {
    margin-bottom: 1rem !important;
  }
  
  .social-buttons {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .social-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .social-links-card {
    padding: 20px;
  }
}

@media (max-width: 375px) {
  .col-lg-3, .col-md-6 {
    padding-left: 3px;
    padding-right: 3px;
  }
  
  .social-links-card {
    padding: 15px;
  }
  
  .social-btn {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .social-btn i {
    font-size: 16px;
    margin-right: 6px;
  }
}
</style> 