<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  create: [title: string]
}>()

const input = ref('')

const handleSubmit = (e: Event) => {
  e.preventDefault()
  const title = input.value.trim()
  if (title) {
    emit('create', title)
    input.value = ''
  }
}
</script>

<template>
  <form class="task-form" @submit="handleSubmit">
    <div class="form-group">
      <input
        v-model="input"
        type="text"
        placeholder="Add a new task..."
        class="form-input"
        :disabled="disabled"
        maxlength="255"
      />
      <button
        type="submit"
        class="form-button"
        :disabled="disabled || !input.trim()"
      >
        Add Task
      </button>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  gap: 0.75rem;
}

.form-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.form-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.form-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.form-button:active:not(:disabled) {
  transform: translateY(0);
}

.form-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
