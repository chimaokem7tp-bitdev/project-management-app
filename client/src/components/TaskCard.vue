<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [completed: boolean]
  update: [id: string, title: string, completed: boolean]
  delete: [id: string]
}>()

const isEditing = ref(false)
const editTitle = ref(props.task.title)

const handleToggle = () => {
  emit('toggle', props.task.completed)
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', props.task._id)
  }
}

const handleEdit = () => {
  isEditing.value = true
}

const handleSave = () => {
  if (editTitle.value.trim()) {
    emit('update', props.task._id, editTitle.value.trim(), props.task.completed)
    isEditing.value = false
  }
}

const handleCancel = () => {
  editTitle.value = props.task.title
  isEditing.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSave()
  } else if (event.key === 'Escape') {
    handleCancel()
  }
}
</script>

<template>
  <div class="task-card" :class="{ completed: task.completed }">
    <div class="task-content">
      <input
        type="checkbox"
        class="task-checkbox"
        :checked="task.completed"
        @change="handleToggle"
        aria-label="Toggle task completion"
      />

      <div v-if="!isEditing" class="task-text">
        <p class="task-title" :class="{ 'line-through': task.completed }">
          {{ task.title }}
        </p>
        <p class="task-date">
          {{ new Date(task.createdAt).toLocaleDateString() }}
        </p>
      </div>

      <div v-else class="task-edit">
        <input
          v-model="editTitle"
          type="text"
          class="edit-input"
          @keydown="handleKeydown"
          autofocus
        />
      </div>
    </div>

    <div class="task-actions">
      <button
        v-if="!isEditing"
        class="action-btn edit-btn"
        @click="handleEdit"
        title="Edit task"
      >
        ✎
      </button>
      <button
        v-if="isEditing"
        class="action-btn save-btn"
        @click="handleSave"
        title="Save task"
      >
        ✓
      </button>
      <button
        v-if="isEditing"
        class="action-btn cancel-btn"
        @click="handleCancel"
        title="Cancel editing"
      >
        ✕
      </button>
      <button
        class="action-btn delete-btn"
        @click="handleDelete"
        title="Delete task"
      >
        🗑
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.task-card.completed {
  opacity: 0.7;
  background-color: #f9fafb;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.task-checkbox {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.task-text {
  flex: 1;
  min-width: 0;
}

.task-title {
  margin: 0;
  font-size: 0.95rem;
  color: #2c3e50;
  word-break: break-word;
  overflow-wrap: break-word;
}

.task-title.line-through {
  text-decoration: line-through;
  color: #999;
}

.task-date {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #999;
}

.task-edit {
  flex: 1;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #667eea;
  border-radius: 4px;
  font-size: 0.95rem;
  font-family: inherit;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  border-radius: 4px;
}

.action-btn:hover {
  opacity: 1;
  background-color: #f3f4f6;
}

.edit-btn {
  color: #3b82f6;
}

.save-btn {
  color: #22c55e;
}

.cancel-btn {
  color: #ef4444;
}

.delete-btn {
  color: #ef4444;
}
</style>
