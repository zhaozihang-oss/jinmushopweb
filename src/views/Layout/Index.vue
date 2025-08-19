<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'show': showSidebar, 'collapsed': sidebarCollapsed }">
      <!-- 用户信息区域 -->
      <div class="user-profile-section">
        <div class="user-avatar-container">
          <!-- 头像占位，后续插入图片 -->
          <div class="user-avatar-placeholder">
            <i class="fas fa-user"></i>
          </div>
        </div>
        <div v-if="!sidebarCollapsed" class="user-info">
          <div class="user-id">{{ currentUser.memberId }}</div>
          <div class="user-rating">
            <i v-for="n in 5" :key="n" class="fas fa-star"></i>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <router-link 
            v-for="item in menuItems" 
            :key="item.name"
            :to="item.path" 
            class="nav-item"
            :class="{ 
              'active': $route.path === item.path,
              'has-submenu': item.hasSubmenu 
            }"
            @click="handleNavClick(item)"
          >
            <div class="nav-icon">
              <i :class="item.icon"></i>
            </div>
            <span v-if="!sidebarCollapsed" class="nav-text">{{ item.label }}</span>
            <div v-if="item.hasSubmenu && !sidebarCollapsed" class="submenu-arrow">
              <i class="fas fa-chevron-down" :class="{ 'rotated': item.expanded }"></i>
            </div>
          </router-link>
        </div>
      </nav>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- 顶部导航 -->
      <header class="top-navbar">
        <div class="navbar-container">
          <div class="navbar-left">
            <button 
              class="menu-toggle"
              @click="toggleSidebar"
            >
              <i class="fas fa-bars"></i>
            </button>
          </div>
          
          <div class="navbar-right">
            <h7>尊贵的五星会员{{ currentUser.name }}，欢迎回来</h7>
            <!-- 用户菜单 -->
            <div class="nav-item dropdown">
              <button class="nav-btn user-btn" data-bs-toggle="dropdown">
                <div class="user-avatar">
                  <span class="user-initial">{{ getUserInitial() }}</span>
                </div>
                <span class="user-name d-none d-md-inline">{{ currentUser.name }}</span>
              </button>
              <div class="dropdown-menu dropdown-menu-end">
                <div class="dropdown-header">{{ currentUser.name }}</div>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-user me-2"></i>
                  Profile
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-cog me-2"></i>
                  Settings
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" @click="logout">
                  <i class="fas fa-sign-out-alt me-2"></i>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- 页面内容 -->
      <main class="page-content">
        <div class="content-container">
          <router-view />
        </div>
      </main>
    </div>
    
    <!-- 移动端遮罩 -->
    <div 
      v-if="showSidebar" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'Layout',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const showSidebar = ref(false)
    const sidebarCollapsed = ref(false)
    
    // 当前用户信息
    const currentUser = ref({
      name: '张三',
      memberId: 'ABC4567890',
      email: 'zhangsan@example.com',
      role: 'VIP Member'
    })
    
    // 获取用户首字母
    const getUserInitial = () => {
      return currentUser.value.name ? currentUser.value.name.charAt(0).toUpperCase() : 'A'
    }
    
    // 菜单项
    const menuItems = ref([
      { 
        name: 'dashboard', 
        path: '/dashboard', 
        icon: 'fas fa-chart-bar', 
        label: 'Dashboard',
        hasSubmenu: false
      },
      { 
        name: 'plan', 
        path: '/plan', 
        icon: 'fas fa-gem', 
        label: 'Plan',
        hasSubmenu: true,
        expanded: false
      },
      { 
        name: 'products', 
        path: '/products', 
        icon: 'fas fa-shopping-bag', 
        label: 'Products',
        hasSubmenu: false
      },
      { 
        name: 'pv-bv-log', 
        path: '/pv-bv-log', 
        icon: 'fas fa-file-alt', 
        label: 'PV&BV log',
        hasSubmenu: false
      },
      { 
        name: 'bonus', 
        path: '/bonus', 
        icon: 'fas fa-coins', 
        label: 'Bonus',
        hasSubmenu: true,
        expanded: false
      },
      { 
        name: 'referrals', 
        path: '/referrals', 
        icon: 'fas fa-users', 
        label: 'Referrals',
        hasSubmenu: true,
        expanded: false
      },
      { 
        name: 'network', 
        path: '/network', 
        icon: 'fas fa-project-diagram', 
        label: 'Network',
        hasSubmenu: false
      },
      { 
        name: 'deposit-offline', 
        path: '/deposit-offline', 
        icon: 'fas fa-credit-card', 
        label: 'Deposit Offline',
        hasSubmenu: false
      },
      { 
        name: 'withdraw', 
        path: '/withdraw', 
        icon: 'fas fa-arrow-up', 
        label: 'Withdraw',
        hasSubmenu: false
      },
      { 
        name: 'balance-transfer', 
        path: '/balance-transfer', 
        icon: 'fas fa-exchange-alt', 
        label: 'Balance Transfer',
        hasSubmenu: false
      },
      { 
        name: 'transactions', 
        path: '/transactions', 
        icon: 'fas fa-list', 
        label: 'Transactions',
        hasSubmenu: false
      },
      { 
        name: 'support-ticket', 
        path: '/support-ticket', 
        icon: 'fas fa-ticket-alt', 
        label: 'Support Ticket',
        hasSubmenu: false
      },
      { 
        name: 'useful-materials', 
        path: '/useful-materials', 
        icon: 'fas fa-folder-open', 
        label: 'Usefull Materials',
        hasSubmenu: false
      },
      { 
        name: 'profile', 
        path: '/profile', 
        icon: 'fas fa-user', 
        label: 'Profile',
        hasSubmenu: false
      },
      { 
        name: 'change-password', 
        path: '/change-password', 
        icon: 'fas fa-lock', 
        label: 'Change Password',
        hasSubmenu: false
      },
      { 
        name: 'logout', 
        path: '#', 
        icon: 'fas fa-sign-out-alt', 
        label: 'Logout',
        hasSubmenu: false,
        isLogout: true
      }
    ])
    
    // 处理导航点击
    const handleNavClick = (item) => {
      if (item.isLogout) {
        logout()
        return
      }
      
      if (item.hasSubmenu) {
        item.expanded = !item.expanded
        return
      }
      
      closeSidebar()
    }
    
    // 获取当前页面标题
    const getCurrentPageTitle = () => {
      const currentItem = menuItems.value.find(item => item.path === route.path)
      return currentItem ? currentItem.label : 'Dashboard'
    }
    
    // 切换侧边栏
    const toggleSidebar = () => {
      if (window.innerWidth <= 768) {
        showSidebar.value = !showSidebar.value
      } else {
        sidebarCollapsed.value = !sidebarCollapsed.value
      }
    }
    
    // 关闭侧边栏
    const closeSidebar = () => {
      if (window.innerWidth <= 768) {
        showSidebar.value = false
      }
    }
    
    // 响应式处理
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        showSidebar.value = false
        sidebarCollapsed.value = false
      } else {
        showSidebar.value = false
      }
    }
    
    // 触摸事件处理
    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      
      // 只有在屏幕边缘滑动时才处理
      if (touch.clientX < 20 && window.innerWidth <= 768) {
        showSidebar.value = true
      }
    }
    
    // 阻止默认的触摸行为
    const preventDefaultTouch = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }
    
    // 退出登录
    const logout = () => {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        sessionStorage.removeItem('userInfo')
        router.push('/login')
      }
    }
    
    onMounted(() => {
      window.addEventListener('resize', handleResize)
      document.addEventListener('touchstart', handleTouchStart, { passive: false })
      document.addEventListener('touchmove', preventDefaultTouch, { passive: false })
    })
    
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', preventDefaultTouch)
    })
    
    return {
      showSidebar,
      sidebarCollapsed,
      currentUser,
      getUserInitial,
      menuItems,
      getCurrentPageTitle,
      toggleSidebar,
      closeSidebar,
      handleNavClick,
      logout
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fc;
}

/* 侧边栏样式 */
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2d5016 0%, #1a2e0a 100%);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  transition: all 0.3s ease;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.sidebar.collapsed {
  width: 70px;
}

/* 用户信息区域 */
.user-profile-section {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar-container {
  margin-bottom: 15px;
}

.user-avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.user-info {
  color: white;
}

.user-id {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.user-rating {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.user-rating .fa-star {
  color: #FFD700;
  font-size: 1rem;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

/* 导航样式 */
.sidebar-nav {
  padding: 20px 0;
}

.nav-section {
  padding: 0 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin-bottom: 2px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateX(3px);
  text-decoration: none;
}

.nav-item.active {
  background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  font-weight: 500;
  text-decoration: none;
}

.nav-icon {
  width: 20px;
  text-align: center;
  margin-right: 15px;
  font-size: 1.1rem;
}

.nav-text {
  flex: 1;
  transition: opacity 0.3s ease;
}

.submenu-arrow {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.submenu-arrow .rotated {
  transform: rotate(180deg);
}

.sidebar.collapsed .nav-text,
.sidebar.collapsed .submenu-arrow {
  opacity: 0;
}

.sidebar.collapsed .user-info {
  opacity: 0;
}

.sidebar.collapsed .user-avatar-placeholder {
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  width: calc(100% - 250px);
  max-width: calc(100% - 250px);
  overflow-x: hidden;
}

.main-content.sidebar-collapsed {
  margin-left: 70px;
  width: calc(100% - 70px);
  max-width: calc(100% - 70px);
}

/* 顶部导航 */
.top-navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e9ecef;
  z-index: 100;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  height: 70px;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.2rem;
  margin-right: 20px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  background: #f8f9fa;
  color: #495057;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-right h7 {
  color: #495057;
  font-weight: 500;
  font-size: 0.95rem;
}

/* 导航按钮 */
.nav-btn {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.1rem;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

/* 用户按钮 */
.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  overflow: hidden;
  font-weight: 600;
}

.user-initial {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
}

/* 下拉菜单 */
.dropdown-menu {
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 0;
  min-width: 200px;
}

.dropdown-header {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
  padding: 8px 20px;
  margin-bottom: 5px;
}

.dropdown-item {
  padding: 10px 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #495057;
}

/* 页面内容 */
.page-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
}

/* 遮罩层 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    left: -250px;
    transition: left 0.3s ease;
    z-index: 1050;
  }
  
  .sidebar.show {
    left: 0;
  }
  
  .main-content {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
  }
  
  .navbar-container {
    padding: 0 20px;
    height: 60px;
  }
  
  .page-content {
    padding: 20px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .menu-toggle {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }
  
  .nav-btn {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }
  
  .nav-item {
    min-height: 48px;
    padding: 16px 20px;
    font-size: 1rem;
    touch-action: manipulation;
  }
  
  .nav-icon {
    font-size: 1.2rem;
    margin-right: 18px;
  }
  
  .navbar-right h7 {
    display: none;
  }
}

@media (max-width: 576px) {
  .navbar-container {
    padding: 0 15px;
    height: 56px;
  }
  
  .page-content {
    padding: 15px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .nav-item {
    min-height: 50px;
    padding: 18px 20px;
    font-size: 1.1rem;
  }
  
  .nav-icon {
    font-size: 1.3rem;
    margin-right: 20px;
  }
  
  .menu-toggle {
    min-height: 48px;
    min-width: 48px;
    font-size: 1.3rem;
  }
  
  .nav-btn {
    min-height: 48px;
    min-width: 48px;
  }
}
</style> 