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
    
    <!-- 悬浮社交媒体按钮 -->
    <FloatingSocialButtons @social-click="handleSocialClick" />
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import DataCard from '@/components/DataCard.vue'
import BonusCard from '@/components/BonusCard.vue'
import FloatingSocialButtons from '@/components/FloatingSocialButtons.vue'

export default {
  name: 'Dashboard',
  components: {
    DataCard,
    BonusCard,
    FloatingSocialButtons
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
    
    // 处理社交媒体点击
    const handleSocialClick = (social) => {
      console.log(`Clicked on ${social.name}:`, social)
      // 这里可以添加具体的处理逻辑，比如打开分享弹窗等
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
      formatTime,
      handleSocialClick
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
}

@media (max-width: 576px) {
  .col-lg-3, .col-md-6 {
    padding-left: 5px;
    padding-right: 5px;
  }
  
  .mb-4 {
    margin-bottom: 1rem !important;
  }
}

@media (max-width: 375px) {
  .col-lg-3, .col-md-6 {
    padding-left: 3px;
    padding-right: 3px;
  }
}
</style> 