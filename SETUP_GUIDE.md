# Project Management App - Setup & Development Guide

## Quick Start Overview

This is a complete setup guide for the Project Management App built with Vue.js 3 (frontend), Node.js + Express (backend), and MongoDB (database).

## Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v16 or higher): [nodejs.org](https://nodejs.org)
- **npm** or **yarn**: Comes with Node.js
- **Docker & Docker Compose**: [docker.com](https://www.docker.com/get-started)
- **Git**: [git-scm.com](https://git-scm.com)

Verify installations with:
```bash
node --version
npm --version
docker --version
docker-compose --version
```

## Project Structure

```
project-management-app/
├── client/                    # Vue.js 3 + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Vue components
│   │   │   ├── TaskBoard.vue
│   │   │   ├── TaskCard.vue
│   │   │   └── TaskForm.vue
│   │   ├── services/          # API & WebSocket clients
│   │   │   ├── api.ts
│   │   │   └── websocket.ts
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript interfaces
│   │   ├── App.vue            # Root component
│   │   └── main.ts            # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── .env.example
│
├── server/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts    # MongoDB connection
│   │   ├── models/
│   │   │   └── Task.ts        # Mongoose schema
│   │   ├── routes/
│   │   │   └── tasks.ts       # API endpoints
│   │   ├── services/
│   │   │   └── taskService.ts # Business logic
│   │   ├── websocket/
│   │   │   └── handler.ts     # WebSocket handlers
│   │   └── index.ts           # Express setup & entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docker-compose.yml         # MongoDB container config
├── README.md                  # Main documentation
└── verify-setup.sh            # Setup verification script

```

## Installation Steps

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/chimaokem7tp-bitdev/project-management-app.git
cd project-management-app

# Run verification script (optional but recommended)
chmod +x verify-setup.sh
./verify-setup.sh
```

### 2. Install Dependencies

**Install Client Dependencies:**
```bash
cd client
npm install
cd ..
```

**Install Server Dependencies:**
```bash
cd server
npm install
cd ..
```

### 3. Start MongoDB with Docker

```bash
# Start MongoDB container (runs in background)
docker-compose up -d

# Verify MongoDB is running
docker-compose ps

# Check MongoDB connection
docker-compose logs mongodb
```

MongoDB will be available at:
- **Connection String**: `mongodb://admin:password@localhost:27017/project-management-db?authSource=admin`
- **Port**: 27017
- **Database**: `project-management-db`
- **Username**: `admin`
- **Password**: `password`

### 4. Configure Environment Variables

**For Server** (create `server/.env`):
```bash
cp server/.env.example server/.env
```

Edit `server/.env` if needed:
```
MONGODB_URI=mongodb://admin:password@localhost:27017/project-management-db?authSource=admin
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**For Client** (create `client/.env`):
```bash
cp client/.env.example client/.env
```

Edit `client/.env` if needed:
```
VITE_API_URL=http://localhost:3001
```

### 5. Start Development Servers

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev

# Output should show:
# Connected to MongoDB
# Server is running on port 3001
# Health check: http://localhost:3001/health
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd client
npm run serve

# Output should show:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

### 6. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend Health Check**: http://localhost:3001/health

## Development Commands

### Client (Vue.js)

```bash
cd client

# Start development server (port 5173)
npm run serve

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run TypeScript type checking
npm run type-check
```

### Server (Node.js + Express)

```bash
cd server

# Start development server with auto-reload (port 3001)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm run start

# Run linter
npm run lint
```

### Database (MongoDB)

```bash
# Start MongoDB container
docker-compose up -d

# Stop MongoDB container
docker-compose down

# View MongoDB logs
docker-compose logs -f mongodb

# Stop and remove all data
docker-compose down -v

# Restart MongoDB
docker-compose restart
```

## API Endpoints

### REST API

All endpoints are prefixed with `/api/tasks`.

#### GET /api/tasks
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
  ],
  "count": 1
}
```

#### GET /api/tasks/stats
Get task statistics

**Response:**
```json
{
  "total": 10,
  "completed": 3,
  "active": 7
}
```

#### GET /api/tasks/:id
Retrieve a specific task

**Response:**
```json
{
  "task": { ... }
}
```

#### POST /api/tasks
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

#### PUT /api/tasks/:id
Update a task

**Request Body:**
```json
{
  "title": "Updated title",
  "completed": true
}
```

#### DELETE /api/tasks/:id
Delete a task

**Response:**
```json
{
  "message": "Task deleted successfully",
  "task": { ... }
}
```

#### PATCH /api/tasks/:id/toggle
Toggle task completion status

**Response:**
```json
{
  "task": { ... }
}
```

### WebSocket Events

WebSocket events for real-time updates are automatically sent via Socket.IO.

#### Server → Client Events

**`tasks:list`** - Initial task list on connection
```json
{ "tasks": [...] }
```

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

#### Client → Server Events

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

## Troubleshooting

### MongoDB Connection Error
**Problem**: `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
```bash
# Check if MongoDB container is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart

# Verify connection string in server/.env
MONGODB_URI=mongodb://admin:password@localhost:27017/project-management-db?authSource=admin
```

### Port Already in Use

**Client port 5173 in use:**
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or start on different port (Vite will auto-increment)
cd client && npm run serve -- --port 5174
```

**Server port 3001 in use:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change PORT in server/.env
PORT=3002
```

**MongoDB port 27017 in use:**
```bash
# Check Docker containers
docker ps

# Stop conflicting container
docker stop <container-id>

# Remove old containers
docker-compose down
docker-compose up -d
```

### WebSocket Connection Failed
**Problem**: `WebSocket connection to 'ws://localhost:3001' failed`

**Solutions**:
1. Ensure server is running on port 3001
2. Check `VITE_API_URL` in `client/.env`
3. Check `CLIENT_URL` in `server/.env`
4. Open browser console to see detailed error messages
5. Check browser console for CORS issues

### Module Not Found Errors

**Fix missing dependencies**:
```bash
# Client
cd client && npm install && cd ..

# Server
cd server && npm install && cd ..
```

**Clear node_modules and reinstall**:
```bash
# Client
cd client
rm -rf node_modules package-lock.json
npm install
cd ..

# Server
cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

### TypeScript Compilation Errors

```bash
# Client type checking
cd client && npm run type-check

# Server build
cd server && npm run build

# Check for any .ts errors in IDE/terminal
```

## Production Deployment

### Frontend Deployment (Vercel / Netlify)

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

   Or connect GitHub repository to Vercel dashboard.

3. **Set environment variables in Vercel:**
   - `VITE_API_URL`: Production backend URL

### Backend Deployment (Heroku / Railway / AWS)

1. **Build the server:**
   ```bash
   cd server
   npm run build
   ```

2. **Deploy to Heroku:**
   ```bash
   heroku create your-app-name
   heroku addons:create mongolab:sandbox
   git push heroku main
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=<production-mongodb-uri>
   heroku config:set CLIENT_URL=<production-frontend-url>
   heroku config:set NODE_ENV=production
   ```

### Database Deployment (MongoDB Atlas)

1. Create MongoDB Atlas account: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Update `MONGODB_URI` in production `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management-db?retryWrites=true&w=majority
   ```

## Technologies Used

### Frontend
- **Vue.js 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Axios**: HTTP client for API calls
- **Socket.IO Client**: Real-time WebSocket communication
- **Vite**: Fast build tool and dev server

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **Socket.IO**: Real-time communication library
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variable management

### Database
- **MongoDB**: NoSQL document database
- **Docker**: Container platform
- **Docker Compose**: Container orchestration

## Project Features

✅ **Real-time Task Management** - Create, update, delete tasks instantly  
✅ **WebSocket Communication** - Live updates across all connected clients  
✅ **REST API** - Full CRUD operations for tasks  
✅ **MongoDB Persistence** - Reliable data storage  
✅ **Type-Safe Code** - Full TypeScript support  
✅ **Responsive UI** - Works on desktop and mobile  
✅ **Error Handling** - Comprehensive error management  
✅ **Development Scripts** - Easy-to-use npm commands  

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## License

MIT License - See LICENSE file for details

## Support

- **Issues**: Check GitHub Issues for known problems
- **Documentation**: Review this guide and code comments
- **Questions**: Open a GitHub Discussion

## Resources

- [Vue.js Documentation](https://vuejs.org)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Socket.IO Documentation](https://socket.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Docker Documentation](https://docs.docker.com)
- [Axios Documentation](https://axios-http.com)

---

**Last Updated**: 2025-02-05
**Version**: 1.0.0
