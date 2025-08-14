<template>
  <div class="mobile-debug-page">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">移动端调试工具</h5>
            </div>
            <div class="card-body">
              <div class="alert alert-info">
                <h6>当前屏幕信息</h6>
                <ul class="mb-0">
                  <li>屏幕宽度: {{ screenWidth }}px</li>
                  <li>屏幕高度: {{ screenHeight }}px</li>
                  <li>设备像素比: {{ devicePixelRatio }}</li>
                  <li>是否移动设备: {{ isMobileDevice ? '是' : '否' }}</li>
                </ul>
              </div>
              
              <!-- 测试不同宽度的元素 -->
              <div class="mb-4">
                <h6>宽度测试</h6>
                <div class="test-box" style="width: 100px; background: #ff6b6b;">100px</div>
                <div class="test-box" style="width: 200px; background: #4ecdc4;">200px</div>
                <div class="test-box" style="width: 300px; background: #45b7d1;">300px</div>
                <div class="test-box" style="width: 400px; background: #f9ca24;">400px</div>
                <div class="test-box" style="width: 500px; background: #f0932b;">500px</div>
                <div class="test-box" style="width: 100%; background: #eb4d4b;">100%</div>
              </div>
              
              <!-- 测试表格 -->
              <div class="mb-4">
                <h6>表格测试</h6>
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>名称</th>
                        <th>描述</th>
                        <th>价格</th>
                        <th>状态</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>产品名称很长很长很长很长</td>
                        <td>这是一个很长的描述文本这是一个很长的描述文本</td>
                        <td>¥999.99</td>
                        <td><span class="badge bg-success">在售</span></td>
                        <td>
                          <button class="btn btn-sm btn-primary">编辑</button>
                          <button class="btn btn-sm btn-danger">删除</button>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>另一个产品</td>
                        <td>简短描述</td>
                        <td>¥199.99</td>
                        <td><span class="badge bg-warning">缺货</span></td>
                        <td>
                          <button class="btn btn-sm btn-primary">编辑</button>
                          <button class="btn btn-sm btn-danger">删除</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- 测试卡片 -->
              <div class="mb-4">
                <h6>卡片测试</h6>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title">卡片标题</h5>
                        <p class="card-text">这是一个测试卡片的内容文本。</p>
                        <a href="#" class="btn btn-primary">按钮</a>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title">很长的卡片标题很长的卡片标题</h5>
                        <p class="card-text">这是一个很长的卡片内容文本，用来测试文本是否会超出卡片边界。</p>
                        <a href="#" class="btn btn-primary">按钮</a>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title">图片卡片</h5>
                        <img src="https://via.placeholder.com/300x200" class="img-fluid" alt="测试图片">
                        <p class="card-text">包含图片的卡片</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 测试按钮 -->
              <div class="mb-4">
                <h6>按钮测试</h6>
                <div class="btn-group-vertical d-md-none">
                  <button class="btn btn-primary">移动端垂直按钮</button>
                  <button class="btn btn-secondary">移动端垂直按钮</button>
                  <button class="btn btn-success">移动端垂直按钮</button>
                </div>
                <div class="btn-group d-none d-md-block">
                  <button class="btn btn-primary">桌面端水平按钮</button>
                  <button class="btn btn-secondary">桌面端水平按钮</button>
                  <button class="btn btn-success">桌面端水平按钮</button>
                </div>
              </div>
              
              <!-- 测试表单 -->
              <div class="mb-4">
                <h6>表单测试</h6>
                <form>
                  <div class="mb-3">
                    <label class="form-label">普通输入框</label>
                    <input type="text" class="form-control" placeholder="请输入内容">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">很长的标签名称很长的标签名称很长的标签名称</label>
                    <input type="text" class="form-control" placeholder="很长的占位符文本很长的占位符文本很长的占位符文本">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">选择框</label>
                    <select class="form-select">
                      <option>选项1</option>
                      <option>很长的选项名称很长的选项名称很长的选项名称</option>
                      <option>选项3</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="flexCheckDefault">
                      <label class="form-check-label" for="flexCheckDefault">
                        复选框测试很长的标签文本很长的标签文本
                      </label>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">提交</button>
                </form>
              </div>
              
              <!-- 测试文本 -->
              <div class="mb-4">
                <h6>文本测试</h6>
                <p>这是一个普通的段落文本。</p>
                <p>这是一个很长的段落文本，用来测试文本是否会自动换行，以及是否会超出容器边界。这是一个很长的段落文本，用来测试文本是否会自动换行，以及是否会超出容器边界。</p>
                <p>这是一个包含很长单词的文本：supercalifragilisticexpialidocious这是一个包含很长单词的文本。</p>
                <p class="text-truncate">这是一个被截断的文本，它应该以省略号结尾，而不是超出容器边界。</p>
              </div>
              
              <!-- 测试结果 -->
              <div class="mb-4">
                <h6>检测结果</h6>
                <div class="alert" :class="hasOverflow ? 'alert-danger' : 'alert-success'">
                  <strong>{{ hasOverflow ? '发现溢出问题' : '未发现溢出问题' }}</strong>
                  <div v-if="hasOverflow">
                    <p class="mb-0">页面宽度: {{ pageWidth }}px</p>
                    <p class="mb-0">屏幕宽度: {{ screenWidth }}px</p>
                    <p class="mb-0">是否有横向滚动: {{ hasHorizontalScroll ? '是' : '否' }}</p>
                  </div>
                </div>
              </div>
              
              <button class="btn btn-primary" @click="checkOverflow">重新检测</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'MobileDebug',
  setup() {
    const screenWidth = ref(window.innerWidth)
    const screenHeight = ref(window.innerHeight)
    const devicePixelRatio = ref(window.devicePixelRatio || 1)
    const isMobileDevice = ref(false)
    const hasOverflow = ref(false)
    const pageWidth = ref(0)
    const hasHorizontalScroll = ref(false)
    
    // 检测是否为移动设备
    const detectMobileDevice = () => {
      isMobileDevice.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    
    // 检测溢出
    const checkOverflow = () => {
      pageWidth.value = document.documentElement.scrollWidth
      hasHorizontalScroll.value = pageWidth.value > screenWidth.value
      hasOverflow.value = hasHorizontalScroll.value
    }
    
    // 更新屏幕信息
    const updateScreenInfo = () => {
      screenWidth.value = window.innerWidth
      screenHeight.value = window.innerHeight
      checkOverflow()
    }
    
    onMounted(() => {
      detectMobileDevice()
      updateScreenInfo()
      window.addEventListener('resize', updateScreenInfo)
      
      // 延迟检测，确保页面完全加载
      setTimeout(checkOverflow, 1000)
    })
    
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateScreenInfo)
    })
    
    return {
      screenWidth,
      screenHeight,
      devicePixelRatio,
      isMobileDevice,
      hasOverflow,
      pageWidth,
      hasHorizontalScroll,
      checkOverflow
    }
  }
}
</script>

<style scoped>
.mobile-debug-page {
  min-height: 100vh;
  padding: 20px 0;
}

.test-box {
  margin: 10px 0;
  padding: 10px;
  color: white;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
}

.btn-group-vertical .btn {
  margin-bottom: 5px;
}

.btn-group-vertical .btn:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .mobile-debug-page {
    padding: 10px 0;
  }
  
  .test-box {
    font-size: 14px;
    padding: 8px;
  }
}
</style> 