import { Server, Socket } from 'socket.io'
import { TaskService } from '../services/taskService'
import type { ITask } from '../models/Task'

export function setupWebSocketHandlers(io: Server) {
  io.on('connection', async (socket: Socket) => {
    console.log(`User connected: ${socket.id}`)

    try {
      // Send initial task list to connected client
      const tasks = await TaskService.getAllTasks()
      socket.emit('tasks:list', { tasks })
    } catch (error) {
      console.error('Error sending initial task list:', error)
    }

    /**
     * Handle task creation
     */
    socket.on('task:create', async (data: { title: string }, callback) => {
      try {
        console.log(`Creating task: ${data.title}`)
        const task = await TaskService.createTask(data.title)

        // Broadcast to all connected clients
        io.emit('task:created', { task })

        if (callback) {
          callback({ success: true, task })
        }
      } catch (error: any) {
        console.error('Error creating task:', error)
        if (callback) {
          callback({ success: false, error: error.message })
        }
      }
    })

    /**
     * Handle task updates
     */
    socket.on('task:update', async (data: { id: string; title?: string; completed?: boolean }, callback) => {
      try {
        console.log(`Updating task: ${data.id}`)
        const updates: Partial<ITask> = {}

        if (data.title !== undefined) {
          updates.title = data.title
        }
        if (data.completed !== undefined) {
          updates.completed = data.completed
        }

        const task = await TaskService.updateTask(data.id, updates)

        if (!task) {
          if (callback) {
            callback({ success: false, error: 'Task not found' })
          }
          return
        }

        // Broadcast to all connected clients
        io.emit('task:updated', { task })

        if (callback) {
          callback({ success: true, task })
        }
      } catch (error: any) {
        console.error('Error updating task:', error)
        if (callback) {
          callback({ success: false, error: error.message })
        }
      }
    })

    /**
     * Handle task deletion
     */
    socket.on('task:delete', async (data: { id: string }, callback) => {
      try {
        console.log(`Deleting task: ${data.id}`)
        const task = await TaskService.deleteTask(data.id)

        if (!task) {
          if (callback) {
            callback({ success: false, error: 'Task not found' })
          }
          return
        }

        // Broadcast to all connected clients
        io.emit('task:deleted', { id: data.id })

        if (callback) {
          callback({ success: true })
        }
      } catch (error: any) {
        console.error('Error deleting task:', error)
        if (callback) {
          callback({ success: false, error: error.message })
        }
      }
    })

    /**
     * Handle client disconnect
     */
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
    })

    /**
     * Handle connection errors
     */
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error)
    })
  })
}
