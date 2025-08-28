<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="addressModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="addressModalLabel">
            Edit the consignee information
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="address-form">
            <div class="row g-3">
              <!-- Contact -->
              <div class="col-12">
                <label for="contact" class="form-label">
                  Contact <span class="text-danger">*</span>
                </label>
                <input
                  id="contact"
                  v-model="addressData.contact"
                  type="text"
                  class="form-control"
                  placeholder="Enter Contact"
                  required
                />
              </div>

              <!-- Mobile Number -->
              <div class="col-12">
                <label for="modalMobile" class="form-label">
                  Mobile Number <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <select 
                    v-model="addressData.countryCode" 
                    class="form-select country-code-select"
                  >
                    <option value="+92">+92</option>
                    <option value="+1">+1</option>
                    <option value="+86">+86</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    id="modalMobile"
                    v-model="addressData.mobile"
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
                <label for="modalAddress" class="form-label">
                  Address <span class="text-danger">*</span>
                </label>
                <textarea
                  id="modalAddress"
                  v-model="addressData.address"
                  class="form-control"
                  rows="3"
                  placeholder="xxx Street, xx District, xx City, xx Province"
                  required
                ></textarea>
              </div>

              <!-- ZIP Code and Country -->
              <div class="col-md-6">
                <label for="zipCode" class="form-label">
                  ZIP code <span class="text-danger">*</span>
                </label>
                <input
                  id="zipCode"
                  v-model="addressData.zipCode"
                  type="text"
                  class="form-control"
                  placeholder="Enter Zip Code"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="modalCountry" class="form-label">
                  Country <span class="text-danger">*</span>
                </label>
                <select
                  id="modalCountry"
                  v-model="addressData.country"
                  class="form-select"
                  required
                >
                  <option value="Pakistan">Pakistan</option>
                  <option value="United States">United States</option>
                  <option value="China">China</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                </select>
              </div>

              <!-- Set as default -->
              <div class="col-12">
                <div class="form-check">
                  <input
                    id="setDefault"
                    v-model="addressData.isDefault"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <label for="setDefault" class="form-check-label">
                    Set as default
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
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
            @click="handleConfirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div
    v-if="show"
    class="modal-backdrop fade show"
    @click="closeModal"
  ></div>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'AddressModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editingAddress: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    // Address form data
    const addressData = reactive({
      contact: '',
      countryCode: '+92',
      mobile: '',
      address: '',
      zipCode: '',
      country: 'Pakistan',
      isDefault: false
    })

    // Methods
    const closeModal = () => {
      emit('close')
    }

    const handleConfirm = () => {
      // Validate required fields
      if (!addressData.contact || !addressData.mobile || !addressData.address || !addressData.zipCode) {
        alert('Please fill in all required fields')
        return
      }

      // Create full address string
      const fullAddress = `${addressData.contact}, ${addressData.countryCode}${addressData.mobile}, ${addressData.address}, ${addressData.zipCode}, ${addressData.country}`
      
      emit('confirm', {
        ...addressData,
        fullAddress
      })
    }

    const handleSubmit = () => {
      handleConfirm()
    }



    // Reset form when modal opens/closes or load data when editing
    watch(() => props.show, (newVal) => {
      if (newVal) {
        if (props.editingAddress) {
          // Load existing address data for editing
          Object.assign(addressData, {
            contact: props.editingAddress.contact || '',
            countryCode: props.editingAddress.countryCode || '+92',
            mobile: props.editingAddress.mobile || '',
            address: props.editingAddress.address || '',
            zipCode: props.editingAddress.zipCode || '',
            country: props.editingAddress.country || 'Pakistan',
            isDefault: props.editingAddress.isDefault || false
          })
        } else {
          // Reset form data for new address
          Object.assign(addressData, {
            contact: '',
            countryCode: '+92',
            mobile: '',
            address: '',
            zipCode: '',
            country: 'Pakistan',
            isDefault: false
          })
        }
      }
    })

    return {
      addressData,
      closeModal,
      handleConfirm,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.modal.show {
  display: block !important;
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  padding: 20px 24px 16px;
  background-color: #f8f9fa;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 24px;
}

.address-form {
  width: 100%;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
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

.form-control:focus,
.form-select:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

.country-code-select {
  flex: 0 0 100px;
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

.form-text {
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
}

.form-check {
  margin-top: 12px;
}

.form-check-input {
  margin-top: 4px;
}

.form-check-label {
  font-size: 14px;
  color: #495057;
  margin-left: 8px;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 16px 24px 20px;
  background-color: #f8f9fa;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.btn {
  padding: 10px 24px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
  transform: translateY(-1px);
}

.btn-success {
  background-color: #198754;
  border-color: #198754;
}

.btn-success:hover {
  background-color: #157347;
  border-color: #146c43;
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 16px;
    max-width: calc(100% - 32px);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .country-code-select {
    flex: 0 0 80px;
  }
}

@media (max-width: 576px) {
  .modal-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}
</style> 