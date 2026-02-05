import mongoose, { Connection } from 'mongoose'

let connection: Connection | null = null

export async function connectDatabase(): Promise<Connection> {
  if (connection) {
    return connection
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/project-management-db?authSource=admin'

  try {
    const result = await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    })

    connection = result.connection
    console.log('MongoDB connected successfully')
    return connection
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export function getConnection(): Connection | null {
  return connection
}

export async function disconnectDatabase(): Promise<void> {
  if (connection) {
    await mongoose.disconnect()
    connection = null
    console.log('MongoDB disconnected')
  }
}
