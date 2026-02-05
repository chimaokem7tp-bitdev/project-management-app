
!/bin/bash
set -e

echo "🚀 Starting Project Management App..."

1) Start MongoDB
echo "📦 Starting MongoDB..."
docker-compose up -d mongo

2) Start backend
echo "🖥️ Starting backend server..."
cd server
npm install
npm run dev &
BACKEND_PID=$!
cd ..

3) Start frontend
echo "🌐 Starting frontend client..."
cd client
npm install
npm run serve &
FRONTEND_PID=$!
cd ..

Cleanup on exit
trap "echo '🛑 Stopping servers...'; kill $BACKENDPID $FRONTENDPID; docker-compose down" EXIT

wait
