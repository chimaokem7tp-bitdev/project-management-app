<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import { taskApi } from '@/services/api'
import { websocketService } from '@/services/websocket'
import type { Task } from '@/types'

const tasks = ref<Task[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const activeTasks = computed(() => tasks.value.filter(task => !task.completed))
const completedTasks = computed(() => tasks.value.filter(task => task.completed))

onMounted(async () => {
  await loadTasks()
  setupWebSocketListeners()
})

const loadTasks = async () => {
  loading.value = true
  error.value = null
  try {
    tasks.value = await taskApi.getTasks()
  } catch (err) {
    error.value = 'Failed to load tasks'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const setupWebSocketListeners = () => {
  websocketService.on('task:created', (task: Task) => {
    const exists = tasks.value.find(t => t._id === task._id)
    if (!exists) {
      tasks.value.push(task)
    }
  })

  websocketService.on('task:updated', (task: Task) => {
    const index = tasks.value.findIndex(t => t._id === task._id)
    if (index > -1) {
      tasks.value[index] = task
    }
  })

  websocketService.on('task:deleted', (id: string) => {
    tasks.value = tasks.value.filter(t => t._id !== id)
  })

  websocketService.on('tasks:list', (taskList: Task[]) => {
    tasks.value = taskList
  })
}

const handleTaskCreate = async (title: string) => {
  try {
    const newTask = await taskApi.createTask({ title })
    tasks.value.push(newTask)
  } catch (err) {
    error.value = 'Failed to create task'
    console.error(err)
  }
}

const handleTaskUpdate = async (id: string, title: string, completed: boolean) => {
  try {
    const updatedTask = await taskApi.updateTask(id, { title, completed })
    const index = tasks.value.findIndex(t => t._id === id)
    if (index > -1) {
      tasks.value[index] = updatedTask
    }
  } catch (err) {
    error.value = 'Failed to update task'
    console.error(err)
  }
}

const handleTaskDelete = async (id: string) => {
  try {
    await taskApi.deleteTask(id)
    tasks.value = tasks.value.filter(t => t._id !== id)
  } catch (err) {
    error.value = 'Failed to delete task'
    console.error(err)
  }
}

const handleTaskToggle = async (id: string, completed: boolean) => {
  await handleTaskUpdate(id, tasks.value.find(t => t._id === id)?.title || '', !completed)
}
</script>

<template>
  <div class="task-board">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <TaskForm @create="handleTaskCreate" :disabled="loading" />

    <div v-if="loading" class="loading">
      Loading tasks...
    </div>

    <div v-else class="board-columns">
      <div class="column">
        <div class="column-header">
          <h2>Active Tasks</h2>
          <span class="count">{{ activeTasks.length }}</span>
        </div>
        <div class="tasks-list">
          <TaskCard
            v-for="task in activeTasks"
            :key="task._id"
            :task="task"
            @update="handleTaskUpdate"
            @delete="handleTaskDelete"
            @toggle="handleTaskToggle"
          />
          <div v-if="activeTasks.length === 0" class="empty-state">
            No active tasks. Create one to get started!
          </div>
        </div>
      </div>

      <div class="column">
        <div class="column-header">
          <h2>Completed Tasks</h2>
          <span class="count">{{ completedTasks.length }}</span>
        </div>
        <div class="tasks-list completed">
          <TaskCard
            v-for="task in completedTasks"
            :key="task._id"
            :task="task"
            @update="handleTaskUpdate"
            @delete="handleTaskDelete"
            @toggle="handleTaskToggle"
          />
          <div v-if="completedTasks.length === 0" class="empty-state">
            No completed tasks yet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-board {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 6px;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.board-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.column {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.column-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-header h2 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.count {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.tasks-list {
  padding: 1rem;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tasks-list.completed {
  background-color: #f9fafb;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 2rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .board-columns {
    grid-template-columns: 1fr;
  }
}
</style>
