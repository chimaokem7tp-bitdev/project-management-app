import { Router, Request, Response } from 'express'
import { TaskService } from '../services/taskService'

const router = Router()

/**
 * GET /api/tasks
 * Retrieve all tasks
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getAllTasks()
    res.json({
      tasks,
      count: tasks.length,
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

/**
 * GET /api/tasks/stats
 * Get task statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await TaskService.getStats()
    res.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

/**
 * GET /api/tasks/:id
 * Retrieve a specific task
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const task = await TaskService.getTaskById(id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ task })
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
})

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title } = req.body

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' })
    }

    const task = await TaskService.createTask(title.trim())
    res.status(201).json({ task })
  } catch (error: any) {
    console.error('Error creating task:', error)
    res.status(400).json({ error: error.message || 'Failed to create task' })
  }
})

/**
 * PUT /api/tasks/:id
 * Update a task
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Validate updates
    const allowedUpdates = ['title', 'completed']
    const isValidOperation = Object.keys(updates).every(key => allowedUpdates.includes(key))

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid update fields' })
    }

    if (updates.title && typeof updates.title === 'string') {
      updates.title = updates.title.trim()
    }

    const task = await TaskService.updateTask(id, updates)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ task })
  } catch (error: any) {
    console.error('Error updating task:', error)
    res.status(400).json({ error: error.message || 'Failed to update task' })
  }
})

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const task = await TaskService.deleteTask(id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully', task })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

/**
 * PATCH /api/tasks/:id/toggle
 * Toggle task completion status
 */
router.patch('/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const task = await TaskService.toggleTask(id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ task })
  } catch (error) {
    console.error('Error toggling task:', error)
    res.status(500).json({ error: 'Failed to toggle task' })
  }
})

export default router
