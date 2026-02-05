#!/bin/bash

# Project Management App Setup Verification Script
# This script checks if all required components are properly set up

echo "🔍 Project Management App Setup Verification"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js v16 or higher"
    ((errors++))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    ((errors++))
fi

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker -v)
    echo -e "${GREEN}✓${NC} $DOCKER_VERSION"
else
    echo -e "${RED}✗${NC} Docker not found. Please install Docker to run MongoDB"
    ((errors++))
fi

# Check Docker Compose
echo -n "Checking Docker Compose... "
if command -v docker-compose &> /dev/null; then
    DC_VERSION=$(docker-compose -v)
    echo -e "${GREEN}✓${NC} $DC_VERSION"
else
    echo -e "${YELLOW}⚠${NC} docker-compose not found (may be bundled with Docker Desktop)"
fi

echo ""

# Check directory structure
echo "Checking project structure..."
MISSING_FILES=0

if [ -d "client" ]; then
    echo -e "${GREEN}✓${NC} client/ directory exists"
else
    echo -e "${RED}✗${NC} client/ directory missing"
    ((MISSING_FILES++))
fi

if [ -d "server" ]; then
    echo -e "${GREEN}✓${NC} server/ directory exists"
else
    echo -e "${RED}✗${NC} server/ directory missing"
    ((MISSING_FILES++))
fi

if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓${NC} docker-compose.yml exists"
else
    echo -e "${RED}✗${NC} docker-compose.yml missing"
    ((MISSING_FILES++))
fi

if [ -f "README.md" ]; then
    echo -e "${GREEN}✓${NC} README.md exists"
else
    echo -e "${RED}✗${NC} README.md missing"
    ((MISSING_FILES++))
fi

echo ""

# Summary
if [ $errors -eq 0 ] && [ $MISSING_FILES -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Install client dependencies:  cd client && npm install"
    echo "2. Install server dependencies:  cd server && npm install"
    echo "3. Start MongoDB:                docker-compose up -d"
    echo "4. Create .env files:            cp client/.env.example client/.env && cp server/.env.example server/.env"
    echo "5. Start server:                 cd server && npm run dev"
    echo "6. Start client:                 cd client && npm run serve"
else
    echo -e "${RED}✗ Setup verification failed${NC}"
    echo "Please resolve the errors above before proceeding"
    exit 1
fi
