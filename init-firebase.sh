#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
echo -e "${YELLOW}===============================================${NC}"
echo -e "${YELLOW}===== Stupid Simple Apps - Firebase Setup =====${NC}"
echo -e "${YELLOW}===============================================${NC}"
echo -e "\n${BLUE}This script will guide you through setting up Firebase hosting for your project.${NC}"
echo -e "\n${YELLOW}Prerequisites:${NC}"
echo -e "1. You need a Google account"
echo -e "2. Create a Firebase project at ${GREEN}https://console.firebase.google.com${NC}"
echo -e "3. Make note of your Firebase project ID"

echo -e "\n${YELLOW}Important Notes:${NC}"
echo -e "• When prompted to specify your public directory, enter: ${GREEN}dist/public${NC}"
echo -e "• When asked about single-page app rewrites, select ${GREEN}yes${NC}"
echo -e "• When asked to overwrite existing files, select ${GREEN}no${NC} to keep your current configurations"

echo -e "\n${YELLOW}Press Enter to continue...${NC}"
read

# Check if Firebase CLI is installed
echo -e "\n${YELLOW}Step 1/3: Checking Firebase CLI...${NC}"
if ! command -v npx firebase &> /dev/null; then
  echo -e "${RED}Firebase CLI not found. It should be installed via firebase-tools in package.json.${NC}"
  exit 1
fi
echo -e "${GREEN}Firebase CLI is available.${NC}"

# Login to Firebase
echo -e "\n${YELLOW}Step 2/3: Logging in to Firebase...${NC}"
echo -e "This will open a browser window to log in to your Google account."
echo -e "${BLUE}If you're in a environment without a browser, use the URL provided to authenticate.${NC}"
npx firebase login

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Firebase login failed. Please try again.${NC}"
  exit 1
fi

# Initialize Firebase
echo -e "\n${YELLOW}Step 3/3: Initializing Firebase Hosting...${NC}"
echo -e "You'll be prompted to answer a few questions:"
echo -e "1. Select your Firebase project"
echo -e "2. For public directory, enter: ${GREEN}dist/public${NC}"
echo -e "3. For single-page app, answer: ${GREEN}yes${NC}"
echo -e "4. For GitHub workflow, answer: ${GREEN}no${NC}"
echo -e "5. For file overwrites, answer: ${GREEN}no${NC} to keep your configurations"

npx firebase init hosting

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Firebase initialization failed. Please try again.${NC}"
  exit 1
fi

# Update .firebaserc with project ID
PROJECT_ID=$(grep -o '"default": "[^"]*"' .firebaserc | cut -d'"' -f4)
if [ "$PROJECT_ID" == "YOUR_FIREBASE_PROJECT_ID" ]; then
  echo -e "\n${YELLOW}WARNING: Project ID not automatically set in .firebaserc${NC}"
  echo -e "Please edit ${GREEN}.firebaserc${NC} and replace 'YOUR_FIREBASE_PROJECT_ID' with your actual Firebase project ID."
else
  echo -e "\n${GREEN}Success! Firebase project ID set to: $PROJECT_ID${NC}"
fi

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}Firebase initialization complete!${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e "\nTo deploy your app, run: ${YELLOW}./deploy-firebase.sh${NC}"
echo -e "Your website will be available at: ${YELLOW}https://$PROJECT_ID.web.app${NC}"