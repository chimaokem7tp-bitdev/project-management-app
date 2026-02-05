# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Vue.js 3)                        │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  TaskBoard   │  │  TaskForm    │  │  Connection Monitor  │  │
│  │  Component   │  │  Component   │  │  (Real-time status)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         ▲                  ▲                                      │
│         │                  │                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           State Management & Component Logic             │   │
│  │  ┌──────────────────┐    ┌──────────────────────────┐   │   │
│  │  │   REST API       │    │  WebSocket Events       │   │   │
│  │  │   (Axios)        │    │  (Socket.IO Client)     │   │   │
│  │  │                  │    │                          │   │   │
│  │  │ • GET /tasks     │    │ • task:created          │   │   │
│  │  │ • POST /tasks    │    │ • task:updated          │   │   │
│  │  │ • PUT /tasks/:id │    │ • task:deleted          │   │   │
│  │  │ • DELETE /tasks  │    │ • tasks:list            │   │   │
│  │  └──────────────────┘    └──────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼ HTTP/REST                   ▼ WebSocket
        │                             │
┌──────────────────────────────────────────────────────────────────┐
│                   SERVER (Node.js + Express)                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Express HTTP Server                        │    │
│  │                                                         │    │
│  │  Routes /api/tasks/                                   │    │
│  │  ├── GET     (Fetch all tasks)                        │    │
│  │  ├── POST    (Create task)                            │    │
│  │  ├── PUT/:id (Update task)                            │    │
│  │  └── DELETE/:id (Delete task)                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Socket.IO WebSocket Server                    │    │
│  │                                                         │    │
│  │  Events:                                              │    │
│  │  ├── task:create  (Client → Server)                  │    │
│  │  ├── task:update  (Client → Server)                  │    │
│  │  ├── task:delete  (Client → Server)                  │    │
│  │  ├── task:created (Server → Clients)                 │    │
│  │  ├── task:updated (Server → Clients)                 │    │
│  │  ├── task:deleted (Server → Clients)                 │    │
│  │  └── tasks:list   (Server → Client on connect)       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Business Logic (TaskService)                  │    │
│  │                                                         │    │
│  │  • getAllTasks()                                       │    │
│  │  • getTaskById()                                       │    │
│  │  • createTask()                                        │    │
│  │  • updateTask()                                        │    │
│  │  • deleteTask()                                        │    │
│  │  • toggleTask()                                        │    │
│  │  • getStats()                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼ Mongoose ODM
                       │
┌──────────────────────────────────────────────────────────────────┐
│                  MongoDB Database                                 │
│                                                                   │
│  Database: project-management-db                                 │
│                                                                   │
│  Collections:                                                    │
│  └── tasks                                                       │
│      ├── _id (ObjectId)                                          │
│      ├── title (String, required, unique index)                  │
│      ├── completed (Boolean, default: false, indexed)            │
│      ├── createdAt (Date, indexed, descending)                   │
│      └── updatedAt (Date)                                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Task

```
User Input (TaskForm)
        │
        ▼
Vue Component (emit event)
        │
        ▼
API Service (Axios POST)
        │
        ▼
Express Route (/api/tasks POST)
        │
        ▼
TaskService.createTask()
        │
        ▼
Mongoose Save to MongoDB
        │
        ▼
Task Created Response
        │
        ├─▶ REST Response (HTTP 201)
        │
        └─▶ WebSocket Broadcast (task:created)
                │
                ▼
        All Connected Clients Receive Event
                │
                ▼
        Vue Components Update UI
```

### Real-time Update Flow

```
Client A - Task Update
        │
        ▼
WebSocket (task:update event)
        │
        ▼
Server WebSocket Handler
        │
        ▼
TaskService.updateTask()
        │
        ▼
MongoDB Update
        │
        ▼
Broadcast to ALL Clients (task:updated)
        │
        ├─▶ Client A (Updated)
        ├─▶ Client B (Updated)
        └─▶ Client C (Updated)
```

## Technology Stack

### Frontend (Vue.js 3)
- **Framework**: Vue.js 3 (Composition API)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Build Tool**: Vite
- **Dev Server**: Vite Dev Server

### Backend (Node.js)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Database Driver**: Mongoose
- **Language**: TypeScript
- **Validation**: Built-in Mongoose validation

### Database (MongoDB)
- **Type**: NoSQL Document Database
- **Container**: Docker
- **Orchestration**: Docker Compose
- **Port**: 27017

## Security Considerations

### Client-Side
- Input validation before sending to server
- HTTPS in production
- Secure WebSocket (WSS) in production
- CORS protection

### Server-Side
- Input validation and sanitization
- Type checking with TypeScript
- Mongoose schema validation
- Error handling and logging
- Rate limiting (can be added with middleware)
- Request size limits

### Database
- Authentication (MongoDB admin credentials)
- Network isolation in Docker
- Data validation at model level
- Indexed queries for performance

## Performance Optimizations

### Database
- Indexes on `createdAt` and `completed` fields
- Efficient Mongoose queries
- Connection pooling

### API
- RESTful design for simple operations
- WebSocket for real-time updates
- Minimal payload sizes
- Gzip compression (can be added)

### Frontend
- Component-based architecture
- Lazy loading (can be added)
- Efficient state management
- CSS optimization

## Scalability Considerations

### Current Setup (Development)
- Single MongoDB instance
- Single Express server
- All WebSocket clients connected to one server

### Production Scaling Paths

1. **Horizontal Scaling**
   - Multiple Express server instances
   - Load balancer (Nginx, HAProxy)
   - Redis for session store
   - Sticky sessions or token-based auth

2. **Database Scaling**
   - MongoDB Replica Set
   - Sharding for large datasets
   - Read replicas for queries

3. **Real-time Scaling**
   - Redis adapter for Socket.IO
   - Multiple WebSocket server instances
   - Message queue for event distribution

## Deployment Architecture

### Option 1: All-in-One (Recommended for MVP)
```
Vercel/Netlify (Frontend) → Heroku/Railway (Backend) → MongoDB Atlas
```

### Option 2: Container-Based
```
Docker + Docker Compose → Container Registry → Kubernetes
```

### Option 3: Serverless (Not Recommended for WebSocket)
- Limited WebSocket support
- Better for REST-only APIs

## Monitoring & Logging

### Current Implementation
- Console logs in development
- Server startup messages
- Connection status in UI

### Production Additions
- Centralized logging (Winston, Bunyan)
- Error tracking (Sentry)
- Performance monitoring (DataDog, New Relic)
- Database monitoring
- Application performance monitoring (APM)
