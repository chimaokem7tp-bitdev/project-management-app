# Project Management App

A full-stack project management application with real-time task updates. Built with Vue.js 3 (frontend), Node.js + Express (backend), and MongoDB (database).

## Architecture

```
project-management-app/
├── client/                 # Vue.js 3 + TypeScript frontend
├── server/                 # Node.js + Express + WebSocket backend
├── docker-compose.yml      # MongoDB container orchestration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for MongoDB)

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/chimaokem7tp-bitdev/project-management-app.git
cd project-management-app

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

### 2. Start MongoDB with Docker

```bash
# Start MongoDB container (runs on port 27017)
docker-compose up -d

# Verify MongoDB is running
docker-compose ps
```

To stop MongoDB:
```bash
docker-compose down
```

### 3. Create Environment Files

Create `.env` file in the `server` directory:

```
MONGODB_URI=mongodb://localhost:27017/project-management-db
PORT=3001
NODE_ENV=development
```

Create `.env` file in the `client` directory:

```
VITE_API_URL=http://localhost:3001
```

### 4. Start Development Servers

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run serve
# Client runs on http://localhost:5173
```

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Real-time Updates**: WebSocket connection for instant task updates across clients
- **Persistence**: MongoDB stores all task data
- **REST API**: Express endpoints for task operations
- **Type-Safe**: Full TypeScript support on both frontend and backend

## API Endpoints

### GET /api/tasks
Retrieve all tasks

**Response:**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project",
      "completed": false,
      "createdAt": "2025-02-05T10:30:00Z",
      "updatedAt": "2025-02-05T10:30:00Z"
    }
  ]
}
```

### POST /api/tasks
Create a new task

**Request Body:**
```json
{
  "title": "New task"
}
```

**Response:**
```json
{
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "New task",
    "completed": false,
    "createdAt": "2025-02-05T10:31:00Z",
    "updatedAt": "2025-02-05T10:31:00Z"
  }
}
```

### PUT /api/tasks/:id
Update a task

**Request Body:**
```json
{
  "title": "Updated title",
  "completed": true
}
```

### DELETE /api/tasks/:id
Delete a task

## WebSocket Events

### Client → Server

**`task:create`** - Create new task
```json
{ "title": "New task" }
```

**`task:update`** - Update existing task
```json
{ "id": "507f...", "title": "Updated", "completed": true }
```

**`task:delete`** - Delete task
```json
{ "id": "507f..." }
```

### Server → Client

**`task:created`** - New task created
```json
{ "task": { "_id": "...", "title": "...", "completed": false } }
```

**`task:updated`** - Task updated
```json
{ "task": { "_id": "...", "title": "...", "completed": true } }
```

**`task:deleted`** - Task deleted
```json
{ "id": "507f..." }
```

**`tasks:list`** - Full task list (initial connection)
```json
{ "tasks": [...] }
```

## Project Structure

### Client (`client/`)

```
src/
├── components/
│   ├── TaskBoard.vue      # Main task board component
│   ├── TaskCard.vue       # Individual task card
│   └── TaskForm.vue       # Task creation form
├── services/
│   ├── api.ts             # Axios API client
│   └── websocket.ts       # WebSocket client
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.vue                # Root component
└── main.ts                # Application entry point
```

### Server (`server/`)

```
src/
├── models/
│   └── Task.ts            # Task Mongoose schema
├── routes/
│   └── tasks.ts           # Task API routes
├── services/
│   └── taskService.ts     # Business logic
├── websocket/
│   └── handler.ts         # WebSocket event handlers
├── config/
│   └── database.ts        # MongoDB connection
├── server.ts              # Express app setup
└── index.ts               # Entry point
```

## Development Scripts

### Client

```bash
npm run serve          # Start dev server (port 5173)
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
npm run type-check     # Run TypeScript type checking
```

### Server

```bash
npm run dev            # Start dev server with auto-reload (port 3001)
npm run build          # Build TypeScript to JavaScript
npm run start          # Run production build
npm run lint           # Run ESLint
```

## Database Setup

### MongoDB Collections

**Tasks Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
// For faster queries
db.tasks.createIndex({ "createdAt": -1 })
db.tasks.createIndex({ "completed": 1 })
```

## Troubleshooting

### MongoDB Connection Error
- Ensure Docker is running: `docker ps`
- Check container status: `docker-compose ps`
- Verify `MONGODB_URI` in server `.env` file
- Restart container: `docker-compose restart`

### Port Already in Use
- Client (5173): `lsof -i :5173` then kill the process
- Server (3001): `lsof -i :3001` then kill the process
- MongoDB (27017): Check `docker-compose ps` for container conflicts

### WebSocket Connection Failed
- Ensure server is running on port 3001
- Check browser console for errors
- Verify `VITE_API_URL` in client `.env` matches server URL

## Production Deployment

### Docker Build

Create a production Docker image:

```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build

# Create production docker-compose.yml with built images
```

### Vercel (Recommended for Frontend)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Heroku / Railway (Recommended for Backend)

1. Set up database URI
2. Deploy server code
3. Update client `VITE_API_URL` to production server URL

## Contributing

1. Create feature branches from `main`
2. Follow commit conventions
3. Submit pull requests for review
4. Ensure tests pass before merging

## License

MIT

## Support

For issues and questions:
- Check GitHub Issues
- Review existing documentation
- Contact development team
