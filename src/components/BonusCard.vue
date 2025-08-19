<template>
  <div class="bonus-card" :class="cardClass">
    <div class="card-header">
      <div class="card-title">{{ title }}</div>
      <div class="card-icon" :style="{ backgroundColor: iconBgColor }">
        <i :class="icon" :style="{ color: iconColor }"></i>
      </div>
    </div>
    
    <div class="card-content">
      <div class="bonus-amount">{{ formatAmount(amount) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BonusCard',
  props: {
    title: {
      type: String,
      required: true
    },
    amount: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: 'fas fa-dollar-sign'
    },
    iconColor: {
      type: String,
      default: '#fff'
    },
    iconBgColor: {
      type: String,
      default: '#667eea'
    },
    cardClass: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: '$'
    }
  },
  methods: {
    formatAmount(amount) {
      if (typeof amount === 'string' && amount.startsWith('$')) {
        return amount;
      }
      return `${this.currency}${Number(amount).toLocaleString()}`;
    }
  }
}
</script>

<style scoped>
.bonus-card {
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

.bonus-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
}

.card-title {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  flex: 1;
  margin-right: 10px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.bonus-amount {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bonus-card {
    padding: 15px;
  }
  
  .card-header {
    margin-bottom: 10px;
  }
  
  .bonus-amount {
    font-size: 24px;
  }
  
  .card-icon {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .bonus-card {
    padding: 12px;
  }
  
  .bonus-amount {
    font-size: 20px;
  }
  
  .card-title {
    font-size: 13px;
  }
  
  .card-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style> 