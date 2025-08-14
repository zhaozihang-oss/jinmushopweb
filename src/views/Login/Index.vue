<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
      <div class="bubble bubble-4"></div>
      <div class="bubble bubble-5"></div>
    </div>
    
    <div class="login-card">
      <div class="text-center mb-4">
        <div class="logo-container">
          <i class="fas fa-crown text-primary"></i>
          <div class="logo-glow"></div>
        </div>
        <h3 class="mt-3 mb-1 title-gradient">Login</h3>
        <p class="text-muted subtitle">Jinmu Admin Dashboard</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <div class="input-group input-group-modern">
            <span class="input-group-text">
              <i class="fas fa-user"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              v-model="loginForm.username"
              placeholder="Username"
              required
            >
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Password</label>
          <div class="input-group input-group-modern">
            <span class="input-group-text">
              <i class="fas fa-lock"></i>
            </span>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              class="form-control" 
              v-model="loginForm.password"
              placeholder="Password"
              required
            >
            <button 
              type="button" 
              class="btn btn-outline-secondary password-toggle"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        
        <div class="mb-3 form-check modern-checkbox">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="rememberMe"
            v-model="loginForm.remember"
          >
          <label class="form-check-label" for="rememberMe">
            Remember me
          </label>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-3 login-btn"
          :disabled="loading"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin me-2"></i>
          <span>Login</span>
        </button>
        
        <div class="text-center">
          <a href="#" class="text-decoration-none forgot-password">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    
    const loading = ref(false)
    const showPassword = ref(false)
    
    const loginForm = reactive({
      username: '',
      password: '',
      remember: false
    })
    
    const handleLogin = async () => {
      loading.value = true
      
      try {
        // 模拟登录API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟登录成功
        if (loginForm.username === 'admin' && loginForm.password === 'admin') {
          const token = 'mock-jwt-token'
          
          if (loginForm.remember) {
            localStorage.setItem('token', token)
          } else {
            sessionStorage.setItem('token', token)
          }
          
          router.push('/dashboard')
        } else {
          alert('Invalid username or password! Please use admin/admin to login')
        }
      } catch (error) {
        console.error('Login error:', error)
        alert('Login failed, please try again')
      } finally {
        loading.value = false
      }
    }
    
    return {
      loading,
      showPassword,
      loginForm,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.bubble-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.bubble-3 {
  width: 40px;
  height: 40px;
  top: 80%;
  left: 20%;
  animation-delay: 4s;
}

.bubble-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 20%;
  animation-delay: 1s;
}

.bubble-5 {
  width: 30px;
  height: 30px;
  top: 40%;
  left: 80%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.7;
  }
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 50px 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container {
  position: relative;
  display: inline-block;
}

.logo-container i {
  font-size: 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  0% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.title-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 2rem;
}

.subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 0;
}

.login-form {
  animation: fadeIn 0.8s ease-out 0.2s both;
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

.input-group-modern {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.input-group-modern:focus-within {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.input-group-text {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: none;
  border-right: 1px solid #dee2e6;
  color: #667eea;
  font-weight: 500;
}

.form-control {
  border: none;
  border-left: 1px solid #dee2e6;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  box-shadow: none;
  border-color: #667eea;
  background-color: #f8f9ff;
}

.password-toggle {
  border: none;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #667eea;
  border-left: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #5a6fd8;
}

.modern-checkbox {
  margin: 1.5rem 0;
}

.form-check-input {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.1em;
  border-radius: 0.3em;
  border: 2px solid #667eea;
  transition: all 0.3s ease;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.form-check-label {
  font-weight: 500;
  color: #495057;
  margin-left: 0.5rem;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 14px 20px;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  transform: none;
}

.forgot-password {
  color: #667eea;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.forgot-password:hover {
  color: #5a6fd8;
  text-decoration: underline !important;
}

@media (max-width: 480px) {
  .login-container {
    padding: 15px;
  }
  
  .login-card {
    padding: 40px 30px;
    margin: 20px;
    min-height: auto;
  }
  
  .title-gradient {
    font-size: 1.6rem;
  }
  
  .logo-container i {
    font-size: 3rem;
  }
  
  .login-btn {
    padding: 14px 20px;
    font-size: 1rem;
    min-height: 48px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }
  
  .lang-btn {
    padding: 8px 10px;
    font-size: 0.8rem;
    border-radius: 6px;
    min-height: 40px;
    touch-action: manipulation;
  }
  
  .language-selector .btn-group {
    gap: 4px;
  }
  
  .form-control {
    padding: 14px 16px;
    font-size: 1rem;
    min-height: 48px;
    border-radius: 8px;
  }
  
  .form-check-input {
    min-height: 20px;
    min-width: 20px;
  }
  
  .form-check-label {
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

@media (max-width: 360px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .lang-btn {
    padding: 6px 8px;
    font-size: 0.75rem;
    min-height: 38px;
  }
  
  .language-selector .btn-group {
    gap: 2px;
  }
  
  .login-btn {
    padding: 16px 20px;
    font-size: 1rem;
    min-height: 50px;
  }
  
  .form-control {
    padding: 16px 18px;
    font-size: 1rem;
    min-height: 50px;
  }
  
  .title-gradient {
    font-size: 1.4rem;
  }
  
  .logo-container i {
    font-size: 2.5rem;
  }
}

@media (max-width: 320px) {
  .login-container {
    padding: 8px;
  }
  
  .login-card {
    padding: 25px 15px;
    margin: 8px;
  }
  
  .login-btn {
    padding: 18px 20px;
    font-size: 1rem;
    min-height: 52px;
  }
  
  .form-control {
    padding: 18px 20px;
    font-size: 1rem;
    min-height: 52px;
  }
  
  .lang-btn {
    padding: 8px 10px;
    font-size: 0.8rem;
    min-height: 40px;
  }
}
</style> 