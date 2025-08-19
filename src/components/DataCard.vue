<template>
  <div class="data-card" :class="cardClass">
    <!-- 标题和图标在同一行 -->
    <div class="card-header">
      <div>
        <div class="card-title">{{ title }}</div>
      <div class="main-value">{{ mainValue }}</div>
      </div>
      <div class="card-icon" :style="{ backgroundColor: iconBgColor }">
        <i :class="icon" :style="{ color: iconColor }"></i>
      </div>
    </div>
    
    <!-- 主数值 -->
   
    
    <!-- 分隔线 -->
    <!-- <div class="divider"></div> -->
    
    <!-- 底部统计信息 -->
    <div class="sub-stats">
      <div class="stat-item" v-for="stat in subStats" :key="stat.label">
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value" :style="{ color: stat.color || '#28a745' }">{{ stat.value }}</span>
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
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
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

/* 标题和图标在同一行 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-title {
  color: #999;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  flex: 1;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  opacity: 0.8;
}

/* 主数值样式 */
.main-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.2;
}

/* 分隔线 */
.divider {
  height: 1px;
  background: #e9ecef;
  margin-bottom: 15px;
}

/* 底部统计信息 */
.sub-stats {
  display: flex;
  gap: 30px;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #28a745;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-card {
    padding: 16px;
  }
  
  .card-header {
    margin-bottom: 16px;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .main-value {
    font-size: 28px;
    margin-bottom: 16px;
  }
  
  .sub-stats {
    gap: 20px;
  }
}

@media (max-width: 576px) {
  .data-card {
    padding: 14px;
  }
  
  .card-header {
    margin-bottom: 14px;
  }
  
  .card-title {
    font-size: 13px;
  }
  
  .card-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .main-value {
    font-size: 24px;
    margin-bottom: 14px;
  }
  
  .sub-stats {
    gap: 16px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .stat-value {
    font-size: 13px;
  }
}
</style> 