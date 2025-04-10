#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===== Stupid Simple Apps - Firebase Deployment =====${NC}"

# Check if Firebase is initialized
if [ ! -f ".firebaserc" ]; then
  echo -e "${RED}Error: Firebase project not initialized!${NC}"
  echo -e "Please run ${GREEN}./init-firebase.sh${NC} first to set up your Firebase project."
  exit 1
fi

# Check Firebase project ID
PROJECT_ID=$(grep -o '"default": "[^"]*"' .firebaserc | cut -d'"' -f4)
if [ "$PROJECT_ID" == "YOUR_FIREBASE_PROJECT_ID" ]; then
  echo -e "${RED}Error: Firebase project ID not set!${NC}"
  echo -e "Please edit ${GREEN}.firebaserc${NC} and replace 'YOUR_FIREBASE_PROJECT_ID' with your actual Firebase project ID."
  exit 1
fi

# Build the project
echo -e "\n${YELLOW}Step 1/2: Building the project...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Build failed!${NC}"
  exit 1
fi

echo -e "${GREEN}Build completed successfully!${NC}"

# Deploy to Firebase
echo -e "\n${YELLOW}Step 2/2: Deploying to Firebase...${NC}"
echo -e "Deploying to project: ${GREEN}$PROJECT_ID${NC}"
npx firebase deploy

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Deployment failed!${NC}"
  exit 1
fi

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}🚀 Deployment successful!${NC}"
echo -e "${GREEN}==================================${NC}"
echo -e "Your website is now live at: ${YELLOW}https://$PROJECT_ID.web.app${NC}"