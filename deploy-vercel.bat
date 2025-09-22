@echo off
REM Omni Universal Assistant - Vercel Deployment Script for Windows

echo 🚀 Deploying Omni Universal Assistant to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if user is logged in
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please log in to Vercel...
    vercel login
)

REM Set environment variables
echo 🔧 Setting up environment variables...

REM Check if .env file exists
if exist .env (
    echo 📋 Found .env file. Please add these variables to Vercel:
    echo.
    type .env
    echo.
    echo ⚠️  Make sure to add these to your Vercel project settings!
    echo.
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo.
echo ✅ Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Go to your Vercel dashboard
echo 2. Add environment variables in Project Settings
echo 3. Redeploy if needed: vercel --prod
echo.
echo 🔗 Your app should be live at: https://your-project.vercel.app

pause
