<template>
  <div>
    <!-- 添加/编辑地址弹出框 -->
    <div 
      class="modal fade show" 
      v-if="showModal"
      style="display: block; z-index: 1060;"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered address-form-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Edit the consignee information' : 'Add the consignee information' }}
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAddress">
              <!-- Contact -->
              <div class="mb-3">
                <label class="form-label required">Contact</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="addressForm.contact"
                  placeholder="Enter Contact"
                  required
                >
              </div>
              
              <!-- Mobile Number -->
              <div class="mb-3">
                <label class="form-label required">Mobile Number</label>
                <div class="mobile-input-group">
                  <select class="country-code-select" v-model="addressForm.countryCode">
                    <option value="+92">+92</option>
                    <option value="+1">+1</option>
                    <option value="+86">+86</option>
                    <option value="+91">+91</option>
                    <option value="+62">+62</option>
                  </select>
                  <input 
                    type="tel" 
                    class="form-control mobile-input" 
                    v-model="addressForm.mobile"
                    placeholder="Enter Mobile Number"
                    required
                  >
                </div>
                <small class="form-text text-muted">Example: 08 XX * * * * xxxx</small>
              </div>
              
              <!-- Address -->
              <div class="mb-3">
                <label class="form-label required">Address</label>
                <textarea 
                  class="form-control address-textarea" 
                  rows="3"
                  v-model="addressForm.address"
                  placeholder="xxx Street, xx District, xx City, xx Province"
                  required
                ></textarea>
              </div>
              
              <!-- ZIP code and Country -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label required">ZIP code</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="addressForm.zipCode"
                    placeholder="Enter Zip Code"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label required">Country</label>
                  <select class="form-select" v-model="addressForm.country" required>
                    <option value="">Select Country</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="India">India</option>
                    <option value="China">China</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
              </div>
              
              <!-- Set as default -->
              <div class="form-check mb-4">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="setAsDefault"
                  v-model="addressForm.isDefault"
                >
                <label class="form-check-label" for="setAsDefault">
                  Set as default addr
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeModal"
            >
              Close
            </button>
            <button 
              type="button" 
              class="btn btn-success" 
              @click="saveAddress"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 模态框背景遮罩 -->
    <div 
      class="modal-backdrop fade show" 
      v-if="showModal"
      style="z-index: 1055;"
      @click="closeModal"
    ></div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'AddressAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const isEditing = ref(false)
    
    // 地址表单数据
    const addressForm = reactive({
      contact: '',
      countryCode: '+92',
      mobile: '',
      address: '',
      zipCode: '',
      country: 'Pakistan',
      isDefault: false
    })
    
    // 监听visible属性变化
    watch(() => props.visible, (newVal) => {
      showModal.value = newVal
      if (newVal && props.editData) {
        // 编辑模式，填充数据
        isEditing.value = true
        Object.assign(addressForm, props.editData)
      } else if (newVal) {
        // 新增模式，重置表单
        isEditing.value = false
        resetForm()
      }
    })
    
    // 监听editData变化
    watch(() => props.editData, (newData) => {
      if (newData) {
        isEditing.value = true
        Object.assign(addressForm, newData)
      }
    })
    
    const resetForm = () => {
      addressForm.contact = ''
      addressForm.countryCode = '+92'
      addressForm.mobile = ''
      addressForm.address = ''
      addressForm.zipCode = ''
      addressForm.country = 'Pakistan'
      addressForm.isDefault = false
    }
    
    const closeModal = () => {
      showModal.value = false
      emit('close')
    }
    
    const saveAddress = () => {
      // 验证表单
      if (!addressForm.contact.trim()) {
        alert('Please enter contact name')
        return
      }
      if (!addressForm.mobile.trim()) {
        alert('Please enter mobile number')
        return
      }
      if (!addressForm.address.trim()) {
        alert('Please enter address')
        return
      }
      if (!addressForm.zipCode.trim()) {
        alert('Please enter ZIP code')
        return
      }
      if (!addressForm.country) {
        alert('Please select country')
        return
      }
      
      // 构建完整的地址数据
      const addressData = {
        ...addressForm,
        title: `${addressForm.contact} - ${addressForm.country}`,
        detail: `${addressForm.address}, ${addressForm.zipCode}`,
        fullMobile: `${addressForm.countryCode} ${addressForm.mobile}`
      }
      
      emit('save', addressData)
      closeModal()
    }
    
    // 暴露方法给父组件
    const openModal = (editData = null) => {
      if (editData) {
        isEditing.value = true
        Object.assign(addressForm, editData)
      } else {
        isEditing.value = false
        resetForm()
      }
      showModal.value = true
    }
    
    return {
      showModal,
      isEditing,
      addressForm,
      closeModal,
      saveAddress,
      openModal
    }
  }
}
</script>

<style scoped>
/* 弹出框基本样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.address-form-modal {
  max-width: 600px;
  width: 90%;
  margin: 1.75rem auto;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0,0,0,.2);
  border-radius: 0.5rem;
  outline: 0;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.6;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  opacity: 1;
}

.btn-close::before {
  content: "×";
  font-size: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
  display: block;
}

.form-label.required::after {
  content: "*";
  color: #dc3545;
  margin-left: 4px;
}

.form-control, .form-select {
  display: block;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus, .form-select:focus {
  color: #495057;
  background-color: #fff;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control::placeholder {
  color: #adb5bd;
  opacity: 1;
}

.mobile-input-group {
  display: flex;
  gap: 0;
}

.country-code-select {
  width: 80px;
  flex-shrink: 0;
  border-radius: 0.375rem 0 0 0.375rem;
  border-right: none;
  background-color: #f8f9fa;
  font-weight: 500;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.country-code-select:focus {
  color: #495057;
  background-color: #f8f9fa;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.mobile-input {
  flex: 1;
  border-radius: 0 0.375rem 0.375rem 0;
  border-left: none;
}

.mobile-input:focus {
  border-left: 1px solid #86b7fe;
}

.address-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-text {
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #6c757d;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  width: 1rem;
  height: 1rem;
  margin: 0;
  vertical-align: top;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 1px solid rgba(0, 0, 0, 0.25);
  appearance: none;
  border-radius: 0.25em;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
}

.form-check-label {
  cursor: pointer;
  font-size: 0.95rem;
  color: #495057;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  gap: 0.75rem;
}

.btn {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
}

.btn-secondary {
  color: #6c757d;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}

.btn-secondary:hover {
  color: #545862;
  background-color: #e9ecef;
  border-color: #e9ecef;
}

.btn-success {
  color: #fff;
  background-color: #198754;
  border-color: #198754;
}

.btn-success:hover {
  color: #fff;
  background-color: #157347;
  border-color: #146c43;
}

/* 背景遮罩样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop.show {
  opacity: 0.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .address-form-modal {
    margin: 10px;
    max-width: calc(100% - 20px);
    width: calc(100% - 20px);
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-footer {
    padding: 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .address-form-modal {
    margin: 5px;
    max-width: calc(100% - 10px);
    width: calc(100% - 10px);
  }
  
  .row {
    margin: 0 -0.5rem;
  }
  
  .row > [class*="col-"] {
    padding: 0 0.5rem;
  }
  
  .mobile-input-group {
    display: flex;
    gap: 0;
  }
  
  .country-code-select {
    width: 80px;
    flex-shrink: 0;
    border-radius: 0.375rem 0 0 0.375rem;
    border-right: none;
    border: 1px solid #ced4da;
  }
  
  .mobile-input {
    flex: 1;
    border-radius: 0 0.375rem 0.375rem 0;
    border-left: none;
    border: 1px solid #ced4da;
  }
  
  .form-control, .form-select {
    padding: 0.625rem;
    font-size: 0.9rem;
  }
}
</style>
