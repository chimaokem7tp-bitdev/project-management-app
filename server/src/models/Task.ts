import { Schema, model, Document } from 'mongoose'

export interface ITask extends Document {
  _id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the task'],
      trim: true,
      maxlength: [255, 'Task title cannot exceed 255 characters'],
      minlength: [1, 'Task title cannot be empty'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
taskSchema.index({ createdAt: -1 })
taskSchema.index({ completed: 1 })

export const Task = model<ITask>('Task', taskSchema)
