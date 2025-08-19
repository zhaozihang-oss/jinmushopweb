<template>
  <div class="data-card" :class="cardClass">
    <div class="card-header">
      <div class="card-icon-wrapper">
        <div class="card-icon" :style="{ backgroundColor: iconBgColor }">
          <i :class="icon" :style="{ color: iconColor }"></i>
        </div>
      </div>
      <div class="card-title">{{ title }}</div>
    </div>
    
    <div class="card-content">
      <div class="main-value">{{ mainValue }}</div>
      <div class="sub-stats">
        <div class="stat-item" v-for="stat in subStats" :key="stat.label">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value" :style="{ color: stat.color || '#666' }">{{ stat.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCard',
  props: {
    title: {
      type: String,
      required: true
    },
    mainValue: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: 'fas fa-chart-bar'
    },
    iconColor: {
      type: String,
      default: '#fff'
    },
    iconBgColor: {
      type: String,
      default: '#667eea'
    },
    subStats: {
      type: Array,
      default: () => []
    },
    cardClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.data-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
}

.card-icon-wrapper {
  display: flex;
  align-items: center;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 10px;
}

.card-title {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  flex: 1;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.2;
}

.sub-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-card {
    padding: 15px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .card-icon-wrapper {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-title {
    margin: 0;
  }
  
  .main-value {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .sub-stats {
    gap: 10px;
  }
  
  .stat-item {
    min-width: 80px;
  }
}

@media (max-width: 576px) {
  .data-card {
    padding: 12px;
  }
  
  .main-value {
    font-size: 20px;
  }
  
  .card-icon {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
  
  .sub-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .stat-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .stat-label {
    margin-bottom: 0;
  }
}
</style> 