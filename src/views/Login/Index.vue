<template>
  <div class="login-container">
    <!-- 品牌区域 -->
    <div class="brand-section">
      <div class="logo-container">
        <div class="logo-placeholder">
          <!-- 图片占位符，后续插入logo -->
        </div>
        <h1 class="brand-name">JIMON GROUP</h1>
      </div>
    </div>

    <!-- 主登录面板 -->
    <div class="login-panel">
      <!-- 左侧抽象设计区域 (PC端显示) -->
      <div class="design-section">
        <div class="abstract-design-placeholder">
          <!-- 图片占位符，后续插入抽象设计 -->
        </div>
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

export default {
  name: 'LoginIndex',
  setup() {
    const showPassword = ref(false)
    const formData = reactive({
      memberId: '',
      password: '',
      autoLogin: false
    })

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const handleLogin = () => {
      // 处理登录逻辑
      console.log('Login attempt:', formData)
      // 这里可以添加实际的登录API调用
    }

    return {
      showPassword,
      formData,
      togglePassword,
      handleLogin
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
