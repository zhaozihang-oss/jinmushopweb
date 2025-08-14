import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/Index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/Index.vue'),
        meta: { title: 'dashboard' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users/Index.vue'),
        meta: { title: 'users' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products/Index.vue'),
        meta: { title: 'products' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders/Index.vue'),
        meta: { title: 'orders' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings/Index.vue'),
        meta: { title: 'settings' }
      },
      {
        path: 'mobile-debug',
        name: 'MobileDebug',
        component: () => import('@/views/MobileDebug/Index.vue'),
        meta: { title: 'mobile-debug' }
      }
    ]
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFound/Index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 