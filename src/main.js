import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// MDBootstrap 和 Bootstrap CSS
import 'mdb-vue-ui-kit/css/mdb.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 自定义样式
import './assets/scss/main.scss'

// 移动端优化工具
import { initMobileOptimization } from './utils/mobile.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 初始化移动端优化
initMobileOptimization()

app.mount('#app') 