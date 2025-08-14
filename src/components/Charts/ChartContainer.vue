<template>
  <div class="chart-container">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">{{ title }}</h5>
        <div class="chart-actions" v-if="showActions">
          <button class="btn btn-sm btn-outline-secondary" @click="refreshChart">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="chart-wrapper">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartContainer',
  props: {
    title: {
      type: String,
      required: true
    },
    showActions: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const refreshChart = () => {
      emit('refresh')
    }
    
    return {
      refreshChart
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  height: 100%;
}

.card-header {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  padding: 20px;
  height: calc(100% - 80px);
}

.chart-wrapper {
  height: 100%;
  min-height: 300px;
  width: 100%;
  overflow: hidden;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  min-width: 32px;
}

@media (max-width: 768px) {
  .card-header {
    padding: 15px;
  }
  
  .card-body {
    padding: 15px;
  }
  
  .chart-wrapper {
    min-height: 250px;
  }
}

@media (max-width: 576px) {
  .card-header {
    padding: 12px;
  }
  
  .card-body {
    padding: 12px;
  }
  
  .chart-wrapper {
    min-height: 200px;
  }
}
</style> 