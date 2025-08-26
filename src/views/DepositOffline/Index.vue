<template>
  <div class="deposit-page">
    <!-- 页面标题和切换按钮 -->
    <div class="page-header">
      <h1 class="page-title">{{ currentView === 'deposit' ? 'Deposit Funds' : 'Deposit History' }}</h1>
      <button 
        class="switch-view-btn" 
        @click="switchView"
      >
        {{ currentView === 'deposit' ? 'Deposit History' : 'Deposit Funds' }}
      </button>
    </div>

    <!-- 存款表单视图 -->
    <div v-if="currentView === 'deposit'" class="deposit-form-container">
      <form @submit.prevent="handleSubmit" class="deposit-form">
        <!-- 金额输入 -->
        <div class="form-group">
          <label class="form-label">
            Amount <span class="required">*</span>
          </label>
          <div class="amount-input-wrapper">
            <input
              type="number"
              v-model="formData.amount"
              class="amount-input"
              placeholder="Enter amount"
              step="0.01"
              min="0"
              required
            />
            <span class="currency-label">USD</span>
          </div>
        </div>

        <!-- 备注输入 -->
        <div class="form-group">
          <label class="form-label">
            Remark <span class="required">*</span>
          </label>
          <textarea
            v-model="formData.remark"
            class="remark-input"
            placeholder="Enter the comment information"
            rows="3"
            required
          ></textarea>
        </div>

        <!-- 支付截图上传 -->
        <div class="form-group">
          <label class="form-label">
            Payment Screen Shot <span class="required">*</span>
          </label>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="beforeUpload"
            :file-list="fileList"
            accept="image/*"
            :limit="1"
            list-type="picture"
          >
            <el-icon class="el-icon--upload" v-if="!previewImage">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text" v-if="!previewImage">
              Upload
            </div>
            <!-- 图片预览 -->
            <div v-if="previewImage" class="image-preview" @click.stop>
              <img :src="previewImage" alt="Preview" class="preview-img" />
              <div class="preview-overlay">
                <button type="button" class="preview-btn" @click.stop="viewPreviewImage">
                  <i class="fas fa-eye"></i>
                </button>
                <button type="button" class="remove-btn" @click.stop="removePreviewImage">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </el-upload>
          <div class="upload-tip">Maximum file size 2MB</div>
        </div>

        <!-- 提交按钮 -->
        <button type="submit" class="submit-btn" :disabled="!isFormValid">
          submit
        </button>
      </form>
    </div>

    <!-- 存款历史视图 -->
    <div v-else class="deposit-history-container">
      <!-- 桌面端表格 -->
      <div class="desktop-table" v-show="!isMobile">
        <div class="table-container">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Remark</th>
                  <th>Screenshot</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in currentPageData" :key="record.id">
                  <td>{{ formatDate(record.date) }}</td>
                  <td class="amount">{{ formatAmount(record.amount) }}</td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(record.status)">
                      {{ record.status }}
                    </span>
                  </td>
                  <td class="remark">{{ record.remark }}</td>
                  <td>
                    <button 
                      v-if="record.screenshot" 
                      class="view-screenshot-btn"
                      @click="viewScreenshot(record.screenshot)"
                    >
                      <i class="fas fa-image"></i>
                      View
                    </button>
                    <span v-else class="no-screenshot">-</span>
                  </td>
                  <td>
                    <button 
                      v-if="record.status === 'Pending'"
                      class="cancel-btn"
                      @click="cancelDeposit(record.id)"
                    >
                      Cancel
                    </button>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 移动端卡片 -->
      <div class="mobile-records" v-show="isMobile">
        <div 
          v-for="record in currentPageData" 
          :key="record.id" 
          class="record-card"
        >
          <div class="record-header">
            <div class="record-date">{{ formatDate(record.date) }}</div>
            <div class="record-amount">{{ formatAmount(record.amount) }}</div>
          </div>
          
          <div class="record-body">
            <div class="record-item">
              <span class="label">Status:</span>
              <span class="status-badge" :class="getStatusClass(record.status)">
                {{ record.status }}
              </span>
            </div>
            
            <div class="record-item">
              <span class="label">Remark:</span>
              <span class="value">{{ record.remark }}</span>
            </div>
            
            <div class="record-item" v-if="record.screenshot">
              <span class="label">Screenshot:</span>
              <button 
                class="view-screenshot-btn mobile"
                @click="viewScreenshot(record.screenshot)"
              >
                <i class="fas fa-image me-1"></i>
                View Screenshot
              </button>
            </div>
            
            <div class="record-actions" v-if="record.status === 'Pending'">
              <button 
                class="cancel-btn mobile"
                @click="cancelDeposit(record.id)"
              >
                Cancel Deposit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        :is-mobile="isMobile"
        @page-change="handlePageChange"
      />
    </div>

    <!-- 截图查看模态框 -->
    <div v-if="showScreenshotModal" class="screenshot-modal" @click="closeScreenshotModal">
      <div class="screenshot-modal-content" @click.stop>
        <button class="close-modal-btn" @click="closeScreenshotModal">
          <i class="fas fa-times"></i>
        </button>
        <img :src="currentScreenshot" alt="Payment Screenshot" class="screenshot-image" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'DepositOffline',
  components: {
    UploadFilled,
    Pagination
  },
  setup() {
    const currentView = ref('deposit') // 'deposit' 或 'history'
    const isMobile = ref(false)
    const currentPage = ref(1)
    const showScreenshotModal = ref(false)
    const currentScreenshot = ref('')
    const previewImage = ref('')
    
    // 表单数据
    const formData = reactive({
      amount: '',
      remark: '',
      paymentScreenshot: null
    })
    
    const fileList = ref([])

    // 存款历史数据
    const allRecords = ref([
      {
        id: 1,
        date: '2025-02-05',
        amount: 500.00,
        status: 'Approved',
        remark: 'Monthly deposit for investment',
        screenshot: 'https://via.placeholder.com/400x300/4CAF50/white?text=Payment+Screenshot'
      },
      {
        id: 2,
        date: '2025-02-03',
        amount: 250.00,
        status: 'Pending',
        remark: 'Additional funds for trading',
        screenshot: 'https://via.placeholder.com/400x300/FF9800/white?text=Payment+Screenshot'
      },
      {
        id: 3,
        date: '2025-02-01',
        amount: 1000.00,
        status: 'Rejected',
        remark: 'Large deposit for portfolio expansion',
        screenshot: 'https://via.placeholder.com/400x300/F44336/white?text=Payment+Screenshot'
      }
    ])

    // 响应式检测移动设备
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }
    
    // 根据设备类型设置每页显示数量
    const pageSize = computed(() => {
      return isMobile.value ? 5 : 10
    })

    // 表单验证
    const isFormValid = computed(() => {
      return formData.amount && 
             formData.remark && 
             fileList.value.length > 0
    })

    // 计算属性
    const totalPages = computed(() => {
      return Math.ceil(allRecords.value.length / pageSize.value)
    })

    const currentPageData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return allRecords.value.slice(start, end)
    })

    // 切换视图
    const switchView = () => {
      currentView.value = currentView.value === 'deposit' ? 'history' : 'deposit'
      currentPage.value = 1 // 重置分页
    }

    // 文件上传前验证
    const beforeUpload = (file) => {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        ElMessage.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
        return false
      }
      return true
    }

    // 文件改变事件
    const handleFileChange = (file, fileListParam) => {
      if (beforeUpload(file.raw)) {
        fileList.value = fileListParam
        formData.paymentScreenshot = file.raw
        
        // 创建图片预览
        const reader = new FileReader()
        reader.onload = (e) => {
          previewImage.value = e.target.result
        }
        reader.readAsDataURL(file.raw)
      }
    }

    // 文件移除事件
    const handleFileRemove = () => {
      fileList.value = []
      formData.paymentScreenshot = null
      previewImage.value = ''
    }

    // 提交表单
    const handleSubmit = async () => {
      if (!isFormValid.value) {
        ElMessage.warning('请填写所有必填项')
        return
      }

      try {
        // 创建FormData对象
        const submitData = new FormData()
        submitData.append('amount', formData.amount)
        submitData.append('remark', formData.remark)
        submitData.append('paymentScreenshot', formData.paymentScreenshot)

        // 模拟API调用
        console.log('提交存款申请:', {
          amount: formData.amount,
          remark: formData.remark,
          file: formData.paymentScreenshot
        })

        ElMessage.success('存款申请提交成功!')
        
        // 重置表单
        resetForm()
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败，请重试')
      }
    }

    // 重置表单
    const resetForm = () => {
      formData.amount = ''
      formData.remark = ''
      formData.paymentScreenshot = null
      fileList.value = []
      previewImage.value = ''
    }

    // 查看预览图片
    const viewPreviewImage = () => {
      currentScreenshot.value = previewImage.value
      showScreenshotModal.value = true
    }

    // 移除预览图片
    const removePreviewImage = () => {
      handleFileRemove()
    }

    // 历史记录相关方法
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    }

    const getStatusClass = (status) => {
      const statusClasses = {
        'Approved': 'status-approved',
        'Pending': 'status-pending',
        'Rejected': 'status-rejected'
      }
      return statusClasses[status] || ''
    }

    const viewScreenshot = (screenshot) => {
      currentScreenshot.value = screenshot
      showScreenshotModal.value = true
    }

    const closeScreenshotModal = () => {
      showScreenshotModal.value = false
      currentScreenshot.value = ''
    }

    const cancelDeposit = async (id) => {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to cancel this deposit request?',
          'Confirm Cancellation',
          {
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        
        // 模拟API调用
        console.log('Cancelling deposit:', id)
        
        // 更新本地数据
        const record = allRecords.value.find(r => r.id === id)
        if (record) {
          record.status = 'Cancelled'
        }
        
        ElMessage.success('Deposit request cancelled successfully')
      } catch {
        // 用户取消操作
      }
    }

    // 生命周期
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      currentView,
      isMobile,
      currentPage,
      showScreenshotModal,
      currentScreenshot,
      previewImage,
      formData,
      fileList,
      allRecords,
      isFormValid,
      totalPages,
      currentPageData,
      switchView,
      beforeUpload,
      handleFileChange,
      handleFileRemove,
      handleSubmit,
      resetForm,
      viewPreviewImage,
      removePreviewImage,
      handlePageChange,
      formatDate,
      formatAmount,
      getStatusClass,
      viewScreenshot,
      closeScreenshotModal,
      cancelDeposit
    }
  }
}
</script>

<style scoped>
.deposit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.switch-view-btn {
  background-color: #2d5016;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.switch-view-btn:hover {
  background-color: #1a2e0a;
}

/* 存款表单样式 */
.deposit-form-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.required {
  color: #ff4757;
}

.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  padding-right: 60px;
}

.amount-input:focus {
  outline: none;
  border-color: #2d5016;
}

.currency-label {
  position: absolute;
  right: 16px;
  color: #999;
  font-size: 14px;
  pointer-events: none;
}

.remark-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
}

.remark-input:focus {
  outline: none;
  border-color: #2d5016;
}

/* Element Plus Upload 样式覆盖 */
:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-list) {
  display: none;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep(.el-upload-dragger:hover) {
  border-color: #2d5016;
}

:deep(.el-upload-dragger .el-icon--upload) {
  font-size: 28px;
  color: #999;
  margin-bottom: 8px;
}

:deep(.el-upload__text) {
  color: #666;
  font-size: 14px;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

/* 图片预览样式 */
.image-preview {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .preview-overlay {
  opacity: 1;
}

.preview-btn, .remove-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.preview-btn {
  background-color: #007bff;
}

.preview-btn:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

.remove-btn {
  background-color: #dc3545;
}

.remove-btn:hover {
  background-color: #c82333;
  transform: scale(1.1);
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #2d5016;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1a2e0a;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 存款历史样式 */
.deposit-history-container {
  max-width: 1200px;
  margin: 0 auto;
}

.desktop-table .table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin: 0;
  font-size: 14px;
}

.table th {
  background-color: #f8f9fa;
  border-top: none;
  border-bottom: 2px solid #e9ecef;
  color: #495057;
  font-weight: 600;
  padding: 16px 12px;
  white-space: nowrap;
}

.table td {
  padding: 16px 12px;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
}

.amount {
  font-weight: 600;
  color: #28a745;
}

.remark {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-approved {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.view-screenshot-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-screenshot-btn:hover {
  background-color: #0056b3;
}

.view-screenshot-btn.mobile {
  padding: 8px 16px;
  font-size: 14px;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #c82333;
}

.cancel-btn.mobile {
  padding: 8px 16px;
  font-size: 14px;
  width: 100%;
}

.no-screenshot {
  color: #6c757d;
}

/* 移动端历史记录样式 */
.mobile-records {
  margin-bottom: 20px;
}

.record-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.record-date {
  font-size: 14px;
  color: #6c757d;
}

.record-amount {
  font-size: 18px;
  font-weight: 600;
  color: #28a745;
}

.record-body {
  padding: 16px 20px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-item:last-child {
  margin-bottom: 0;
}

.record-item .label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
  min-width: 80px;
}

.record-item .value {
  font-size: 14px;
  color: #333;
  text-align: right;
  flex: 1;
}

.record-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

/* 截图模态框 */
.screenshot-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.screenshot-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.close-modal-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.screenshot-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .deposit-page {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .deposit-form-container {
    padding: 20px;
  }
  
  .page-title {
    font-size: 20px;
  }
}
</style> 