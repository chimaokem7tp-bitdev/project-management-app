export interface Task {
  _id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTaskPayload {
  title: string
}

export interface UpdateTaskPayload {
  title?: string
  completed?: boolean
}

export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface TasksListResponse {
  tasks: Task[]
}

export interface TaskResponse {
  task: Task
}
