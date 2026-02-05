# QUICK START - 5 Minute Setup

## Prerequisites Check
```bash
node --version    # Should be v16 or higher
npm --version
docker --version
docker-compose --version
```

## Step 1: Automated Setup (Recommended)
```bash
# Make script executable
chmod +x quick-start.sh

# Run automated setup
./quick-start.sh

# This will:
# ✓ Install all dependencies
# ✓ Create environment files
# ✓ Start MongoDB container
```

## Step 2: Start Backend
Open a new terminal:
```bash
cd server
npm run dev
```

Expected output:
```
Connected to MongoDB
Server is running on port 3001
Health check: http://localhost:3001/health
```

## Step 3: Start Frontend
Open another new terminal:
```bash
cd client
npm run serve
```

Expected output:
```
VITE v5.0.0  ready in 250 ms

➜  Local:   http://localhost:5173/
```

## Step 4: Open Application
Open your browser to: **http://localhost:5173**

## ✓ Done!

You should now see the Project Management App with:
- Empty task board (Active Tasks and Completed Tasks columns)
- Task creation form at the top
- Real-time connection indicator (purple gradient header)
- Green "Real-time Connected" status

## Test It Out

1. **Create a Task**: Type in the form and click "Add Task"
2. **Mark as Complete**: Click the checkbox on any task
3. **Edit a Task**: Click the edit icon (✎) to modify
4. **Delete a Task**: Click the delete icon (🗑)

## Troubleshooting Quick Fixes

### MongoDB not starting?
```bash
docker ps
docker-compose restart
```

### Port 3001 already in use?
```bash
lsof -i :3001
kill -9 <PID>
```

### Port 5173 already in use?
```bash
lsof -i :5173
kill -9 <PID>
```

### Dependencies missing?
```bash
cd client && npm install && cd ..
cd server && npm install && cd ..
```

## Stop All Services
```bash
chmod +x stop-all.sh
./stop-all.sh
```

## Next Steps

1. Read the full setup guide: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Understand the architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Learn the API: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
4. Follow best practices: [DEVELOPMENT.md](./DEVELOPMENT.md)

## Useful Commands Reference

```bash
# Frontend
cd client
npm run serve           # Dev server
npm run build           # Production build
npm run lint            # ESLint

# Backend
cd server
npm run dev             # Dev server with auto-reload
npm run build           # Compile TypeScript
npm run start           # Run compiled version
npm run lint            # ESLint

# Database
docker-compose up -d    # Start
docker-compose down     # Stop
docker-compose logs -f  # View logs
docker-compose restart  # Restart
```

## File Locations Reference

- **Frontend**: `client/src/`
- **Backend**: `server/src/`
- **Database Config**: `docker-compose.yml`
- **Environment Variables**: `.env` files (created from `.env.example`)
- **Documentation**: `*.md` files in root directory

## API Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion |

## WebSocket Events

- `tasks:list` - Initial task list on connect
- `task:created` - Task created event
- `task:updated` - Task updated event
- `task:deleted` - Task deleted event

---

**Need help?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting) for more troubleshooting.
