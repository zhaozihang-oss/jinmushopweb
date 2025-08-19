<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'show': showSidebar, 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="brand-logo">
          <i class="fas fa-crown brand-icon"></i>
          <span v-if="!sidebarCollapsed" class="brand-text">Jinmu Admin</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <router-link 
            v-for="item in menuItems" 
            :key="item.name"
            :to="item.path" 
            class="nav-item"
            :class="{ 'active': $route.path === item.path }"
            @click="closeSidebar"
          >
            <div class="nav-icon">
              <i :class="item.icon"></i>
            </div>
            <span v-if="!sidebarCollapsed" class="nav-text">{{ item.label }}</span>
            <div v-if="$route.path === item.path" class="nav-indicator"></div>
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
            
            <!-- <div class="page-title">
              <h5>{{ getCurrentPageTitle() }}</h5>
            </div> -->
          </div>
          
          <div class="navbar-right">
            <!-- 搜索框 -->
            <!-- <div class="search-box d-none d-md-flex">
              <i class="fas fa-search search-icon"></i>
              <input 
                type="text" 
                class="search-input" 
                placeholder="Search..."
              >
            </div> -->
            
            <!-- 通知 -->
            <!-- <div class="nav-item dropdown">
              <button class="nav-btn" data-bs-toggle="dropdown">
                <i class="fas fa-bell"></i>
                <span class="badge">3</span>
              </button>
              <div class="dropdown-menu dropdown-menu-end">
                <div class="dropdown-header">Notifications</div>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-user-plus text-success me-2"></i>
                  New user registration
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-shopping-cart text-primary me-2"></i>
                  New order
                </a>
              </div>
            </div> -->
            <h7>尊贵的五星会员张三，欢迎回来</h7>
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
      name: 'Admin',
      email: 'admin@example.com',
      role: 'Administrator'
    })
    
    // 获取用户首字母
    const getUserInitial = () => {
      return currentUser.value.name ? currentUser.value.name.charAt(0).toUpperCase() : 'A'
    }
    
    // 菜单项
    const menuItems = ref([
      { name: 'dashboard', path: '/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
      { name: 'users', path: '/users', icon: 'fas fa-users', label: 'User Management' },
      { name: 'products', path: '/products', icon: 'fas fa-box', label: 'Product Management' },
      { name: 'orders', path: '/orders', icon: 'fas fa-shopping-cart', label: 'Order Management' },
      { name: 'settings', path: '/settings', icon: 'fas fa-cog', label: 'System Settings' },
      { name: 'mobile-debug', path: '/mobile-debug', icon: 'fas fa-mobile-alt', label: 'Mobile Debug' }
    ])
    
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
      const startX = touch.clientX
      const startY = touch.clientY
      
      // 只有在屏幕边缘滑动时才处理
      if (startX < 20 && window.innerWidth <= 768) {
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

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-logo {
  display: flex;
  align-items: center;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.brand-icon {
  font-size: 1.5rem;
  color: #ffffff;
  margin-right: 10px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.brand-text {
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .brand-text {
  opacity: 0;
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
}

.nav-item.active {
  background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  font-weight: 500;
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

.sidebar.collapsed .nav-text {
  opacity: 0;
}

.nav-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 30px;
  background: #4CAF50;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
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

.page-title h4 {
  margin: 0;
  color: #495057;
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 搜索框 */
.search-box {
  position: relative;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 15px;
  color: #6c757d;
  font-size: 0.9rem;
}

.search-input {
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 8px 15px 8px 40px;
  width: 250px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
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

.nav-btn .badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #dc3545;
  color: white;
  font-size: 0.6rem;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

/* 语言选择按钮 */
.language-btn {
  display: flex;
  align-items: center;
  min-width: 100px;
  justify-content: center;
}

.language-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.language-btn .fa-chevron-down {
  font-size: 0.7rem;
  opacity: 0.7;
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

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  
  .search-box {
    display: none !important;
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
  
  .page-title h4 {
    font-size: 1.2rem;
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
  
  .page-title h4 {
    font-size: 1.1rem;
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

@media (max-width: 375px) {
  .navbar-container {
    padding: 0 12px;
    height: 54px;
  }
  
  .page-content {
    padding: 12px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .page-title h4 {
    font-size: 1rem;
  }
  
  .nav-item {
    min-height: 52px;
    padding: 20px 20px;
    font-size: 1.1rem;
  }
  
  .nav-icon {
    font-size: 1.4rem;
    margin-right: 22px;
  }
  
  .menu-toggle {
    min-height: 50px;
    min-width: 50px;
    font-size: 1.4rem;
  }
  
  .nav-btn {
    min-height: 50px;
    min-width: 50px;
  }
}
</style> 