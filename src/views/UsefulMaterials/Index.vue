<template>
  <div class="useful-materials-container">
    <!-- Header Section -->
    <div class="page-header">
      <h1 class="page-title">Usefull Materials</h1>
      
      <!-- Search and Filter Section -->
      <div class="search-section">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label for="nameSearch" class="form-label">
              Name <span class="text-danger">*</span>
            </label>
            <input
              id="nameSearch"
              v-model="searchName"
              type="text"
              class="form-control"
              placeholder="Enter a picture name"
            />
          </div>
          <div class="col-md-4">
            <label for="remarkFilter" class="form-label">
              Remark <span class="text-danger">*</span>
            </label>
            <select
              id="remarkFilter"
              v-model="selectedRemark"
              class="form-select"
            >
              <option value="">Any</option>
              <option value="company-marketing">Company marketing poster</option>
              <option value="cosmetics-promotional">Cosmetics promotional poster</option>
            </select>
          </div>
          <div class="col-md-4">
            <div class="filter-buttons">
              <button
                type="button"
                class="btn btn-success me-2"
                @click="applyFilters"
              >
                Filter
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="resetFilters"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Materials Grid -->
    <div class="materials-grid">
      <div class="row g-4">
        <div
          v-for="material in filteredMaterials"
          :key="material.id"
          class="col-lg-3 col-md-4 col-sm-6"
        >
          <div class="material-card">
            <div class="material-image-container" @click="openPreview(material)">
              <img
                :src="material.image"
                :alt="material.name"
                class="material-image"
              />
              <div class="image-overlay">
                <i class="fas fa-search-plus"></i>
              </div>
            </div>
            <div class="material-info">
              <h6 class="material-title">{{ material.name }}</h6>
              <button
                class="btn btn-success btn-sm download-btn"
                @click="downloadMaterial(material)"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-container" v-if="totalPages > 1">
      <nav aria-label="Materials pagination">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
          </li>
          
          <li
            v-for="page in visiblePages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button
              class="page-link"
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Image Preview Modal -->
    <div
      class="modal fade"
      id="imagePreviewModal"
      tabindex="-1"
      aria-labelledby="imagePreviewModalLabel"
      aria-hidden="true"
      ref="previewModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="imagePreviewModalLabel">
              {{ selectedMaterial?.name }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            <img
              v-if="selectedMaterial"
              :src="selectedMaterial.image"
              :alt="selectedMaterial.name"
              class="img-fluid preview-image"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success"
              @click="downloadMaterial(selectedMaterial)"
            >
              Download
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import loginImg from '@/assets/img/login.png'

export default {
  name: 'UsefulMaterials',
  setup() {
    // Reactive data
    const searchName = ref('')
    const selectedRemark = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(8)
    const selectedMaterial = ref(null)
    const previewModal = ref(null)
    const modalInstance = ref(null)

         // Sample materials data - using login.png for all images as requested
     const materials = ref([
       {
         id: 1,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 2,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 3,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 4,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 5,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 6,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 7,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 8,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 9,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 10,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 11,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 12,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 13,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 14,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 15,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 16,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 17,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 18,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 19,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 20,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 21,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 22,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 23,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 24,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 25,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 26,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       },
       {
         id: 27,
         name: 'Company marketing poster',
         image: loginImg,
         category: 'company-marketing'
       },
       {
         id: 28,
         name: 'Cosmetics promotional poster',
         image: loginImg,
         category: 'cosmetics-promotional'
       }
     ])

    // Computed properties
    const filteredMaterials = computed(() => {
      let filtered = materials.value

      // Filter by name
      if (searchName.value.trim()) {
        filtered = filtered.filter(material =>
          material.name.toLowerCase().includes(searchName.value.toLowerCase())
        )
      }

      // Filter by remark/category
      if (selectedRemark.value) {
        filtered = filtered.filter(material =>
          material.category === selectedRemark.value
        )
      }

      // Apply pagination
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filtered.slice(start, end)
    })

    const totalPages = computed(() => {
      let filtered = materials.value

      if (searchName.value.trim()) {
        filtered = filtered.filter(material =>
          material.name.toLowerCase().includes(searchName.value.toLowerCase())
        )
      }

      if (selectedRemark.value) {
        filtered = filtered.filter(material =>
          material.category === selectedRemark.value
        )
      }

      return Math.ceil(filtered.length / itemsPerPage.value)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value

      if (total <= 5) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 3) {
          pages.push(1, 2, 3, 4, 5)
        } else if (current >= total - 2) {
          pages.push(total - 4, total - 3, total - 2, total - 1, total)
        } else {
          pages.push(current - 2, current - 1, current, current + 1, current + 2)
        }
      }

      return pages
    })

    // Methods
    const applyFilters = () => {
      currentPage.value = 1
    }

    const resetFilters = () => {
      searchName.value = ''
      selectedRemark.value = ''
      currentPage.value = 1
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const openPreview = (material) => {
      selectedMaterial.value = material
      if (modalInstance.value) {
        modalInstance.value.show()
      }
    }

    const downloadMaterial = (material) => {
      // Create a temporary link element and trigger download
      const link = document.createElement('a')
      link.href = material.image
      link.download = `${material.name.replace(/\s+/g, '_')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    onMounted(() => {
      // Initialize Bootstrap modal
      if (previewModal.value) {
        modalInstance.value = new Modal(previewModal.value)
      }
    })

    return {
      searchName,
      selectedRemark,
      currentPage,
      selectedMaterial,
      previewModal,
      filteredMaterials,
      totalPages,
      visiblePages,
      applyFilters,
      resetFilters,
      changePage,
      openPreview,
      downloadMaterial
    }
  }
}
</script>

<style scoped>
.useful-materials-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

.search-section {
  margin-top: 20px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.materials-grid {
  margin-bottom: 32px;
}

.material-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.material-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.material-image-container {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  cursor: pointer;
}

.material-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.material-image-container:hover .image-overlay {
  opacity: 1;
}

.material-image-container:hover .material-image {
  transform: scale(1.05);
}

.image-overlay i {
  color: white;
  font-size: 24px;
}

.material-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.material-title {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin: 0;
  line-height: 1.4;
}

.download-btn {
  align-self: flex-start;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
}

.pagination-container {
  margin-top: 32px;
}

.pagination .page-link {
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 8px 12px;
}

.pagination .page-item.active .page-link {
  background-color: #198754;
  border-color: #198754;
  color: white;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #495057;
}

.preview-image {
  max-height: 70vh;
  border-radius: 8px;
}

.modal-content {
  border-radius: 12px;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  padding: 16px 24px;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 16px 24px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .useful-materials-container {
    padding: 12px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .filter-buttons {
    flex-direction: column;
  }
  
  .filter-buttons .btn {
    width: 100%;
  }
  
  .material-info {
    padding: 12px;
  }
  
  .modal-dialog {
    margin: 16px;
  }
}

@media (max-width: 576px) {
  .materials-grid .col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style> 