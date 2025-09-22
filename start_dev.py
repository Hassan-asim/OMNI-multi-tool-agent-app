#!/usr/bin/env python3
"""
Development startup script for Omni Universal Assistant
Starts both backend and frontend servers
"""

import subprocess
import sys
import time
import os
from threading import Thread

def start_backend():
    """Start the backend server"""
    print("🔧 Starting backend server...")
    try:
        os.chdir('backend')
        subprocess.run([sys.executable, 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting backend: {e}")

def start_frontend():
    """Start the frontend server"""
    print("🎨 Starting frontend server...")
    try:
        os.chdir('src')
        subprocess.run(['npm', 'start'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting frontend: {e}")

def main():
    """Main function"""
    print("🚀 Starting Omni Universal Assistant Development Servers...")
    print("=" * 60)
    print("Backend: http://localhost:5000")
    print("Frontend: http://localhost:3000")
    print("=" * 60)
    print("Press Ctrl+C to stop both servers")
    print()
    
    # Start backend in a separate thread
    backend_thread = Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start frontend in the main thread
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        sys.exit(0)

if __name__ == "__main__":
    main()
