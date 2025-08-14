<template>
  <div class="dashboard">
    <!-- 页面标题 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Dashboard</h2>
      <div class="text-muted">
        {{ currentTime }}
      </div>
    </div>
    
    <!-- 统计卡片 -->
    <div class="row mb-4">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="stats-card">
          <div class="d-flex align-items-center">
            <div class="stats-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="ms-3">
              <div class="stats-number">{{ stats.totalUsers }}</div>
              <div class="stats-label">Total Users</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="stats-card">
          <div class="d-flex align-items-center">
            <div class="stats-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="ms-3">
              <div class="stats-number">{{ stats.totalProducts }}</div>
              <div class="stats-label">Total Products</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="stats-card">
          <div class="d-flex align-items-center">
            <div class="stats-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="ms-3">
              <div class="stats-number">{{ stats.totalOrders }}</div>
              <div class="stats-label">Total Orders</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="stats-card">
          <div class="d-flex align-items-center">
            <div class="stats-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="ms-3">
              <div class="stats-number">{{ formatCurrency(stats.totalRevenue) }}</div>
              <div class="stats-label">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图表和数据 -->
    <div class="row">
      <!-- 销售数据柱状图 -->
      <div class="col-lg-8 col-md-12 mb-4">
        <ChartContainer title="月度销售统计" :showActions="true" @refresh="refreshSalesData">
          <BarChart
            :data="salesData"
            :xAxisData="salesMonths"
            :color="['#667eea', '#764ba2']"
          />
        </ChartContainer>
      </div>
      
      <!-- 用户增长折线图 -->
      <div class="col-lg-4 col-md-12 mb-4">
        <ChartContainer title="用户增长趋势" :showActions="true" @refresh="refreshUserData">
          <LineChart
            :data="userGrowthData"
            :xAxisData="userGrowthMonths"
            :color="['#4ecdc4', '#44a08d']"
            :smooth="true"
            :showArea="true"
          />
        </ChartContainer>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import ChartContainer from '@/components/Charts/ChartContainer.vue'
import BarChart from '@/components/Charts/BarChart.vue'
import LineChart from '@/components/Charts/LineChart.vue'

export default {
  name: 'Dashboard',
  components: {
    ChartContainer,
    BarChart,
    LineChart
  },
  setup() {
    const currentTime = ref('')
    const timer = ref(null)
    
    // 统计数据
    const stats = reactive({
      totalUsers: 1234,
      totalProducts: 567,
      totalOrders: 890,
      totalRevenue: 123456.78
    })
    
    // 销售数据
    const salesData = ref([320, 450, 380, 520, 670, 590, 720, 850, 930, 680, 750, 820])
    const salesMonths = ref(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'])
    
    // 用户增长数据
    const userGrowthData = ref([120, 180, 220, 280, 350, 420, 520, 650, 780, 920, 1080, 1234])
    const userGrowthMonths = ref(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'])
    
    // 刷新销售数据
    const refreshSalesData = () => {
      // 模拟数据刷新
      salesData.value = salesData.value.map(item => 
        Math.max(100, item + Math.floor(Math.random() * 100 - 50))
      )
    }
    
    // 刷新用户增长数据
    const refreshUserData = () => {
      // 模拟数据刷新
      userGrowthData.value = userGrowthData.value.map((item, index) => {
        const baseGrowth = index * 80 + 100
        const randomVariation = Math.floor(Math.random() * 100 - 50)
        return Math.max(baseGrowth, baseGrowth + randomVariation)
      })
    }
    
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
      stats,
      salesData,
      salesMonths,
      userGrowthData,
      userGrowthMonths,
      formatCurrency,
      formatDate,
      formatTime,
      refreshSalesData,
      refreshUserData
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

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.stats-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stats-number {
  font-size: 2rem;
  font-weight: 700;
  margin: 10px 0 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats-label {
  font-size: 0.9rem;
  opacity: 0.9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .stats-card {
    text-align: center;
    margin-bottom: 15px;
  }
  
  .row {
    margin-left: 0;
    margin-right: 0;
  }
  
  .col-lg-8, .col-lg-4 {
    padding-left: 10px;
    padding-right: 10px;
  }
  
  /* 移动端图表高度调整 */
  .chart-container {
    height: 350px;
  }
}

@media (max-width: 576px) {
  .stats-card {
    margin-bottom: 10px;
  }
  
  .col-lg-8, .col-lg-4 {
    padding-left: 5px;
    padding-right: 5px;
  }
  
  .mb-4 {
    margin-bottom: 1rem !important;
  }
  
  /* 小屏幕图表高度调整 */
  .chart-container {
    height: 300px;
  }
}

@media (max-width: 375px) {
  .col-lg-8, .col-lg-4 {
    padding-left: 3px;
    padding-right: 3px;
  }
  
  .chart-container {
    height: 280px;
  }
}
</style> 