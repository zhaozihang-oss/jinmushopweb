# MessageToast 全局消息提示组件

## 功能特点

- 显示在页面最顶部
- 支持成功、错误、警告、信息四种状态
- 自动消失（默认3秒）或手动关闭
- 全局状态管理，任何组件都可以调用
- 响应式设计，支持移动端

## 使用方法

### 1. 在任何组件中引入 useMessage

```javascript
import { useMessage } from '@/composables/useMessage'

export default {
  setup() {
    const { showSuccess, showError, showWarning, showInfo } = useMessage()
    
    // 使用示例
    const handleSuccess = () => {
      showSuccess('操作成功！')
    }
    
    const handleError = () => {
      showError('You\'ve no sufficient balance')
    }
    
    const handleWarning = () => {
      showWarning('请注意检查输入信息')
    }
    
    const handleInfo = () => {
      showInfo('这是一条提示信息')
    }
    
    return {
      handleSuccess,
      handleError,
      handleWarning,
      handleInfo
    }
  }
}
```

### 2. 可用的方法

- `showSuccess(message, duration)` - 显示成功消息（绿色背景）
- `showError(message, duration)` - 显示错误消息（红色背景）
- `showWarning(message, duration)` - 显示警告消息（黄色背景）
- `showInfo(message, duration)` - 显示信息消息（蓝色背景）
- `hideMessage()` - 手动隐藏消息

### 3. 参数说明

- `message` (String): 要显示的消息内容
- `duration` (Number): 自动消失时间，单位毫秒，默认3000ms，设置为0则不自动消失

### 4. 使用示例

```javascript
// 显示错误消息，3秒后自动消失
showError('You\'ve no sufficient balance')

// 显示成功消息，5秒后自动消失
showSuccess('保存成功！', 5000)

// 显示警告消息，不自动消失
showWarning('请确认操作', 0)
```

## 样式说明

组件会根据消息类型自动应用不同的颜色主题：

- **Success**: 绿色主题 (#28a745)
- **Error**: 红色主题 (#dc3545) 
- **Warning**: 黄色主题 (#ffc107)
- **Info**: 蓝色主题 (#007bff)

## 注意事项

1. 组件已在 App.vue 中全局注册，无需在每个页面单独引入组件
2. 使用 Teleport 渲染到 body，确保在最顶层显示
3. z-index 设置为 9999，确保在其他元素之上显示
4. 支持响应式设计，在移动端会自动调整样式 