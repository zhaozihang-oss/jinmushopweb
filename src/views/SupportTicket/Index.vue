<template>
  <div class="support-ticket-container">
    <!-- 页面头部 -->
    <div v-if="!showSTHistory" class="page-header">
      <h2 class="page-title">Support Ticket</h2>
      <button class="btn btn-success" @click="viewHistory">
        ST History
      </button>
    </div>

    <!-- 表单区域 -->
    <div v-if="!showSTHistory" class="form-section">
      <form @submit.prevent="handleSubmit" class="ticket-form">
        <div class="row g-4">
          <!-- Name -->
          <div class="col-md-6">
            <label class="form-label">Name</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="ticketForm.name"
              placeholder="Sanaullah Khanum"
              required
            >
          </div>

          <!-- Email Address -->
          <div class="col-md-6">
            <label class="form-label">Email Address</label>
            <input 
              type="email" 
              class="form-control" 
              v-model="ticketForm.email"
              placeholder="afzalleo3@gmail.com"
              required
            >
          </div>

          <!-- Subject -->
          <div class="col-md-6">
            <label class="form-label">
              Subject <span class="text-danger">*</span>
            </label>
            <input 
              type="text" 
              class="form-control" 
              v-model="ticketForm.subject"
              placeholder="Enter Subject"
              required
            >
          </div>

          <!-- Priority -->
          <div class="col-md-6">
            <label class="form-label">
              Priority <span class="text-danger">*</span>
            </label>
            <select class="form-select" v-model="ticketForm.priority" required>
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <!-- Message -->
          <div class="col-12">
            <label class="form-label">
              Message <span class="text-danger">*</span>
            </label>
            <textarea 
              class="form-control message-textarea" 
              v-model="ticketForm.message"
              placeholder="Enter Message"
              rows="6"
              required
            ></textarea>
          </div>

          <!-- Payment Screen Shot -->
          <div class="col-12">
            <label class="form-label">
              Payment Screen Shot <span class="text-danger">*</span>
            </label>
            <div class="upload-section">
              <el-upload
                v-model:file-list="fileList"
                :action="uploadAction"
                :before-upload="beforeUpload"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :on-remove="handleRemove"
                :limit="5"
                :on-exceed="handleExceed"
                multiple
                list-type="picture-card"
                accept="image/*"
                class="upload-demo"
              >
                <el-icon class="upload-icon"><Plus /></el-icon>
              </el-upload>
              <div class="upload-tip">
                Maximum file size 2MB; Max 5 files can be uploaded.
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="col-12">
            <button 
              type="submit" 
              class="btn btn-success btn-submit"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">
                <i class="fas fa-spinner fa-spin me-2"></i>Submitting...
              </span>
              <span v-else>Submit</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- ST History Page -->
    <STHistory 
      v-if="showSTHistory"
      @back="closeSTHistory"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import STHistory from './components/STHistory.vue'

export default {
  name: 'SupportTicket',
  components: {
    Plus,
    STHistory
  },
  setup() {
    // 响应式数据
    const isSubmitting = ref(false)
    const showSTHistory = ref(false)
    const fileList = ref([])
    const uploadAction = ref('#') // 实际项目中应该是真实的上传接口

    // 表单数据
    const ticketForm = reactive({
      name: 'Sanaullah Khanum',
      email: 'afzalleo3@gmail.com',
      subject: '',
      priority: 'High',
      message: ''
    })

    // 上传相关方法
    const beforeUpload = (file) => {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        ElMessage.error('Only image files are allowed!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('Image size cannot exceed 2MB!')
        return false
      }
      return true
    }

    const handleUploadSuccess = (response, file, fileList) => {
      ElMessage.success('Image uploaded successfully!')
    }

    const handleUploadError = (error, file, fileList) => {
      ElMessage.error('Image upload failed!')
    }

    const handleRemove = (file, fileList) => {
      ElMessage.info('Image removed')
    }

    const handleExceed = (files, fileList) => {
      ElMessage.warning('Maximum 5 files can be uploaded!')
    }

    // 表单提交
    const handleSubmit = async () => {
      if (isSubmitting.value) return

      // 验证表单
      if (!ticketForm.subject || !ticketForm.priority || !ticketForm.message) {
        ElMessage.error('Please fill in all required fields')
        return
      }

      isSubmitting.value = true

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const submitData = {
          ...ticketForm,
          attachments: fileList.value.map(file => ({
            name: file.name,
            url: file.url
          })),
          createdAt: new Date().toISOString()
        }

        console.log('Support ticket submitted:', submitData)
        
        ElMessage.success('Support ticket submitted successfully!')
        
        // 重置表单（保留姓名和邮箱）
        ticketForm.subject = ''
        ticketForm.message = ''
        ticketForm.priority = ''
        fileList.value = []
        
      } catch (error) {
        ElMessage.error('Failed to submit support ticket. Please try again.')
        console.error('Submit error:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    // ST History相关方法
    const viewHistory = () => {
      showSTHistory.value = true
    }

    const closeSTHistory = () => {
      showSTHistory.value = false
    }

    // 初始化
    onMounted(() => {
      // 可以在这里加载用户信息等
    })

    return {
      isSubmitting,
      showSTHistory,
      fileList,
      uploadAction,
      ticketForm,
      beforeUpload,
      handleUploadSuccess,
      handleUploadError,
      handleRemove,
      handleExceed,
      handleSubmit,
      viewHistory,
      closeSTHistory
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.support-ticket-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
}

/* 表单区域 */
.form-section {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
}

.ticket-form {
  max-width: 100%;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control,
.form-select {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  outline: none;
}

.message-textarea {
  resize: vertical;
  min-height: 150px;
}

/* 上传区域 */
.upload-section {
  margin-top: 0.5rem;
}

.upload-demo {
  width: 100%;
}

:deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

:deep(.el-upload--picture-card:hover) {
  border-color: #28a745;
  background-color: #f0f9f0;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

:deep(.el-upload--picture-card:hover .upload-icon) {
  color: #28a745;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}

.upload-tip {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
  line-height: 1.4;
}

/* 提交按钮 */
.btn-submit {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: #28a745;
  border-color: #28a745;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  background-color: #218838;
  border-color: #1e7e34;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .support-ticket-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    text-align: center;
  }
  
  .form-section {
    padding: 1.5rem;
  }
  
  .ticket-form .row {
    gap: 1rem;
  }
  
  .ticket-form .col-md-6,
  .ticket-form .col-md-12,
  .ticket-form .col-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .support-ticket-container {
    padding: 0.5rem;
  }
  
  .page-header,
  .form-section {
    border-radius: 0.25rem;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
  }
  
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
}
</style> 