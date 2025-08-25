<template>
  <div class="my-referrals-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>My Referrals</h1>
        <p>Manage and track your direct referrals</p>
      </div>
      <div class="header-actions">
        <router-link to="/referrals/my-subrefer" class="switch-view-btn">
          <i class="fas fa-sitemap"></i>
          View Subreferrals
        </router-link>
      </div>
    </div>
    
    <div class="my-referrals">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalReferrals }}</h3>
          <p>Total Referrals</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-user-check"></i>
        </div>
        <div class="stat-content">
          <h3>{{ activeReferrals }}</h3>
          <p>Active Referrals</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="stat-content">
          <h3>${{ totalEarnings.toFixed(2) }}</h3>
          <p>Total Earnings</p>
        </div>
      </div>
    </div>

    <!-- 推荐链接 -->
    <div class="referral-link-section">
      <h3>Your Referral Link</h3>
      <div class="referral-link-box">
        <input 
          type="text" 
          :value="referralLink" 
          readonly 
          class="referral-input"
        >
        <button @click="copyReferralLink" class="copy-btn">
          <i class="fas fa-copy"></i>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <!-- 推荐列表 -->
    <div class="referrals-list-section">
      <div class="section-header">
        <h3>My Referrals</h3>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search referrals..."
          >
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Loading referrals...
      </div>

      <div v-else-if="filteredReferrals.length === 0" class="no-data">
        <i class="fas fa-users-slash"></i>
        <p>No referrals found</p>
      </div>

      <div v-else class="referrals-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Earnings</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="referral in filteredReferrals" :key="referral.id">
              <td>{{ referral.name }}</td>
              <td>{{ referral.email }}</td>
              <td>{{ formatDate(referral.joinDate) }}</td>
              <td>
                <span :class="['status', referral.status.toLowerCase()]">
                  {{ referral.status }}
                </span>
              </td>
              <td>${{ referral.earnings.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'MyReferrals',
  setup() {
    const loading = ref(true)
    const copied = ref(false)
    const searchQuery = ref('')
    const referrals = ref([])
    
    // 模拟数据
    const mockReferrals = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        joinDate: '2024-01-15',
        status: 'Active',
        earnings: 125.50
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        joinDate: '2024-01-20',
        status: 'Active',
        earnings: 89.25
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        joinDate: '2024-02-01',
        status: 'Inactive',
        earnings: 45.00
      }
    ]

    const referralLink = ref('https://yoursite.com/register?ref=USER123')

    const totalReferrals = computed(() => referrals.value.length)
    const activeReferrals = computed(() => 
      referrals.value.filter(r => r.status === 'Active').length
    )
    const totalEarnings = computed(() => 
      referrals.value.reduce((sum, r) => sum + r.earnings, 0)
    )

    const filteredReferrals = computed(() => {
      if (!searchQuery.value) return referrals.value
      
      const query = searchQuery.value.toLowerCase()
      return referrals.value.filter(referral => 
        referral.name.toLowerCase().includes(query) ||
        referral.email.toLowerCase().includes(query)
      )
    })

    const copyReferralLink = async () => {
      try {
        await navigator.clipboard.writeText(referralLink.value)
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const loadReferrals = async () => {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        referrals.value = mockReferrals
        loading.value = false
      }, 1000)
    }

    onMounted(() => {
      loadReferrals()
    })

    return {
      loading,
      copied,
      searchQuery,
      referrals,
      referralLink,
      totalReferrals,
      activeReferrals,
      totalEarnings,
      filteredReferrals,
      copyReferralLink,
      formatDate
    }
  }
}
</script>

<style scoped>
.my-referrals-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 页面标题样式 */
.page-header {
  background: white;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 28px;
  font-weight: bold;
}

.header-content p {
  margin: 0;
  color: #6c757d;
  font-size: 16px;
}

.switch-view-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.switch-view-btn:hover {
  background: #218838;
  color: white;
}

.my-referrals {
  padding: 0 30px 30px 30px;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #28a745;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-content p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

/* 推荐链接部分 */
.referral-link-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.referral-link-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
}

.referral-link-box {
  display: flex;
  gap: 10px;
}

.referral-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  background: #f8f9fa;
}

.copy-btn {
  padding: 12px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-btn:hover {
  background: #218838;
}

/* 推荐列表部分 */
.referrals-list-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h3 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
}

.search-box input:focus {
  outline: none;
  border-color: #28a745;
}

.loading, .no-data {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.loading i {
  font-size: 24px;
  margin-bottom: 10px;
}

.no-data i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #dee2e6;
}

/* 表格样式 */
.referrals-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
    padding: 20px;
  }
  
  .my-referrals {
    padding: 0 20px 20px 20px;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .referral-link-box {
    flex-direction: column;
  }
  
  .referrals-table {
    font-size: 14px;
  }
  
  th, td {
    padding: 10px 8px;
  }
}
</style>
