Project Management App

A full‑stack project management application with real‑time task updates. Built with Vue.js 3 + TypeScript (frontend), Node.js + Express + WebSockets (backend), and MongoDB (database).

---

Architecture

`
project-management-app/
├── client/                 # Vue.js 3 + TypeScript frontend
│   ├── public/             # index.html
│   └── src/                # App.vue, Dashboard.vue, TaskBoard.vue
├── server/                 # Node.js + Express + WebSocket backend
│   └── src/                # routes, controllers, models
├── docker-compose.yml      # MongoDB container orchestration
├── start-all.sh            # Helper script to run DB, backend, frontend
├── .gitignore              # Ignore node_modules, env, build artifacts
└── README.md               # This file
`

---

Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker + Docker Compose

---

Quick Start

1. Clone and Install

`bash
git clone https://github.com/chimaokem7tp-bitdev/project-management-app.git
cd project-management-app
`

2. Start Everything with One Command

`bash
./start-all.sh
`

- Frontend → http://localhost:5173  
- Backend → http://localhost:5000  
- MongoDB → localhost:27017  

---

Features

- Task CRUD (Create, Read, Update, Delete)
- Real‑time updates via WebSockets
- MongoDB persistence
- REST API with Express
- TypeScript support on both frontend and backend

---

API Endpoints

- GET /api/tasks → list tasks  
- POST /api/tasks → create task  
- PUT /api/tasks/:id → update task  
- DELETE /api/tasks/:id → delete task  

---

WebSocket Events

- Client → Server  
  - task:create → create new task  
  - task:update → update existing task  
  - task:delete → delete task  

- Server → Client  
  - task:created → broadcast new task  
  - task:updated → broadcast updated task  
  - task:deleted → broadcast deleted task  
  - tasks:list → send full task list on connect  

---

Project Structure

Client (client/)

`
src/
├── components/
│   └── TaskBoard.vue
├── pages/
│   └── Dashboard.vue
├── App.vue
└── main.ts
`

Server (server/)

`
src/
├── models/
│   └── Task.js
├── routes/
│   └── tasks.js
├── controllers/
│   └── taskController.js
└── index.js
`

---

Development Scripts

Client

`bash
npm run serve      # Start dev server
npm run build      # Build for production
`

Server

`bash
npm run dev        # Start dev server with nodemon
npm run start      # Run production build
`

---

Database Setup

MongoDB collection: tasks

`json
{
  "_id": "ObjectId",
  "title": "String",
  "completed": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
`

---

Troubleshooting

- Ensure Docker is running  
- Check .env values  
- Verify ports (5000 backend, 5173 frontend, 27017 MongoDB)  
- If WebSocket fails, confirm backend is running and client VITEAPIURL matches  

---

Deployment

- Frontend → Deploy to Netlify, Render, or any static hosting service  
- Backend → Deploy to Railway, Heroku, or Render with MongoDB Atlas connection string  

---

License

MIT
`