
Project Management App

A full‑stack project management application with real‑time task updates. Built with Vue.js 3 + TypeScript (frontend), Node.js + Express + WebSockets (backend), and MongoDB (database).

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

Quick Start

`bash
./start-all.sh
`

Frontend → http://localhost:5173  
Backend → http://localhost:5000  
MongoDB → localhost:27017  
