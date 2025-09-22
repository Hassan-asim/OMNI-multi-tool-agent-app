#!/bin/bash

# Omni Universal Assistant - Vercel Deployment Script
echo "🚀 Deploying Omni Universal Assistant to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Set environment variables
echo "🔧 Setting up environment variables..."

# Check if .env file exists
if [ -f .env ]; then
    echo "📋 Found .env file. Please add these variables to Vercel:"
    echo ""
    cat .env
    echo ""
    echo "⚠️  Make sure to add these to your Vercel project settings!"
    echo ""
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variables in Project Settings"
echo "3. Redeploy if needed: vercel --prod"
echo ""
echo "🔗 Your app should be live at: https://your-project.vercel.app"
