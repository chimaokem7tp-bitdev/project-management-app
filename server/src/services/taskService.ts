import { Task, ITask } from '../models/Task'

export class TaskService {
  /**
   * Get all tasks
   */
  static async getAllTasks(): Promise<ITask[]> {
    return await Task.find().sort({ createdAt: -1 })
  }

  /**
   * Get task by ID
   */
  static async getTaskById(id: string): Promise<ITask | null> {
    return await Task.findById(id)
  }

  /**
   * Create a new task
   */
  static async createTask(title: string): Promise<ITask> {
    const task = new Task({ title })
    return await task.save()
  }

  /**
   * Update a task
   */
  static async updateTask(id: string, updates: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(id)
  }

  /**
   * Toggle task completion
   */
  static async toggleTask(id: string): Promise<ITask | null> {
    const task = await Task.findById(id)
    if (!task) {
      return null
    }
    task.completed = !task.completed
    return await task.save()
  }

  /**
   * Get task statistics
   */
  static async getStats() {
    const total = await Task.countDocuments()
    const completed = await Task.countDocuments({ completed: true })
    const active = total - completed

    return { total, completed, active }
  }
}
