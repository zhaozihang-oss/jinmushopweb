<template>
  <div class="settings-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>System Settings</h2>
    </div>
    
    <div class="row">
      <!-- 左侧菜单 -->
      <div class="col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <nav class="nav flex-column">
              <a 
                class="nav-link"
                :class="{ active: activeTab === 'general' }"
                @click="activeTab = 'general'"
                href="#"
              >
                <i class="fas fa-cog me-2"></i>
                General Settings
              </a>
              <a 
                class="nav-link"
                :class="{ active: activeTab === 'security' }"
                @click="activeTab = 'security'"
                href="#"
              >
                <i class="fas fa-shield-alt me-2"></i>
                Security Settings
              </a>
              <a 
                class="nav-link"
                :class="{ active: activeTab === 'notifications' }"
                @click="activeTab = 'notifications'"
                href="#"
              >
                <i class="fas fa-bell me-2"></i>
                Notification Settings
              </a>
              <a 
                class="nav-link"
                :class="{ active: activeTab === 'backup' }"
                @click="activeTab = 'backup'"
                href="#"
              >
                <i class="fas fa-database me-2"></i>
                Backup Settings
              </a>
            </nav>
          </div>
        </div>
      </div>
      
      <!-- 右侧内容 -->
      <div class="col-lg-9">
        <!-- 常规设置 -->
        <div v-if="activeTab === 'general'" class="card">
          <div class="card-header">
            <h5 class="mb-0">General Settings</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveGeneralSettings">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Site Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="generalSettings.siteName"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Site Description</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="generalSettings.siteDescription"
                    >
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Default Language</label>
                    <select class="form-select" v-model="generalSettings.defaultLanguage">
                      <option value="en-US">English</option>
                      <option value="zh-CN">Chinese</option>
                      <option value="id-ID">Indonesia</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Timezone</label>
                    <select class="form-select" v-model="generalSettings.timezone">
                      <option value="America/New_York">Eastern Time (UTC-5)</option>
                      <option value="America/Chicago">Central Time (UTC-6)</option>
                      <option value="America/Denver">Mountain Time (UTC-7)</option>
                      <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                      <option value="UTC">UTC</option>
                      <option value="Asia/Shanghai">Beijing Time (UTC+8)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Company Address</label>
                    <textarea 
                      class="form-control" 
                      rows="3"
                      v-model="generalSettings.companyAddress"
                    ></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Contact Phone</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      v-model="generalSettings.contactPhone"
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Contact Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      v-model="generalSettings.contactEmail"
                    >
                  </div>
                </div>
              </div>
              <div class="text-end">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- 安全设置 -->
        <div v-if="activeTab === 'security'" class="card">
          <div class="card-header">
            <h5 class="mb-0">Security Settings</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveSecuritySettings">
              <div class="mb-4">
                <h6>Change Password</h6>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Current Password</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="securitySettings.currentPassword"
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">New Password</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="securitySettings.newPassword"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Confirm New Password</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="securitySettings.confirmPassword"
                      >
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-4">
                <h6>Security Options</h6>
                <div class="form-check form-switch mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="twoFactorAuth"
                    v-model="securitySettings.twoFactorAuth"
                  >
                  <label class="form-check-label" for="twoFactorAuth">
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="loginNotifications"
                    v-model="securitySettings.loginNotifications"
                  >
                  <label class="form-check-label" for="loginNotifications">
                    Login Notifications
                  </label>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Session Timeout (minutes)</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="securitySettings.sessionTimeout"
                        min="5"
                        max="1440"
                      >
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="text-end">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- 通知设置 -->
        <div v-if="activeTab === 'notifications'" class="card">
          <div class="card-header">
            <h5 class="mb-0">Notification Settings</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveNotificationSettings">
              <div class="mb-4">
                <h6>Email Notifications</h6>
                <div class="form-check form-switch mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="emailNewOrder"
                    v-model="notificationSettings.emailNewOrder"
                  >
                  <label class="form-check-label" for="emailNewOrder">
                    New Order Notifications
                  </label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="emailLowStock"
                    v-model="notificationSettings.emailLowStock"
                  >
                  <label class="form-check-label" for="emailLowStock">
                    Low Stock Alerts
                  </label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="emailSystemUpdate"
                    v-model="notificationSettings.emailSystemUpdate"
                  >
                  <label class="form-check-label" for="emailSystemUpdate">
                    System Update Notifications
                  </label>
                </div>
              </div>
              
              <div class="mb-4">
                <h6>System Notifications</h6>
                <div class="form-check form-switch mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="systemLogin"
                    v-model="notificationSettings.systemLogin"
                  >
                  <label class="form-check-label" for="systemLogin">
                    Login Notifications
                  </label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="systemError"
                    v-model="notificationSettings.systemError"
                  >
                  <label class="form-check-label" for="systemError">
                    Error Notifications
                  </label>
                </div>
              </div>
              
              <div class="text-end">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- 备份设置 -->
        <div v-if="activeTab === 'backup'" class="card">
          <div class="card-header">
            <h5 class="mb-0">Backup Settings</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveBackupSettings">
              <div class="mb-4">
                <h6>Backup Configuration</h6>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Auto Backup</label>
                      <select class="form-select" v-model="backupSettings.autoBackup">
                        <option value="disabled">Disabled</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Backup Time</label>
                      <input 
                        type="time" 
                        class="form-control" 
                        v-model="backupSettings.backupTime"
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Retention Period (days)</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="backupSettings.retentionDays"
                        min="1"
                        max="365"
                      >
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-4">
                <h6>Manual Backup</h6>
                <p class="text-muted">Create a backup of your data immediately.</p>
                <button type="button" class="btn btn-success" @click="createBackup">
                  <i class="fas fa-download me-2"></i>
                  Create Backup Now
                </button>
              </div>
              
              <div class="text-end">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>
                  Save
                </button>
              </div>
            </form>
            
            <hr class="my-4">
            
            <div class="mb-4">
              <h6>Backup History</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Date</th>
                      <th>Size</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="backup in backupHistory" :key="backup.id">
                      <td>{{ backup.filename }}</td>
                      <td>{{ formatDate(backup.createdAt) }}</td>
                      <td>{{ backup.size }}</td>
                      <td>
                        <button 
                          class="btn btn-outline-primary btn-sm me-2"
                          @click="downloadBackup(backup.id)"
                        >
                          <i class="fas fa-download"></i>
                        </button>
                        <button 
                          class="btn btn-outline-danger btn-sm"
                          @click="deleteBackup(backup.id)"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'Settings',
  setup() {
    const activeTab = ref('general')
    
    const generalSettings = reactive({
      siteName: 'Jinmu Admin Dashboard',
      siteDescription: 'Efficient management platform',
      defaultLanguage: 'en-US',
      timezone: 'America/New_York',
      companyAddress: '123 Main Street, New York, NY 10001',
      contactPhone: '+1-555-123-4567',
      contactEmail: 'admin@jinmu.com'
    })
    
    const securitySettings = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: 60
    })
    
    const notificationSettings = reactive({
      emailNewOrder: true,
      emailLowStock: true,
      emailSystemUpdate: false,
      systemLogin: true,
      systemError: true
    })
    
    const backupSettings = reactive({
      autoBackup: 'daily',
      backupTime: '02:00',
      retentionDays: 30
    })
    
    const backupHistory = ref([
      {
        id: 1,
        filename: 'backup_2023-12-01.sql',
        createdAt: new Date('2023-12-01 02:00:00'),
        size: '15.2 MB'
      },
      {
        id: 2,
        filename: 'backup_2023-11-30.sql',
        createdAt: new Date('2023-11-30 02:00:00'),
        size: '14.8 MB'
      },
      {
        id: 3,
        filename: 'backup_2023-11-29.sql',
        createdAt: new Date('2023-11-29 02:00:00'),
        size: '14.9 MB'
      }
    ])
    
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    const saveGeneralSettings = () => {
      alert('General settings saved successfully!')
    }
    
    const saveSecuritySettings = () => {
      if (securitySettings.newPassword && securitySettings.newPassword !== securitySettings.confirmPassword) {
        alert('New password and confirm password do not match!')
        return
      }
      alert('Security settings saved successfully!')
    }
    
    const saveNotificationSettings = () => {
      alert('Notification settings saved successfully!')
    }
    
    const saveBackupSettings = () => {
      alert('Backup settings saved successfully!')
    }
    
    const createBackup = () => {
      alert('Backup created successfully!')
    }
    
    const downloadBackup = (backupId) => {
      alert(`Downloading backup ${backupId}`)
    }
    
    const deleteBackup = (backupId) => {
      if (confirm('Are you sure you want to delete this backup?')) {
        const index = backupHistory.value.findIndex(b => b.id === backupId)
        if (index !== -1) {
          backupHistory.value.splice(index, 1)
          alert('Backup deleted successfully!')
        }
      }
    }
    
    return {
      activeTab,
      generalSettings,
      securitySettings,
      notificationSettings,
      backupSettings,
      backupHistory,
      formatDate,
      saveGeneralSettings,
      saveSecuritySettings,
      saveNotificationSettings,
      saveBackupSettings,
      createBackup,
      downloadBackup,
      deleteBackup
    }
  }
}
</script>

<style scoped>
.settings-page {
  animation: fadeIn 0.3s ease-in-out;
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

.nav-link {
  color: #6c757d;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.card-header {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 20px;
  border-radius: 12px 12px 0 0;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 10px 15px;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.table th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

@media (max-width: 768px) {
  .settings-page .row {
    flex-direction: column;
  }
  
  .col-lg-3 {
    margin-bottom: 20px;
  }
  
  .nav {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }
  
  .nav-link {
    white-space: nowrap;
    margin-right: 10px;
  }
}
</style> 