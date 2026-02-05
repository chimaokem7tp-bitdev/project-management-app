<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TaskBoard from '@/components/TaskBoard.vue'
import { websocketService } from '@/services/websocket'

const isConnected = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    await websocketService.connect()
    isConnected.value = true
  } catch (err) {
    console.error('Failed to connect WebSocket:', err)
    error.value = 'Failed to connect to server. Using REST API only.'
  }
})

onUnmounted(() => {
  websocketService.disconnect()
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Project Management</h1>
      <div class="connection-status">
        <span v-if="isConnected" class="status connected">
          <span class="dot"></span>Real-time Connected
        </span>
        <span v-else class="status disconnected">
          <span class="dot"></span>Using REST API
        </span>
      </div>
    </header>

    <main class="app-main">
      <div v-if="error" class="error-banner">
        {{ error }}
      </div>
      <TaskBoard />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
}

.status.connected {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status.disconnected {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.error-banner {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
  }

  .app-header h1 {
    font-size: 1.5rem;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
