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
        path: 'plan',
        name: 'Plan',
        component: () => import('@/views/Plan/Index.vue'),
        meta: { title: 'plan' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products/Index.vue'),
        meta: { title: 'products' }
      },
      {
        path: 'pv-bv-log',
        name: 'PvBvLog',
        component: () => import('@/views/PvBvLog/Index.vue'),
        meta: { title: 'pv-bv-log' }
      },
      {
        path: 'bonus',
        name: 'Bonus',
        component: () => import('@/views/Bonus/Index.vue'),
        meta: { title: 'bonus' }
      },
      {
        path: 'referrals',
        name: 'Referrals',
        component: () => import('@/views/Referrals/Index.vue'),
        meta: { title: 'referrals' }
      },
      {
        path: 'network',
        name: 'Network',
        component: () => import('@/views/Network/Index.vue'),
        meta: { title: 'network' }
      },
      {
        path: 'deposit-offline',
        name: 'DepositOffline',
        component: () => import('@/views/DepositOffline/Index.vue'),
        meta: { title: 'deposit-offline' }
      },
      {
        path: 'withdraw',
        name: 'Withdraw',
        component: () => import('@/views/Withdraw/Index.vue'),
        meta: { title: 'withdraw' }
      },
      {
        path: 'balance-transfer',
        name: 'BalanceTransfer',
        component: () => import('@/views/BalanceTransfer/Index.vue'),
        meta: { title: 'balance-transfer' }
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: () => import('@/views/Transactions/Index.vue'),
        meta: { title: 'transactions' }
      },
      {
        path: 'support-ticket',
        name: 'SupportTicket',
        component: () => import('@/views/SupportTicket/Index.vue'),
        meta: { title: 'support-ticket' }
      },
      {
        path: 'useful-materials',
        name: 'UsefulMaterials',
        component: () => import('@/views/UsefulMaterials/Index.vue'),
        meta: { title: 'useful-materials' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile/Index.vue'),
        meta: { title: 'profile' }
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: () => import('@/views/ChangePassword/Index.vue'),
        meta: { title: 'change-password' }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/Cart/Index.vue'),
        meta: { title: 'cart' }
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