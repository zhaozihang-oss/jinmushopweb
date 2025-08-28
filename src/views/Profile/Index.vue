<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="profile-title">Profile</h1>
    </div>

    <div class="profile-form-container">
      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="row g-3">
          <!-- First Name -->
          <div class="col-md-4">
            <label for="firstName" class="form-label">
              First Name <span class="text-danger">*</span>
            </label>
            <input
              id="firstName"
              v-model="profileData.firstName"
              type="text"
              class="form-control"
              placeholder="Enter First Name"
              required
            />
          </div>

          <!-- Last Name -->
          <div class="col-md-4">
            <label for="lastName" class="form-label">
              Last Name <span class="text-danger">*</span>
            </label>
            <input
              id="lastName"
              v-model="profileData.lastName"
              type="text"
              class="form-control"
              placeholder="Enter Last Name"
              required
            />
          </div>

          <!-- Country -->
          <div class="col-md-4">
            <label for="country" class="form-label">
              Country <span class="text-danger">*</span>
            </label>
            <input
              id="country"
              v-model="profileData.country"
              type="text"
              class="form-control"
              value="Pakistan"
              readonly
            />
          </div>

          <!-- Email Address -->
          <div class="col-md-6">
            <label for="email" class="form-label">
              E-mail Address <span class="text-danger">*</span>
            </label>
            <input
              id="email"
              v-model="profileData.email"
              type="email"
              class="form-control"
              placeholder="Enter E-mail Address"
              required
            />
          </div>

          <!-- Mobile Number -->
          <div class="col-md-6">
            <label for="mobile" class="form-label">
              Mobile Number <span class="text-danger">*</span>
            </label>
            <div class="input-group">
              <select class="form-select country-code-select">
                <option value="+92">+92</option>
                <option value="+1">+1</option>
                <option value="+86">+86</option>
              </select>
              <input
                id="mobile"
                v-model="profileData.mobile"
                type="tel"
                class="form-control"
                placeholder="Enter Mobile Number"
                required
              />
            </div>
            <small class="form-text text-muted">Example: 08 XX * * * * xxxx</small>
          </div>

          <!-- Address -->
          <div class="col-12">
            <label for="address" class="form-label">
              Address <span class="text-danger">*</span>
            </label>
            
            <!-- Address List -->
            <div v-if="savedAddresses.length > 0" class="address-list">
              <div
                v-for="address in savedAddresses"
                :key="address.id"
                class="address-item"
                :class="{ 'default-address': address.isDefault }"
              >
                <div class="address-content">
                  <div class="address-icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="address-details">
                    <div class="address-text">
                      {{ address.address }}, {{ address.zipCode }}, {{ address.country }}
                    </div>
                    <div class="contact-info">
                      {{ address.contact }} {{ address.countryCode }}{{ address.mobile }}
                    </div>
                  </div>
                </div>
                <div class="address-actions">
                  <div class="form-check">
                    <input
                      :id="`default-${address.id}`"
                      type="radio"
                      name="defaultAddress"
                      class="form-check-input"
                      :checked="address.isDefault"
                      @change="setAsDefault(address.id)"
                    />
                    <label :for="`default-${address.id}`" class="form-check-label">
                      Set as default
                    </label>
                  </div>
                  <div class="action-buttons">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-primary"
                      @click="editAddress(address)"
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteAddress(address.id)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Create Button -->
            <div class="address-create-container">
              <button
                type="button"
                class="btn btn-outline-success create-btn"
                @click="openAddressModal"
              >
                <i class="fas fa-plus me-2"></i>
                Create
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button type="submit" class="btn btn-success btn-lg submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>

    <!-- Address Modal Component -->
    <AddressModal
      v-if="showAddressModal"
      :show="showAddressModal"
      :editing-address="editingAddress"
      @close="closeAddressModal"
      @confirm="handleAddressConfirm"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import AddressModal from './components/AddressModal.vue'

export default {
  name: 'ProfileIndex',
  components: {
    AddressModal
  },
  setup() {
    // Profile form data
    const profileData = reactive({
      firstName: '',
      lastName: '',
      country: 'Pakistan',
      email: '',
      mobile: '',
      address: ''
    })

    // Modal state
    const showAddressModal = ref(false)
    const editingAddress = ref(null)

    // Saved addresses list
    const savedAddresses = ref([])

    // Methods
    const openAddressModal = (address = null) => {
      editingAddress.value = address
      showAddressModal.value = true
    }

    const closeAddressModal = () => {
      showAddressModal.value = false
      editingAddress.value = null
    }

    const handleAddressConfirm = (addressData) => {
      if (editingAddress.value) {
        // Edit existing address
        const index = savedAddresses.value.findIndex(addr => addr.id === editingAddress.value.id)
        if (index !== -1) {
          savedAddresses.value[index] = {
            ...addressData,
            id: editingAddress.value.id
          }
        }
      } else {
        // Add new address
        const newAddress = {
          ...addressData,
          id: Date.now() // Simple ID generation
        }
        
        // If this is the first address or marked as default, set as default
        if (savedAddresses.value.length === 0 || addressData.isDefault) {
          savedAddresses.value.forEach(addr => addr.isDefault = false)
          newAddress.isDefault = true
        }
        
        savedAddresses.value.push(newAddress)
      }
      
      closeAddressModal()
    }

    const editAddress = (address) => {
      openAddressModal(address)
    }

    const deleteAddress = (addressId) => {
      if (confirm('Are you sure you want to delete this address?')) {
        const index = savedAddresses.value.findIndex(addr => addr.id === addressId)
        if (index !== -1) {
          const wasDefault = savedAddresses.value[index].isDefault
          savedAddresses.value.splice(index, 1)
          
          // If deleted address was default, set first remaining address as default
          if (wasDefault && savedAddresses.value.length > 0) {
            savedAddresses.value[0].isDefault = true
          }
        }
      }
    }

    const setAsDefault = (addressId) => {
      savedAddresses.value.forEach(addr => {
        addr.isDefault = addr.id === addressId
      })
    }



    const handleSubmit = () => {
      console.log('Profile submitted:', profileData)
      // Handle form submission logic here
      alert('Profile updated successfully!')
    }

    return {
      profileData,
      showAddressModal,
      editingAddress,
      savedAddresses,
      openAddressModal,
      closeAddressModal,
      handleAddressConfirm,
      editAddress,
      deleteAddress,
      setAsDefault,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.profile-header {
  margin-bottom: 24px;
}

.profile-title {
  font-size: 32px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.profile-form-container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
}

.profile-form {
  width: 100%;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-control,
.form-select {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  height: 48px;
}

.input-group {
  display: flex;
  align-items: stretch;
}

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

.country-code-select {
  flex: 0 0 80px;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  height: 48px;
}

.input-group .form-control {
  flex: 1 1 auto;
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.address-list {
  margin-bottom: 16px;
}

.address-item {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
  transition: all 0.3s ease;
}

.address-item:last-child {
  margin-bottom: 0;
}

.address-item.default-address {
  border-color: #198754;
  background-color: #f8fff9;
}

.address-content {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.address-icon {
  margin-right: 12px;
  margin-top: 2px;
  color: #6c757d;
}

.address-details {
  flex: 1;
}

.address-text {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
  line-height: 1.4;
}

.contact-info {
  font-size: 14px;
  color: #6c757d;
}

.address-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons .btn {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}

.form-check {
  margin: 0;
}

.form-check-label {
  font-size: 14px;
  color: #495057;
  margin-left: 8px;
}

.address-create-container {
  display: flex;
  align-items: center;
  min-height: 48px;
}

.create-btn {
  border: 1px solid #198754;
  color: #198754;
  background: white;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background-color: #198754;
  color: white;
  transform: translateY(-1px);
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
}

.submit-btn:hover {
  background-color: #157347;
  border-color: #146c43;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
}

.form-text {
  font-size: 12px;
  margin-top: 4px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-container {
    padding: 12px;
  }
  
  .profile-form-container {
    padding: 20px;
  }
  
  .profile-title {
    font-size: 28px;
  }
  
  .submit-btn {
    width: 100%;
  }
  
  .country-code-select {
    flex: 0 0 70px;
  }
}

@media (max-width: 576px) {
  .form-actions {
    margin-top: 24px;
  }
  
  .create-btn {
    width: 100%;
    justify-content: center;
  }
  
  .address-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: flex-end;
  }
}
</style> 