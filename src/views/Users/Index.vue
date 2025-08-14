<template>
  <div class="users-page">
    <!-- 页面标题和操作按钮 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>User Management</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus me-2"></i>
        Add User
      </button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                v-model="searchTerm"
                placeholder="Search"
              >
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="selectedRole">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary" @click="resetFilters">
              <i class="fas fa-refresh me-2"></i>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 用户列表 -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="user-avatar me-3">
                      <i class="fas fa-user"></i>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ user.name }}</div>
                      <div class="text-muted small">{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>
                  <span class="badge bg-primary">{{ user.role }}</span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <span 
                    class="badge"
                    :class="user.status === 'active' ? 'bg-success' : 'bg-danger'"
                  >
                    {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button 
                      class="btn btn-outline-primary btn-sm"
                      @click="editUser(user)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger btn-sm"
                      @click="deleteUser(user.id)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 用户表单模态框 -->
    <div 
      class="modal fade show" 
      v-if="showAddModal || showEditModal"
      style="display: block;"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ showAddModal ? 'Add User' : 'Edit User' }}
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="userForm.name"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="userForm.email"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input 
                  type="tel" 
                  class="form-control" 
                  v-model="userForm.phone"
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Role</label>
                <select class="form-select" v-model="userForm.role" required>
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" v-model="userForm.status" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeModal"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="saveUser"
            >
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
import { ref, computed, reactive } from 'vue'

export default {
  name: 'Users',
  setup() {
    const searchTerm = ref('')
    const selectedRole = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingUserId = ref(null)
    
    // 用户表单
    const userForm = reactive({
      name: '',
      email: '',
      phone: '',
      role: '',
      status: 'active'
    })
    
    // 模拟用户数据
    const users = ref([
      {
        id: 1,
        name: 'John Doe',
        username: 'john_doe',
        email: 'john@example.com',
        phone: '+1234567890',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2023-01-15')
      },
      {
        id: 2,
        name: 'Jane Smith',
        username: 'jane_smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        role: 'user',
        status: 'active',
        createdAt: new Date('2023-02-20')
      },
      {
        id: 3,
        name: 'Bob Johnson',
        username: 'bob_johnson',
        email: 'bob@example.com',
        phone: '+1234567892',
        role: 'editor',
        status: 'inactive',
        createdAt: new Date('2023-03-10')
      },
      {
        id: 4,
        name: 'Alice Wilson',
        username: 'alice_wilson',
        email: 'alice@example.com',
        phone: '+1234567893',
        role: 'user',
        status: 'active',
        createdAt: new Date('2023-04-05')
      },
      {
        id: 5,
        name: 'Charlie Brown',
        username: 'charlie_brown',
        email: 'charlie@example.com',
        phone: '+1234567894',
        role: 'editor',
        status: 'active',
        createdAt: new Date('2023-05-12')
      }
    ])
    
    // 过滤用户
    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        const matchesSearch = !searchTerm.value || 
          user.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
        
        const matchesRole = !selectedRole.value || user.role === selectedRole.value
        
        return matchesSearch && matchesRole
      })
    })
    
    // 格式化日期
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)
    }
    
    // 重置筛选
    const resetFilters = () => {
      searchTerm.value = ''
      selectedRole.value = ''
    }
    
    // 重置表单
    const resetForm = () => {
      userForm.name = ''
      userForm.email = ''
      userForm.phone = ''
      userForm.role = ''
      userForm.status = 'active'
    }
    
    // 关闭模态框
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingUserId.value = null
      resetForm()
    }
    
    // 编辑用户
    const editUser = (user) => {
      editingUserId.value = user.id
      userForm.name = user.name
      userForm.email = user.email
      userForm.phone = user.phone
      userForm.role = user.role
      userForm.status = user.status
      showEditModal.value = true
    }
    
    // 保存用户
    const saveUser = () => {
      if (showAddModal.value) {
        // 添加新用户
        const newUser = {
          id: Date.now(),
          name: userForm.name,
          username: userForm.name.toLowerCase().replace(/\s+/g, '_'),
          email: userForm.email,
          phone: userForm.phone,
          role: userForm.role,
          status: userForm.status,
          createdAt: new Date()
        }
        users.value.push(newUser)
        alert('User added successfully!')
      } else if (showEditModal.value) {
        // 编辑现有用户
        const index = users.value.findIndex(u => u.id === editingUserId.value)
        if (index !== -1) {
          users.value[index] = {
            ...users.value[index],
            name: userForm.name,
            email: userForm.email,
            phone: userForm.phone,
            role: userForm.role,
            status: userForm.status
          }
          alert('User updated successfully!')
        }
      }
      closeModal()
    }
    
    // 删除用户
    const deleteUser = (id) => {
      if (confirm('Are you sure you want to delete this user?')) {
        const index = users.value.findIndex(u => u.id === id)
        if (index !== -1) {
          users.value.splice(index, 1)
          alert('User deleted successfully!')
        }
      }
    }
    
    return {
      users,
      searchTerm,
      selectedRole,
      currentPage,
      pageSize,
      showAddModal,
      showEditModal,
      userForm,
      filteredUsers,
      formatDate,
      resetFilters,
      editUser,
      saveUser,
      deleteUser,
      closeModal
    }
  }
}
</script>

<style scoped>
.users-page {
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

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.table th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

.btn-group .btn {
  border: none;
  margin: 0 2px;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-bottom: 1px solid #eee;
  padding: 20px;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  border-top: 1px solid #eee;
  padding: 20px;
}

.pagination .page-link {
  border: none;
  border-radius: 8px;
  margin: 0 2px;
  color: #667eea;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .user-avatar {
    width: 30px;
    height: 30px;
  }
  
  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}
</style> 