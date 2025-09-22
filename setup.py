#!/usr/bin/env python3
"""
Setup script for Omni Universal Assistant
Configures the environment and installs dependencies
"""

import os
import subprocess
import sys

def create_env_file():
    """Create .env file for backend"""
    env_content = """# AI Model Configuration
GLM_API_KEY=
GROQ_API_KEY=

# Social Media API Keys
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# Other API Keys (add as needed)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token
"""
    
    with open('backend/.env', 'w') as f:
        f.write(env_content)
    print("✅ Created backend/.env file")

def create_frontend_env():
    """Create .env file for frontend"""
    env_content = """# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

# AI Model Configuration
GLM_API_KEY=
GROQ_API_KEY=

# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# Social Media API Keys
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
"""
    
    with open('src/.env', 'w') as f:
        f.write(env_content)
    print("✅ Created src/.env file")

def install_backend_dependencies():
    """Install Python dependencies"""
    print("📦 Installing backend dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'backend/requirements.txt'], check=True)
        print("✅ Backend dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing backend dependencies: {e}")
        return False
    return True

def install_frontend_dependencies():
    """Install Node.js dependencies"""
    print("📦 Installing frontend dependencies...")
    try:
        subprocess.run(['npm', 'install'], cwd='src', check=True)
        print("✅ Frontend dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing frontend dependencies: {e}")
        return False
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up Omni Universal Assistant...")
    print("=" * 50)
    
    # Create environment files
    create_env_file()
    create_frontend_env()
    
    # Install dependencies
    if not install_backend_dependencies():
        print("❌ Setup failed at backend dependencies")
        return
    
    if not install_frontend_dependencies():
        print("❌ Setup failed at frontend dependencies")
        return
    
    print("=" * 50)
    print("🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend: cd backend && python app.py")
    print("2. Start the frontend: cd src && npm start")
    print("3. Open http://localhost:3000 in your browser")
    print("\n🔧 Configuration:")
    print("- Firebase is already configured")
    print("- GLM and GROQ APIs are configured")
    print("- Facebook API is configured")
    print("- Twitter API setup guide: TWITTER_API_SETUP.md")
    print("- Add other social media API keys in backend/.env as needed")
    
    print("\n📚 Next Steps:")
    print("1. Get Twitter API keys (see TWITTER_API_SETUP.md)")
    print("2. Test AI models: python test_ai_models.py")
    print("3. Test intelligent agent: python test_intelligent_agent.py")
    print("4. Start development: python start_dev.py")

if __name__ == "__main__":
    main()
