// 移动端检测和优化工具函数

// 检测是否为移动设备
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 检测是否为iOS设备
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

// 检测是否为Android设备
export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent)
}

// 检测是否为微信浏览器
export const isWeChat = () => {
  return /micromessenger/i.test(navigator.userAgent.toLowerCase())
}

// 获取屏幕尺寸类型
export const getScreenSize = () => {
  const width = window.innerWidth
  if (width >= 1200) return 'xl'
  if (width >= 992) return 'lg'
  if (width >= 768) return 'md'
  if (width >= 576) return 'sm'
  return 'xs'
}

// 禁用页面缩放
export const disableZoom = () => {
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault()
  })
  
  document.addEventListener('gesturechange', (e) => {
    e.preventDefault()
  })
  
  document.addEventListener('gestureend', (e) => {
    e.preventDefault()
  })
}

// 防止页面滚动
export const preventScroll = (element) => {
  if (element) {
    element.addEventListener('touchmove', (e) => {
      e.preventDefault()
    }, { passive: false })
  }
}

// 修复移动端100vh问题
export const fixMobileViewport = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  
  window.addEventListener('resize', () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  })
}

// 优化点击区域
export const optimizeClickArea = (element, minSize = 44) => {
  if (element) {
    const rect = element.getBoundingClientRect()
    if (rect.width < minSize || rect.height < minSize) {
      element.style.minWidth = `${minSize}px`
      element.style.minHeight = `${minSize}px`
      element.style.display = 'flex'
      element.style.alignItems = 'center'
      element.style.justifyContent = 'center'
    }
  }
}

// 处理iOS的底部安全区域
export const handleSafeArea = () => {
  if (isIOS()) {
    const safeAreaBottom = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom')
    if (safeAreaBottom) {
      document.documentElement.style.setProperty('--safe-area-bottom', safeAreaBottom)
    }
  }
}

// 初始化移动端优化
export const initMobileOptimization = () => {
  if (isMobile()) {
    disableZoom()
    fixMobileViewport()
    handleSafeArea()
    
    // 移除300ms点击延迟
    document.addEventListener('touchstart', () => {}, { passive: true })
    
    // 优化滚动性能
    document.body.style.webkitOverflowScrolling = 'touch'
    document.body.style.overflowScrolling = 'touch'
  }
}

// 响应式断点
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
}

// 媒体查询匹配
export const matchMedia = (query) => {
  return window.matchMedia(query).matches
}

// 获取设备像素比
export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1
}

// 检测是否支持触摸
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 处理移动端键盘弹出
export const handleKeyboard = (callback) => {
  let initialHeight = window.innerHeight
  
  window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight
    const heightDiff = initialHeight - currentHeight
    
    if (heightDiff > 150) {
      // 键盘弹出
      callback && callback(true, heightDiff)
    } else {
      // 键盘收起
      callback && callback(false, 0)
    }
  })
}

export default {
  isMobile,
  isIOS,
  isAndroid,
  isWeChat,
  getScreenSize,
  disableZoom,
  preventScroll,
  fixMobileViewport,
  optimizeClickArea,
  handleSafeArea,
  initMobileOptimization,
  breakpoints,
  matchMedia,
  getDevicePixelRatio,
  isTouchDevice,
  handleKeyboard
} 