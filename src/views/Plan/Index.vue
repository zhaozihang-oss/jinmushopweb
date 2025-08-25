<template>
  <div class="plan-container">
    <div class="page-header">
      <h1 class="page-title">Plan</h1>
      <p class="page-description">计划管理页面</p>
    </div>
    
    <div class="page-content">
      <!-- 页面内容待添加 -->
      <div class="empty-content">
        <i class="fas fa-gem fa-3x text-muted mb-3"></i>
        <h3 class="text-muted">Plan Management</h3>
        <p class="text-muted">页面内容开发中...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Plan',
  setup() {
    return {
      // 组件逻辑
    }
  }
}
</script>

<style scoped>
.plan-container {
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-description {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
}

.page-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-content {
  text-align: center;
  padding: 60px 20px;
}

.empty-content i {
  color: #dee2e6;
}

.empty-content h3 {
  margin-bottom: 15px;
}
</style> 