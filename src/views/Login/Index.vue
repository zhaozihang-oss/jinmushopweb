<template>
  <div class="login-container">
    <!-- 品牌区域 -->
    <div class="brand-section">
      <div class="logo-container">
       <img src="@/assets/img/logo.png" alt="">
        <!-- <h1 class="brand-name">JIMON GROUP</h1> -->
      </div>
    </div>

    <!-- 主登录面板 -->
    <div class="login-panel">
      <!-- 左侧抽象设计区域 (PC端显示) -->
      <div class="design-section">
        <img src="@/assets/img/login.png" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>

      <!-- 右侧登录表单区域 -->
      <div class="form-section">
        <div class="form-container">
          <h2 class="login-title">Login Account</h2>
          
          <form @submit.prevent="handleLogin" class="login-form">
            <!-- Member ID 输入框 -->
            <div class="form-group">
              <label for="memberId" class="form-label">member ID</label>
              <input
                id="memberId"
                v-model="formData.memberId"
                type="text"
                class="form-input"
                placeholder="Enter your member ID"
                required
              />
            </div>

            <!-- Password 输入框 -->
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="password-input-container">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="togglePassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- 滑动验证 -->
            <div class="form-group">
              <label class="form-label">Verification</label>
              <div class="slider-verify-container">
                <div 
                  class="slider-verify" 
                  :class="{ 'verified': isVerified }"
                  @mousedown="startDrag"
                  @touchstart="startDrag"
                >
                  <div class="slider-track">
                    <div class="slider-text">
                      <i class="fas fa-arrows-alt-h"></i>
                      Hold down the slider and drag to the far right
                    </div>
                  </div>
                  <div 
                    class="slider-button"
                    :style="{ left: sliderPosition + '%' }"
                    @mousedown.stop="startDrag"
                    @touchstart.stop="startDrag"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </div>
                </div>
                <!-- 验证成功消息 -->
                <div v-if="verificationMessage" class="verification-message">
                  <i class="fas fa-check-circle"></i>
                  {{ verificationMessage }}
                </div>
              </div>
            </div>

            <!-- 选项和链接 -->
            <div class="form-options">
              <label class="checkbox-container">
                <input
                  v-model="formData.autoLogin"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">Log in automatically</span>
              </label>
              <a href="#" class="forgot-password">Forgot password</a>
            </div>

            <!-- 登录按钮 -->
            <button type="submit" class="login-button">
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginIndex',
  setup() {
    const router = useRouter()
    const showPassword = ref(false)
    const isVerified = ref(false)
    const sliderPosition = ref(0)
    const isDragging = ref(false)
    const verificationMessage = ref('')
    
    const formData = reactive({
      memberId: '',
      password: '',
      autoLogin: false
    })

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const startDrag = (event) => {
      console.log('event')
      isDragging.value = true
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', stopDrag)
      document.addEventListener('touchmove', handleDrag)
      document.addEventListener('touchend', stopDrag)
    }

    const handleDrag = (event) => {
      if (!isDragging.value) return
      
      const slider = event.target.closest('.slider-verify') || document.querySelector('.slider-verify')
      if (!slider) return
      
      const rect = slider.getBoundingClientRect()
      const clientX = event.clientX || (event.touches && event.touches[0].clientX)
      const position = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      
      sliderPosition.value = position
      
      if (position >= 95) {
        isVerified.value = true
        stopDrag()
        // 验证成功回调
        onVerificationSuccess()
      }
    }

    const stopDrag = () => {
      isDragging.value = false
      if (!isVerified.value) {
        sliderPosition.value = 0
      }
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('touchend', stopDrag)
    }

    // 验证成功回调函数
    const onVerificationSuccess = () => {
      console.log('滑动验证成功！')
      
      // 显示成功消息
      verificationMessage.value = '验证成功！'
      
      // 3秒后清除消息
      setTimeout(() => {
        verificationMessage.value = ''
      }, 3000)
      
      // 这里可以添加更多验证成功后的逻辑
      // 例如：
      // - 发送验证成功事件到父组件
      // - 更新全局状态
      // - 记录验证日志
      // - 启用其他表单元素
      
      // 示例：触发父组件事件
      // emit('verification-success', { 
      //   timestamp: Date.now(),
      //   userId: formData.memberId 
      // })
    }

    const handleLogin = async () => {
      if (!isVerified.value) {
        alert('Please complete the verification first')
        return
      }

      if (!formData.memberId || !formData.password) {
        alert('Please enter your member ID and password')
        return
      }

      try {
        // 模拟登录验证
        // 这里可以替换为实际的API调用
        if (formData.memberId === 'admin' && formData.password === 'admin') {
          // 登录成功，存储token
          const storage = formData.autoLogin ? localStorage : sessionStorage
          storage.setItem('token', 'mock-token-' + Date.now())
          storage.setItem('userInfo', JSON.stringify({
            id: 1,
            memberId: formData.memberId,
            name: 'Administrator',
            role: 'admin'
          }))
          
          alert('Login successful!')
          
          // 跳转到仪表板
          router.push('/dashboard')
        } else {
          alert('Invalid member ID or password')
        }
      } catch (error) {
        console.error('Login error:', error)
        alert('Login failed. Please try again.')
      }
    }

    return {
      showPassword,
      isVerified,
      sliderPosition,
      verificationMessage,
      formData,
      togglePassword,
      startDrag,
      handleLogin,
      onVerificationSuccess
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
* {
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8f5e8 100%);
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 品牌区域 */
.brand-section {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-container img {
  height: 40px;
  width: auto;
}

.logo-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #32cd32 0%, #32cd32 50%, #ffd700 50%, #ffd700 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.logo-placeholder::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  background: linear-gradient(135deg, #32cd32 0%, #ffd700 100%);
  border-radius: 50%;
  opacity: 0.8;
}

.brand-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 主登录面板 */
  .login-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin-top: 80px;
    min-height: 600px;
  }

/* 移动端样式 */
@media (max-width: 768px) {
  .login-container {
    background: white;
    padding: 0;
  }

  .brand-section {
    position: relative;
    top: auto;
    left: auto;
    padding: 20px;
    margin-bottom: 20px;
  }

  .logo-container {
    justify-content: flex-start;
  }

  .logo-placeholder {
    width: 32px;
    height: 32px;
  }

  .brand-name {
    font-size: 18px;
  }

  .login-panel {
    flex-direction: column;
    margin-top: 0px;
    padding: 0 20px;
    align-items: stretch;
    width: 100%;
  }

  .design-section {
    display: none;
  }

  .form-section {
    width: 100%;
    max-width: none;
    background: transparent;
  }

  .form-container {
    background: transparent;
    border-radius: 0;
    padding: 10px;
    box-shadow: none;
    width: 100%;
    max-width: none;
    margin-top: -200px;
  }

  .login-title {
    font-size: 24px;
    margin-bottom: 30px;
    text-align: center;
  }

  .form-input {
    background: white;
    border: 1px solid #e0e0e0;
  }

  .form-options {
    margin-top: 15px;
  }

  .forgot-password {
    color: #32cd32;
  }

  .login-button {
    background: #32cd32;
    margin-top: 20px;
  }

  .login-button:hover {
    background: #28a745;
  }

  .slider-verify {
    height: 48px;
  }

  .slider-button {
    width: 44px;
    height: 44px;
  }
}

/* PC端样式 */
@media (min-width: 769px) {
  .login-panel {
    width: 100%;
    max-width: 1000px;
    margin: 80px auto 0;
  }

  .design-section {
    flex: 1;
    background: #1a5f7a;
    border-radius: 12px 0 0 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    height: calc(100% - 80px);
  }

  .abstract-design-placeholder {
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #ffd700, #ff8c00, #32cd32);
    border-radius: 50%;
    opacity: 0.8;
    position: relative;
  }

  .abstract-design-placeholder::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: linear-gradient(45deg, #ff8c00, #32cd32);
    border-radius: 50%;
    opacity: 0.6;
  }

  .form-section {
    flex: 2;
    background: white;
    border-radius: 0 12px 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .form-container {
    width: 100%;
    max-width: 400px;
    padding: 40px;
  }
}

/* 表单样式 */
.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-transform: lowercase;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1a5f7a;
  box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
}

.form-input::placeholder {
  color: #999;
}

/* 密码输入框容器 */
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
}

.password-toggle:hover {
  color: #333;
}

/* 选项和链接 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: #1a5f7a;
  border-color: #1a5f7a;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  font-size: 14px;
  color: #333;
  line-height: 1;
}

.forgot-password {
  font-size: 14px;
  color: #1a5f7a;
  text-decoration: none;
  font-weight: 500;
  line-height: 44px;

}

.forgot-password:hover {
  text-decoration: underline;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 14px;
  background: #1a5f7a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.login-button:hover {
  background: #134b5f;
}

.login-button:active {
  transform: translateY(1px);
}

/* 滑动验证样式 */
.slider-verify-container {
  width: 100%;
}

.slider-verify {
  position: relative;
  width: 100%;
  height: 44px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.slider-verify.verified {
  background: #e8f5e8;
  border-color: #32cd32;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  user-select: none;
  pointer-events: none;
}

.slider-text i {
  font-size: 12px;
}

.slider-button {
  position: absolute;
  top: 2px;
  left: 0;
  width: 40px;
  height: 40px;
  background: #1a5f7a;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: grab;
  transition: all 0.3s ease;
  z-index: 2;
}

.slider-button:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.slider-button i {
  font-size: 14px;
}

.slider-verify.verified .slider-button {
  background: #32cd32;
}

.slider-verify.verified .slider-text {
  color: #32cd32;
  font-weight: 500;
}

.verification-message {
  margin-top: 8px;
  padding: 8px 12px;
  background: #e8f5e8;
  border: 1px solid #32cd32;
  border-radius: 6px;
  color: #32cd32;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: fadeIn 0.3s ease;
}

.verification-message i {
  font-size: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .brand-section {
    padding: 15px;
    margin-bottom: 15px;
  }

  .login-panel {
    padding: 0 15px;
  }

  .login-title {
    font-size: 22px;
    margin-bottom: 25px;
  }

  .form-input {
    padding: 14px 16px;
    font-size: 16px; /* 防止iOS缩放 */
  }

  .form-options {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }

  .login-button {
    padding: 16px;
    font-size: 16px;
  }
}
</style>
