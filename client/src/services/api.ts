import axios, { AxiosInstance } from 'axios'
import type { Task, CreateTaskPayload, UpdateTaskPayload, TasksListResponse, TaskResponse } from '@/types'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const taskApi = {
  /**
   * Fetch all tasks
   */
  getTasks: async (): Promise<Task[]> => {
    const response = await axiosInstance.get<TasksListResponse>('/api/tasks')
    return response.data.tasks
  },

  /**
   * Create a new task
   */
  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    const response = await axiosInstance.post<TaskResponse>('/api/tasks', payload)
    return response.data.task
  },

  /**
   * Update a task
   */
  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const response = await axiosInstance.put<TaskResponse>(`/api/tasks/${id}`, payload)
    return response.data.task
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/tasks/${id}`)
  },

  /**
   * Toggle task completion status
   */
  toggleTask: async (id: string, completed: boolean): Promise<Task> => {
    return taskApi.updateTask(id, { completed })
  },
}

export default axiosInstance
