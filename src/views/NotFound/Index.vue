<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-illustration">
        <div class="error-number">404</div>
        <div class="error-icon">
          <i class="fas fa-search"></i>
        </div>
      </div>
      
      <div class="error-text">
        <h1 class="error-title">页面未找到</h1>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移动。<br>
          请检查网址是否正确，或返回首页继续浏览。
        </p>
      </div>
      
      <div class="error-actions">
        <button 
          class="btn btn-primary btn-lg"
          @click="goHome"
        >
          <i class="fas fa-home me-2"></i>
          返回首页
        </button>
        <button 
          class="btn btn-outline-secondary btn-lg ms-3"
          @click="goBack"
        >
          <i class="fas fa-arrow-left me-2"></i>
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push('/dashboard')
    }
    
    const goBack = () => {
      router.go(-1)
    }
    
    return {
      goHome,
      goBack
    }
  }
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  color: white;
  max-width: 600px;
  width: 100%;
}

.error-illustration {
  position: relative;
  margin-bottom: 40px;
}

.error-number {
  font-size: 8rem;
  font-weight: 900;
  opacity: 0.1;
  line-height: 1;
  margin-bottom: -50px;
}

.error-icon {
  font-size: 4rem;
  color: white;
  margin-bottom: 20px;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
}

.error-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
}

.error-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

.btn-lg {
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 10px;
}

.btn-outline-secondary {
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  background: transparent;
}

.btn-outline-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

@media (max-width: 768px) {
  .error-number {
    font-size: 6rem;
  }
  
  .error-icon {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-lg {
    width: 100%;
    max-width: 300px;
  }
}
</style> 