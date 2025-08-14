<template>
  <div class="products-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Product Management</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus me-2"></i>
        Add Product
      </button>
    </div>
    
    <!-- 产品卡片网格 -->
    <div class="row">
      <div v-for="product in products" :key="product.id" class="col-lg-4 col-md-6 mb-4">
        <div class="card product-card">
          <div class="card-img-top product-image">
            <i class="fas fa-box fa-3x"></i>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text text-muted">{{ product.description }}</p>
            <div class="product-info">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted">Price</span>
                <span class="fw-bold text-primary">${{ product.price }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted">Category</span>
                <span class="badge bg-secondary">{{ product.category }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Stock</span>
                <span :class="product.stock > 10 ? 'text-success' : 'text-danger'">
                  {{ product.stock }}
                </span>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn btn-outline-primary btn-sm" @click="editProduct(product)">
                <i class="fas fa-edit me-1"></i>
                Edit
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="deleteProduct(product.id)">
                <i class="fas fa-trash me-1"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑产品模态框 -->
    <div 
      class="modal fade show" 
      v-if="showAddModal || showEditModal"
      style="display: block;"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ showAddModal ? 'Add Product' : 'Edit Product' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Product Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="productForm.name"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Category</label>
                    <select class="form-select" v-model="productForm.category" required>
                      <option value="">Select Category</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="books">Books</option>
                      <option value="home">Home</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Price</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="productForm.price"
                      step="0.01"
                      min="0"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Stock</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="productForm.stock"
                      min="0"
                      required
                    >
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="productForm.description"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="saveProduct">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 模态框背景遮罩 -->
    <div 
      class="modal-backdrop fade show" 
      v-if="showAddModal || showEditModal"
      @click="closeModal"
    ></div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'Products',
  setup() {
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingProductId = ref(null)
    
    // 产品表单
    const productForm = reactive({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: ''
    })
    
    // 模拟产品数据
    const products = ref([
      {
        id: 1,
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: 199.99,
        stock: 50,
        description: 'High-quality wireless Bluetooth headphones with noise cancellation'
      },
      {
        id: 2,
        name: 'Smart Watch',
        category: 'Electronics',
        price: 299.99,
        stock: 30,
        description: 'Advanced fitness tracking and notification smart watch'
      },
      {
        id: 3,
        name: 'Premium T-Shirt',
        category: 'Clothing',
        price: 29.99,
        stock: 100,
        description: 'Comfortable cotton t-shirt with modern design'
      },
      {
        id: 4,
        name: 'Business Laptop',
        category: 'Electronics',
        price: 1299.99,
        stock: 15,
        description: 'Professional laptop for business and productivity'
      },
      {
        id: 5,
        name: 'Running Shoes',
        category: 'Sports',
        price: 89.99,
        stock: 75,
        description: 'Lightweight running shoes for daily training'
      },
      {
        id: 6,
        name: 'Coffee Maker',
        category: 'Home',
        price: 149.99,
        stock: 25,
        description: 'Automatic coffee maker with programmable settings'
      }
    ])
    
    // 重置表单
    const resetForm = () => {
      productForm.name = ''
      productForm.category = ''
      productForm.price = ''
      productForm.stock = ''
      productForm.description = ''
    }
    
    // 关闭模态框
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingProductId.value = null
      resetForm()
    }
    
    // 编辑产品
    const editProduct = (product) => {
      editingProductId.value = product.id
      productForm.name = product.name
      productForm.category = product.category
      productForm.price = product.price
      productForm.stock = product.stock
      productForm.description = product.description
      showEditModal.value = true
    }
    
    // 保存产品
    const saveProduct = () => {
      if (showAddModal.value) {
        // 添加新产品
        const newProduct = {
          id: Date.now(),
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          description: productForm.description
        }
        products.value.push(newProduct)
        alert('Product added successfully!')
      } else if (showEditModal.value) {
        // 编辑现有产品
        const index = products.value.findIndex(p => p.id === editingProductId.value)
        if (index !== -1) {
          products.value[index] = {
            id: editingProductId.value,
            name: productForm.name,
            category: productForm.category,
            price: parseFloat(productForm.price),
            stock: parseInt(productForm.stock),
            description: productForm.description
          }
          alert('Product updated successfully!')
        }
      }
      closeModal()
    }
    
    // 删除产品
    const deleteProduct = (id) => {
      if (confirm('Are you sure you want to delete this product?')) {
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value.splice(index, 1)
          alert('Product deleted successfully!')
        }
      }
    }
    
    return {
      products,
      showAddModal,
      showEditModal,
      productForm,
      editProduct,
      saveProduct,
      deleteProduct,
      closeModal
    }
  }
}
</script>

<style scoped>
.products-page {
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

.product-card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 12px 12px 0 0;
}

.product-info {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .col-lg-4 {
    width: 100%;
    max-width: 100%;
  }
  
  .product-card {
    margin-bottom: 20px;
    width: 100%;
    max-width: 100%;
  }
  
  .product-image {
    height: 150px;
  }
  
  .card-body {
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .product-image {
    height: 120px;
  }
  
  .card-body {
    padding: 12px;
  }
  
  .btn {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
}
</style> 