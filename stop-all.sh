#!/bin/bash

# Stop all services script

echo "🛑 Stopping Project Management App Services"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Kill background processes
echo -e "${BLUE}Stopping servers...${NC}"

# Find and kill processes on specific ports
for port in 3001 5173 27017; do
    echo "Checking port $port..."
    if lsof -i :$port > /dev/null 2>&1; then
        pid=$(lsof -ti :$port)
        if [ ! -z "$pid" ]; then
            kill -9 $pid 2>/dev/null && echo -e "${GREEN}✓${NC} Process on port $port stopped" || echo -e "${RED}✗${NC} Failed to stop process on port $port"
        fi
    fi
done

echo ""

# Stop Docker containers
echo -e "${BLUE}Stopping MongoDB container...${NC}"
docker-compose down > /dev/null 2>&1 && echo -e "${GREEN}✓${NC} MongoDB stopped" || echo -e "${RED}✗${NC} MongoDB already stopped"

echo ""
echo -e "${GREEN}✓ All services stopped${NC}"
