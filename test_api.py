#!/usr/bin/env python3
"""
Test script for API endpoints
"""

import requests
import json
import sys
import os

# Add api directory to path
sys.path.append('api')

def test_health_endpoint():
    """Test the health endpoint"""
    print("🧪 Testing Health Endpoint...")
    
    try:
        # Import and test the health handler
        from health import handler
        
        # Create a mock request
        class MockRequest:
            def __init__(self):
                self.headers = {}
                self.rfile = None
                self.wfile = None
            
            def send_response(self, code):
                print(f"✅ Response code: {code}")
            
            def send_header(self, name, value):
                print(f"📋 Header: {name}: {value}")
            
            def end_headers(self):
                print("📋 Headers sent")
            
            def wfile_write(self, data):
                print(f"📤 Response: {data.decode()}")
        
        # Test the handler
        mock_req = MockRequest()
        handler_instance = handler()
        handler_instance.rfile = mock_req.rfile
        handler_instance.wfile = mock_req.wfile
        handler_instance.headers = mock_req.headers
        
        handler_instance.do_GET()
        print("✅ Health endpoint test passed!")
        
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")

def test_chat_endpoint():
    """Test the chat endpoint"""
    print("\n🧪 Testing Chat Endpoint...")
    
    try:
        from chat import handler
        
        # Create a mock request
        class MockRequest:
            def __init__(self):
                self.headers = {'Content-Length': '50'}
                self.rfile = None
                self.wfile = None
            
            def send_response(self, code):
                print(f"✅ Response code: {code}")
            
            def send_header(self, name, value):
                print(f"📋 Header: {name}: {value}")
            
            def end_headers(self):
                print("📋 Headers sent")
            
            def wfile_write(self, data):
                print(f"📤 Response: {data.decode()}")
        
        # Test the handler
        mock_req = MockRequest()
        handler_instance = handler()
        handler_instance.rfile = mock_req.rfile
        handler_instance.wfile = mock_req.wfile
        handler_instance.headers = mock_req.headers
        
        # Mock the rfile.read method
        test_data = json.dumps({"message": "Hello, test message", "session_id": "test"}).encode()
        handler_instance.rfile.read = lambda x: test_data
        
        handler_instance.do_POST()
        print("✅ Chat endpoint test passed!")
        
    except Exception as e:
        print(f"❌ Chat endpoint test failed: {e}")

def test_ai_models():
    """Test AI models"""
    print("\n🧪 Testing AI Models...")
    
    try:
        from simple_ai_models import model_manager
        
        available_models = model_manager.get_available_models()
        print(f"📋 Available models: {available_models}")
        
        if available_models:
            print("✅ AI models loaded successfully!")
        else:
            print("⚠️  No AI models available (API keys not set)")
        
    except Exception as e:
        print(f"❌ AI models test failed: {e}")

def main():
    """Run all tests"""
    print("🚀 Testing Omni Universal Assistant API...")
    print("=" * 50)
    
    test_health_endpoint()
    test_chat_endpoint()
    test_ai_models()
    
    print("\n" + "=" * 50)
    print("🎉 API testing completed!")

if __name__ == "__main__":
    main()
