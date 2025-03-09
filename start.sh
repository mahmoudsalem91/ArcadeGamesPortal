#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Arcade Games Portal...${NC}"

# Check if Node.js is installed
if ! [ -x "$(command -v node)" ]; then
  echo -e "${RED}Error: Node.js is not installed.${NC}" >&2
  exit 1
fi

# Check if npm is installed
if ! [ -x "$(command -v npm)" ]; then
  echo -e "${RED}Error: npm is not installed.${NC}" >&2
  exit 1
fi

# Build the TypeScript project
echo -e "${GREEN}Building TypeScript project...${NC}"
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Build failed.${NC}" >&2
  exit 1
fi

# Check if MongoDB is running
echo -e "${GREEN}Checking MongoDB connection...${NC}"
mongo --eval "db.stats()" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo -e "${RED}Warning: MongoDB might not be running. The application may not function correctly.${NC}" >&2
fi

# Start the application
echo -e "${GREEN}Starting Node.js application...${NC}"
NODE_ENV=production node dist/index.js &
PID=$!

echo -e "${GREEN}Application started with PID $PID${NC}"
echo -e "${GREEN}You can access the application at http://localhost:3000${NC}"
echo -e "${GREEN}To stop the application, run: kill $PID${NC}"

# Save PID to file for later reference
echo $PID > app.pid 