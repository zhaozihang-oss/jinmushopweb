<template>
  <div>
    <!-- 地址管理弹出框 -->
    <div 
      class="modal fade show" 
      v-if="showAddressModal"
      style="display: block; z-index: 1050;"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered address-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Change of address</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="closeAddressModal"
            ></button>
          </div>
          <div class="modal-body">
            <!-- 地址列表 -->
            <div class="address-list">
              <div 
                v-for="address in addresses" 
                :key="address.id"
                class="address-item"
                :class="{ 'is-default': address.isDefault }"
              >
                <div class="address-content">
                  <div class="address-info">
                    <div class="address-title">{{ address.title }}</div>
                    <div class="address-detail">{{ address.detail }}</div>
                  </div>
                  
                  <div class="address-actions">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        :name="'address-' + address.id"
                        :id="'address-' + address.id"
                        :checked="address.isDefault"
                        @change="setDefaultAddress(address.id)"
                      >
                      <label 
                        class="form-check-label" 
                        :for="'address-' + address.id"
                      >
                        Set as default
                      </label>
                    </div>
                    
                    <div class="action-buttons">
                      <button 
                        class="btn btn-sm btn-outline-primary"
                        @click="editAddress(address)"
                      >
                        Editor
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteAddress(address.id)"
                        :disabled="address.isDefault"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 创建新地址按钮 -->
            <div class="create-address-section">
              <button 
                class="btn btn-outline-success create-btn"
                @click="showCreateForm"
              >
                <i class="fas fa-plus"></i>
                Create
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeAddressModal"
            >
              Close
            </button>
            <button 
              type="button" 
              class="btn btn-success" 
              @click="confirmAddressChange"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 地址添加/编辑组件 -->
    <AddressAdd 
      :visible="showAddressFormModal"
      :editData="editingAddress"
      @close="closeAddressFormModal"
      @save="handleSaveAddress"
    />
    
    <!-- 模态框背景遮罩 -->
    <div 
      class="modal-backdrop fade show" 
      v-if="showAddressModal"
      style="z-index: 1045;"
      @click="closeAddressModal"
    ></div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import AddressAdd from './add.vue'

export default {
  name: 'AddressList',
  components: {
    AddressAdd
  },
  setup() {
    // 响应式数据
    const showAddressModal = ref(false)
    const showAddressFormModal = ref(false)
    const editingAddress = ref(null)
    
    // 地址列表数据
    const addresses = ref([
      {
        id: 1,
        title: 'Self-pickup (Pakistan)',
        detail: 'Karachi, Sindh, Pakistan - Main Office',
        isDefault: true
      },
      {
        id: 2,
        title: 'Self-pickup (Indonesia)',
        detail: 'Jakarta, Indonesia - Branch Office',
        isDefault: false
      }
    ])
    

    
    // 方法
    const openAddressModal = () => {
      showAddressModal.value = true
    }
    
    const closeAddressModal = () => {
      showAddressModal.value = false
    }
    
    const closeAddressFormModal = () => {
      showAddressFormModal.value = false
      editingAddress.value = null
    }
    
    const closeAllModals = () => {
      showAddressModal.value = false
      showAddressFormModal.value = false
      editingAddress.value = null
    }
    

    
    const setDefaultAddress = (addressId) => {
      addresses.value.forEach(address => {
        address.isDefault = address.id === addressId
      })
    }
    
    const editAddress = (address) => {
      editingAddress.value = {
        id: address.id,
        contact: address.title.split(' - ')[0] || '',
        countryCode: '+92',
        mobile: '1234567890',
        address: address.detail || '',
        zipCode: '12345',
        country: address.title.includes('Pakistan') ? 'Pakistan' : 'Indonesia',
        isDefault: address.isDefault
      }
      showAddressFormModal.value = true
    }
    
    const deleteAddress = (addressId) => {
      if (confirm('Are you sure you want to delete this address?')) {
        const index = addresses.value.findIndex(addr => addr.id === addressId)
        if (index > -1) {
          addresses.value.splice(index, 1)
          // 如果删除的是默认地址，设置第一个为默认
          if (addresses.value.length > 0 && !addresses.value.some(addr => addr.isDefault)) {
            addresses.value[0].isDefault = true
          }
        }
      }
    }
    
    const showCreateForm = () => {
      editingAddress.value = null
      showAddressFormModal.value = true
    }
    
    const handleSaveAddress = (addressData) => {
      if (editingAddress.value && editingAddress.value.id) {
        // 编辑现有地址
        const address = addresses.value.find(addr => addr.id === editingAddress.value.id)
        if (address) {
          address.title = addressData.title
          address.detail = addressData.detail
          
          // 如果设置为默认，取消其他默认地址
          if (addressData.isDefault) {
            addresses.value.forEach(addr => {
              addr.isDefault = addr.id === editingAddress.value.id
            })
          }
        }
      } else {
        // 创建新地址
        const newId = Math.max(...addresses.value.map(addr => addr.id)) + 1
        const newAddress = {
          id: newId,
          title: addressData.title,
          detail: addressData.detail,
          isDefault: addressData.isDefault
        }
        
        // 如果设置为默认，取消其他默认地址
        if (addressData.isDefault) {
          addresses.value.forEach(addr => {
            addr.isDefault = false
          })
        }
        
        addresses.value.push(newAddress)
      }
    }
    
    const confirmAddressChange = () => {
      const defaultAddress = addresses.value.find(addr => addr.isDefault)
      if (defaultAddress) {
        // 触发父组件事件，更新选中的地址
        // 这里可以emit事件给父组件
        console.log('Selected address:', defaultAddress)
        alert(`Address changed to: ${defaultAddress.title}`)
      }
      closeAddressModal()
    }
    
    return {
      showAddressModal,
      showAddressFormModal,
      editingAddress,
      addresses,
      openAddressModal,
      closeAddressModal,
      closeAddressFormModal,
      closeAllModals,
      setDefaultAddress,
      editAddress,
      deleteAddress,
      showCreateForm,
      handleSaveAddress,
      confirmAddressChange
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

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem;
  pointer-events: none;
}

.address-modal {
  max-width: 60%;
  width: 60%;
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
  border-radius: 0.3rem;
  outline: 0;
  box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,.5);
}

.address-list {
  max-height: 400px;
  overflow-y: auto;
}

.address-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  transition: all 0.2s;
}

.address-item:hover {
  border-color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
}

.address-item.is-default {
  border-color: #28a745;
  background-color: #f8fff9;
}

.address-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.address-info {
  flex: 1;
}

.address-title {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.address-detail {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
}

.address-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  min-width: 120px;
}

.form-check {
  margin-bottom: 0;
}

.form-check-label {
  font-size: 14px;
  color: #495057;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons .btn {
  font-size: 12px;
  padding: 4px 8px;
}

.create-address-section {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-weight: 500;
}

.create-btn i {
  font-size: 14px;
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

/* Tablet responsive */
@media (max-width: 768px) and (min-width: 577px) {
  .address-modal,
  .address-form-modal {
    margin: 15px;
    max-width: calc(100% - 30px);
    width: calc(100% - 30px);
  }
  
  .address-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
  }
  
  .address-actions {
    align-items: flex-end;
    width: auto;
    flex-direction: column;
    justify-content: flex-start;
    min-width: 140px;
    gap: 10px;
  }
  
  .action-buttons {
    justify-content: flex-end;
    gap: 8px;
  }
  
  .action-buttons .btn {
    font-size: 12px;
    padding: 5px 10px;
  }
}

@media (max-width: 576px) {
  .address-modal,
  .address-form-modal {
    margin: 8px;
    max-width: calc(100% - 16px);
    width: calc(100% - 16px);
  }
  
  .modal-content {
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .btn-close {
    font-size: 20px;
    opacity: 0.6;
  }
  
  .modal-body {
    padding: 16px 20px;
  }
  
  .address-list {
    max-height: 60vh;
  }
  
  .address-item {
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
  }
  
  .address-item.is-default {
    border-color: #4CAF50;
    background-color: #f8fff8;
  }
  
  .address-content {
    display: block;
    gap: 0;
  }
  
  .address-info {
    margin-bottom: 12px;
  }
  
  .address-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  .address-detail {
    display: none; /* 隐藏详细地址，只显示标题 */
  }
  
  .address-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-width: auto;
    flex-direction: row;
    gap: 12px;
  }
  
  .form-check {
    order: 1;
    margin-bottom: 0;
  }
  
  .form-check-input {
    width: 18px;
    height: 18px;
  }
  
  .form-check-label {
    font-size: 14px;
    color: #666;
    margin-left: 8px;
  }
  
  .action-buttons {
    order: 2;
    display: flex;
    gap: 8px;
  }
  
  .action-buttons .btn {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: 500;
  }
  
  .btn-outline-primary {
    color: #007bff;
    border-color: #007bff;
  }
  
  .btn-outline-danger {
    color: #dc3545;
    border-color: #dc3545;
  }
  
  .create-address-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    text-align: center;
  }
  
  .create-btn {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
  }
  
  .modal-footer {
    padding: 12px 20px 16px;
    border-top: 1px solid #f0f0f0;
    gap: 12px;
  }
  
  .modal-footer .btn {
    flex: 1;
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
  }
  
  .btn-secondary {
    background-color: #f5f5f5;
    border-color: #f5f5f5;
    color: #666;
  }
  
  .btn-success {
    background-color: #4CAF50;
    border-color: #4CAF50;
  }
}
</style>
