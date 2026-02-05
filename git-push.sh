#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Git Commit & Push Script ===${NC}\n"

# Check if git is initialized
if [ ! -d .git ]; then
  echo -e "${RED}Error: Not a git repository${NC}"
  exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${YELLOW}Current Branch: ${GREEN}${CURRENT_BRANCH}${NC}"

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}No changes to commit${NC}"
  exit 0
fi

# Show status
echo -e "\n${YELLOW}Changes to commit:${NC}"
git status --short

# Stage all changes
echo -e "\n${YELLOW}Staging all changes...${NC}"
git add -A
echo -e "${GREEN}✓ All changes staged${NC}"

# Commit with meaningful message
COMMIT_MSG="chore: add full-stack project management app boilerplate

- Frontend: Vue.js 3 + TypeScript with components and services
- Backend: Node.js + Express with REST API and WebSocket support
- Database: MongoDB with Mongoose schema
- Documentation: Comprehensive setup and development guides
- Tools: Docker Compose, ESLint, build configurations"

echo -e "\n${YELLOW}Committing changes...${NC}"
git commit -m "$COMMIT_MSG"
COMMIT_STATUS=$?

if [ $COMMIT_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ Changes committed successfully${NC}"
  
  # Push to remote
  echo -e "\n${YELLOW}Pushing to remote repository (${CURRENT_BRANCH})...${NC}"
  git push origin ${CURRENT_BRANCH}
  PUSH_STATUS=$?
  
  if [ $PUSH_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Successfully pushed to GitHub!${NC}"
    echo -e "\n${GREEN}=== Push Complete ===${NC}"
    echo -e "Repository: ${YELLOW}chimaokem7tp-bitdev/project-management-app${NC}"
    echo -e "Branch: ${YELLOW}${CURRENT_BRANCH}${NC}"
    exit 0
  else
    echo -e "${RED}✗ Failed to push to remote${NC}"
    exit 1
  fi
else
  echo -e "${RED}✗ Failed to commit changes${NC}"
  exit 1
fi
