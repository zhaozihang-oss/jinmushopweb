<template>
  <div class="change-password-container">
    <div class="change-password-header">
      <h1 class="change-password-title">Change Password</h1>
    </div>

    <div class="change-password-form-container">
      <form @submit.prevent="handleSubmit" class="change-password-form">
        <div class="form-group">
          <!-- Current Password -->
          <div class="mb-4">
            <label for="currentPassword" class="form-label">
              Current Password <span class="text-danger">*</span>
            </label>
            <div class="password-input-container">
              <input
                id="currentPassword"
                v-model="passwordData.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="••••••••••"
                required
                readonly
                value="••••••••••"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="toggleCurrentPassword"
              >
                <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div class="mb-4">
            <label for="newPassword" class="form-label">
              Password <span class="text-danger">*</span>
            </label>
            <div class="password-input-container">
              <input
                id="newPassword"
                v-model="passwordData.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Enter password"
                required
                minlength="6"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="toggleNewPassword"
              >
                <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label for="confirmPassword" class="form-label">
              Confirm Password <span class="text-danger">*</span>
            </label>
            <div class="password-input-container">
              <input
                id="confirmPassword"
                v-model="passwordData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Enter the password again"
                required
                minlength="6"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="toggleConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="passwordMismatch" class="invalid-feedback d-block">
              Passwords do not match
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-success btn-lg submit-btn"
            :disabled="!isFormValid"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ChangePasswordIndex',
  setup() {
    const router = useRouter()

    // Password visibility toggles
    const showCurrentPassword = ref(false)
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)

    // Form data
    const passwordData = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // Computed properties
    const passwordMismatch = computed(() => {
      return passwordData.confirmPassword && 
             passwordData.newPassword && 
             passwordData.newPassword !== passwordData.confirmPassword
    })

    const isFormValid = computed(() => {
      return passwordData.newPassword && 
             passwordData.confirmPassword && 
             passwordData.newPassword === passwordData.confirmPassword &&
             passwordData.newPassword.length >= 6
    })

    // Methods
    const toggleCurrentPassword = () => {
      showCurrentPassword.value = !showCurrentPassword.value
    }

    const toggleNewPassword = () => {
      showNewPassword.value = !showNewPassword.value
    }

    const toggleConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value
    }

    const handleSubmit = async () => {
      if (!isFormValid.value) {
        return
      }

      try {
        // Simulate API call to change password
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Show success message
        alert('Password changed successfully! Please login with your new password.')
        
        // Clear session/token data
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        sessionStorage.removeItem('userInfo')
        
        // Redirect to login page
        router.push('/login')
        
      } catch (error) {
        console.error('Password change failed:', error)
        alert('Failed to change password. Please try again.')
      }
    }

    return {
      passwordData,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      passwordMismatch,
      isFormValid,
      toggleCurrentPassword,
      toggleNewPassword,
      toggleConfirmPassword,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.change-password-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.change-password-header {
  margin-bottom: 24px;
}

.change-password-title {
  font-size: 32px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.change-password-form-container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.change-password-form {
  width: 100%;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 12px 50px 12px 16px;
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  flex: 1;
}

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
  outline: none;
}

.form-control[readonly] {
  background-color: #f8f9fa;
  color: #6c757d;
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  font-size: 16px;
  transition: color 0.3s ease;
  z-index: 10;
}

.password-toggle-btn:hover {
  color: #495057;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.form-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.submit-btn {
  padding: 12px 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background-color: #198754;
  border-color: #198754;
  transition: all 0.3s ease;
  min-width: 200px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #157347;
  border-color: #146c43;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
}

.submit-btn:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .change-password-container {
    padding: 12px;
  }
  
  .change-password-form-container {
    padding: 20px;
  }
  
  .change-password-title {
    font-size: 28px;
  }
  
  .submit-btn {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .form-control {
    padding: 10px 45px 10px 14px;
  }
  
  .password-toggle-btn {
    right: 10px;
    padding: 6px;
    font-size: 14px;
  }
}
</style> 