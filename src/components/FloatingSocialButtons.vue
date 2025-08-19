<template>
  <div class="floating-social-buttons" :class="{ 'expanded': isExpanded }">
    <!-- 主按钮 -->
    <div class="main-button" @click="toggleExpanded">
      <i class="fas fa-headphones"></i>
    </div>
    
    <!-- 社交媒体按钮列表 -->
    <div class="social-buttons-list" v-show="isExpanded">
      <a 
        v-for="(social, index) in visibleSocials" 
        :key="social.name"
        :href="social.url || '#'" 
        :class="['social-btn', social.name.toLowerCase()]"
        :target="social.url ? '_blank' : '_self'"
        :style="{ 'animation-delay': `${index * 0.1}s` }"
        @click="handleSocialClick(social)"
      >
        <i :class="social.icon"></i>
        <span class="social-label">{{ social.label }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingSocialButtons',
  props: {
    socials: {
      type: Array,
      default: () => [
        {
          name: 'twitter',
          label: 'Twitter',
          icon: 'fab fa-twitter',
          url: '',
          visible: true
        },
        {
          name: 'wechat',
          label: 'WeChat',
          icon: 'fab fa-weixin',
          url: '',
          visible: true
        },
        {
          name: 'facebook',
          label: 'Facebook',
          icon: 'fab fa-facebook',
          url: '',
          visible: true
        }
      ]
    },
    position: {
      type: String,
      default: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
      validator: (value) => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
    }
  },
  emits: ['social-click'],
  data() {
    return {
      isExpanded: false
    }
  },
  computed: {
    visibleSocials() {
      return this.socials.filter(social => social.visible !== false)
    }
  },
  methods: {
    toggleExpanded() {
      this.isExpanded = !this.isExpanded
    },
    handleSocialClick(social) {
      this.$emit('social-click', social)
      
      // 如果没有 URL，阻止默认行为
      if (!social.url) {
        event.preventDefault()
      }
      
      // 点击后收起菜单
      this.isExpanded = false
    },
    // 点击外部区域收起菜单
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isExpanded = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.floating-social-buttons {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.main-button {
  width: 56px;
  height: 56px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #fff;
  font-size: 20px;
}

.main-button:hover {
  transform: scale(1.1);
  background: #555;
}

.expanded .main-button {
  transform: rotate(45deg);
  background: #ff4757;
}

.social-buttons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
  align-items: flex-end;
}

.social-btn {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: slideInRight 0.3s ease forwards;
  opacity: 0;
  transform: translateX(20px);
  white-space: nowrap;
  font-size: 14px;
}

@keyframes slideInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.social-btn i {
  margin-right: 8px;
  font-size: 16px;
  width: 16px;
  text-align: center;
}

.social-label {
  font-size: 14px;
}

.social-btn.twitter {
  background: #1da1f2;
}

.social-btn.twitter:hover {
  background: #0d8bd9;
  transform: translateY(-2px);
  color: #fff;
}

.social-btn.wechat {
  background: #07c160;
}

.social-btn.wechat:hover {
  background: #06ad56;
  transform: translateY(-2px);
  color: #fff;
}

.social-btn.facebook {
  background: #4267b2;
}

.social-btn.facebook:hover {
  background: #365899;
  transform: translateY(-2px);
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-social-buttons {
    bottom: 20px;
    right: 20px;
  }
  
  .main-button {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
  
  .social-btn {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .social-btn i {
    font-size: 14px;
  }
  
  .social-label {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .floating-social-buttons {
    bottom: 15px;
    right: 15px;
  }
  
  .main-button {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
  
  .social-btn {
    padding: 8px 12px;
  }
  
  .social-buttons-list {
    gap: 10px;
    margin-bottom: 12px;
  }
}

/* 不同位置的样式 */
.floating-social-buttons.position-bottom-left {
  left: 30px;
  right: auto;
  align-items: flex-start;
}

.floating-social-buttons.position-top-right {
  top: 30px;
  bottom: auto;
}

.floating-social-buttons.position-top-left {
  top: 30px;
  left: 30px;
  right: auto;
  bottom: auto;
  align-items: flex-start;
}

.floating-social-buttons.position-top-right .social-buttons-list,
.floating-social-buttons.position-top-left .social-buttons-list {
  margin-bottom: 0;
  margin-top: 15px;
  flex-direction: column-reverse;
}
</style> 