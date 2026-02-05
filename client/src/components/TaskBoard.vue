<template>
  <div>
    <ul>
      <li v-for="task in tasks" :key="task._id">{{ task.title }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const tasks = ref([]);

onMounted(async () => {
  const res = await axios.get('/api/tasks');
  tasks.value = res.data;
});
</script>
