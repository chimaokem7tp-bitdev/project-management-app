import { io, Socket } from 'socket.io-client'
import type { Task } from '@/types'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class WebSocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Function[]> = new Map()

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(apiUrl, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        })

        this.socket.on('connect', () => {
          console.log('WebSocket connected')
          this.emit('connected')
          resolve()
        })

        this.socket.on('disconnect', () => {
          console.log('WebSocket disconnected')
          this.emit('disconnected')
        })

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error)
          reject(error)
        })

        // Listen to server events
        this.socket.on('task:created', (data: { task: Task }) => {
          this.emit('task:created', data.task)
        })

        this.socket.on('task:updated', (data: { task: Task }) => {
          this.emit('task:updated', data.task)
        })

        this.socket.on('task:deleted', (data: { id: string }) => {
          this.emit('task:deleted', data.id)
        })

        this.socket.on('tasks:list', (data: { tasks: Task[] }) => {
          this.emit('tasks:list', data.tasks)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  emit(event: string, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data))
    }
  }

  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // Emit events to server
  createTask(title: string): void {
    if (this.socket) {
      this.socket.emit('task:create', { title })
    }
  }

  updateTask(id: string, title: string, completed: boolean): void {
    if (this.socket) {
      this.socket.emit('task:update', { id, title, completed })
    }
  }

  deleteTask(id: string): void {
    if (this.socket) {
      this.socket.emit('task:delete', { id })
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const websocketService = new WebSocketService()
