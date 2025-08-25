<template>
  <div class="bonus-container">
    <div class="bonus-content">
      <h2>Bonus</h2>
      <p>This is the main bonus page.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bonus',
  setup() {
    return {}
  }
}
</script>

<style scoped>
.bonus-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.bonus-content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #6c757d;
}
</style> 