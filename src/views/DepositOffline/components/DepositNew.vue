<template>
  <div class="deposit-form-container">
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
            Drop file here or <em>click to upload</em>
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
        <div class="upload-tip">Supported mimes: jpg,jpeg,png,pdf</div>
      </div>

      <!-- 提交按钮 -->
      <button type="submit" class="submit-btn" :disabled="!isFormValid">
        submit
      </button>
    </form>

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
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

export default {
  name: 'DepositNew',
  components: {
    UploadFilled
  },
  emits: ['deposit-submitted'],
  setup(props, { emit }) {
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

    // 表单验证
    const isFormValid = computed(() => {
      return formData.amount && 
             formData.remark && 
             fileList.value.length > 0
    })

    // 文件上传前验证
    const beforeUpload = (file) => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isValidType) {
        ElMessage.error('只能上传图片或PDF文件!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('文件大小不能超过 2MB!')
        return false
      }
      return true
    }

    // 文件改变事件
    const handleFileChange = (file, fileListParam) => {
      if (beforeUpload(file.raw)) {
        fileList.value = fileListParam
        formData.paymentScreenshot = file.raw
        
        // 如果是图片，创建预览
        if (file.raw.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            previewImage.value = e.target.result
          }
          reader.readAsDataURL(file.raw)
        } else {
          previewImage.value = '' // PDF不显示预览
        }
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

        // 这里应该调用实际的API
        // const response = await depositAPI.createDeposit(submitData)
        
        ElMessage.success('存款申请提交成功!')
        
        // 触发父组件事件
        emit('deposit-submitted', {
          amount: formData.amount,
          remark: formData.remark,
          file: formData.paymentScreenshot
        })
        
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

    // 关闭截图模态框
    const closeScreenshotModal = () => {
      showScreenshotModal.value = false
      currentScreenshot.value = ''
    }

    return {
      formData,
      fileList,
      previewImage,
      showScreenshotModal,
      currentScreenshot,
      isFormValid,
      beforeUpload,
      handleFileChange,
      handleFileRemove,
      handleSubmit,
      resetForm,
      viewPreviewImage,
      removePreviewImage,
      closeScreenshotModal
    }
  }
}
</script>

<style scoped>
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

:deep(.el-upload__text em) {
  color: #2d5016;
  font-style: normal;
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
  .deposit-form-container {
    padding: 20px;
    margin: 0 15px;
  }
}
</style>
