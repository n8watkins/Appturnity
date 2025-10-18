#!/bin/bash

# This script sets up environment variables for Firebase Functions
# You need to provide your actual values

echo "Setting up Firebase Functions environment variables..."
echo ""
echo "Please have these values ready:"
echo "- RESEND_API_KEY (from resend.com)"
echo "- CONTACT_EMAIL (your email address)"
echo "- RECAPTCHA_SECRET_KEY (from Google reCAPTCHA)"
echo "- RESEND_FROM_EMAIL (your sender email)"
echo ""
read -p "Press Enter when ready to continue..."

# Set environment variables using Firebase CLI
# Note: Remove the --project flag if you want to use the default project

firebase functions:config:set \
  resend.api_key="YOUR_RESEND_API_KEY" \
  contact.email="nathancwatkins23@gmail.com" \
  recaptcha.secret_key="YOUR_RECAPTCHA_SECRET_KEY" \
  resend.from_email="Appturnity Contact Form <onboarding@resend.dev>"

echo ""
echo "Environment variables set!"
echo ""
echo "To view the current config, run:"
echo "  firebase functions:config:get"
