#!/bin/bash

# Quick Start Script for Project Management App
# Run this script to automatically set up and start the development environment

set -e

echo "🚀 Project Management App - Quick Start"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v16 or higher"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"

echo "Installing client dependencies..."
cd client
npm install > /dev/null 2>&1
cd ..

echo "Installing server dependencies..."
cd server
npm install > /dev/null 2>&1
cd ..

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Create .env files if they don't exist
echo -e "${BLUE}Setting up environment variables...${NC}"

if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    echo "Created client/.env"
fi

if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo "Created server/.env"
fi

echo -e "${GREEN}✓ Environment variables configured${NC}"
echo ""

# Start MongoDB
echo -e "${BLUE}Starting MongoDB...${NC}"
docker-compose down > /dev/null 2>&1 || true
docker-compose up -d > /dev/null 2>&1

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 5

echo -e "${GREEN}✓ MongoDB started${NC}"
echo ""

# Summary
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo ""
echo -e "${YELLOW}Terminal 1 - Start Backend:${NC}"
echo "  cd server && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Start Frontend:${NC}"
echo "  cd client && npm run serve"
echo ""
echo "Then open your browser to: http://localhost:5173"
echo ""
echo "To stop MongoDB:"
echo "  docker-compose down"
echo ""
echo "For detailed setup instructions, see SETUP_GUIDE.md"
