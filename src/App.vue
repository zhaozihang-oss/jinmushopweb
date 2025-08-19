<template>
  <div id="app">
    <router-view />
    <!-- 全局消息提示组件 -->
    <MessageToast 
      :visible="messageState.visible"
      :message="messageState.message"
      :type="messageState.type"
      :duration="messageState.duration"
      @close="hideMessage"
    />
  </div>
</template>

<script>
import MessageToast from './components/common/MessageToast.vue'
import { useMessage } from './composables/useMessage'

export default {
  name: 'App',
  components: {
    MessageToast
  },
  setup() {
    const { messageState, hideMessage } = useMessage()
    
    return {
      messageState,
      hideMessage
    }
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}
</style> 