import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage或sessionStorage获取token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      sessionStorage.removeItem('userInfo')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 登录API
export const loginAPI = async (loginData) => {
  try {
    // 在实际项目中，这里应该调用真实的API
    // const response = await api.post('/auth/login', loginData)
    
    // 模拟API调用
    return await mockLoginAPI(loginData)
  } catch (error) {
    throw error
  }
}

// 模拟登录API
const mockLoginAPI = async (loginData) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 模拟验证逻辑
  if (loginData.memberId === 'admin' && loginData.password === 'admin') {
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        memberId: loginData.memberId,
        name: 'Administrator',
        email: 'admin@example.com',
        role: 'admin'
      },
      message: 'Login successful'
    }
  } else {
    return {
      success: false,
      message: 'Invalid member ID or password'
    }
  }
}

// 获取用户信息API
export const getUserInfoAPI = async () => {
  try {
    // 在实际项目中，这里应该调用真实的API
    // const response = await api.get('/user/profile')
    
    // 模拟API调用
    return await mockGetUserInfoAPI()
  } catch (error) {
    throw error
  }
}

// 模拟获取用户信息API
const mockGetUserInfoAPI = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    user: {
      id: 1,
      memberId: 'admin',
      name: 'Administrator',
      email: 'admin@example.com',
      role: 'admin',
      avatar: null
    }
  }
}

// 登出API
export const logoutAPI = async () => {
  try {
    // 在实际项目中，这里应该调用真实的API
    // const response = await api.post('/auth/logout')
    
    // 模拟API调用
    return await mockLogoutAPI()
  } catch (error) {
    throw error
  }
}

// 模拟登出API
const mockLogoutAPI = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    message: 'Logout successful'
  }
}

export default api 