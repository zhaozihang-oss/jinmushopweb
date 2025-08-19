<template>
  <div class="pagination-wrapper" :class="{ 'mobile': isMobile }">
    <div class="pagination">
      <button 
        class="pagination-btn prev-btn" 
        :disabled="currentPage <= 1"
        @click="handlePageChange(currentPage - 1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          class="pagination-btn page-btn"
          :class="{ 'active': page === currentPage }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="pagination-btn next-btn" 
        :disabled="currentPage >= totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      
      if (props.totalPages <= maxVisible) {
        for (let i = 1; i <= props.totalPages; i++) {
          pages.push(i)
        }
      } else {
        let start = Math.max(1, props.currentPage - 2)
        let end = Math.min(props.totalPages, start + maxVisible - 1)
        
        if (end - start < maxVisible - 1) {
          start = Math.max(1, end - maxVisible + 1)
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }
      
      return pages
    })
    
    const handlePageChange = (page) => {
      if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit('page-change', page)
      }
    }
    
    return {
      visiblePages,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  border: none;
  background: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
  color: #28a745;
}

.pagination-btn.active {
  background-color: #28a745;
  color: white;
  font-weight: 600;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.prev-btn, .next-btn {
  color: #6c757d;
}

.prev-btn:hover:not(:disabled), 
.next-btn:hover:not(:disabled) {
  background-color: #e9ecef;
  color: #495057;
}

/* Mobile styles */
.pagination-wrapper.mobile .pagination {
  gap: 4px;
}

.pagination-wrapper.mobile .pagination-btn {
  padding: 6px 10px;
  font-size: 13px;
  min-width: 32px;
  height: 32px;
}

.pagination-wrapper.mobile .page-numbers {
  gap: 2px;
}

@media (max-width: 576px) {
  .pagination-wrapper.mobile .pagination-btn {
    padding: 4px 8px;
    font-size: 12px;
    min-width: 28px;
    height: 28px;
  }
}
</style> 