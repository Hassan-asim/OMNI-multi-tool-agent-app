#!/usr/bin/env python3
"""
Test script for AI models integration
Verifies that GLM and GROQ APIs are working correctly
"""

import asyncio
import sys
import os

# Add backend to path
sys.path.append('backend')

from ai_models import model_manager

async def test_glm():
    """Test GLM model"""
    print("🧪 Testing GLM model...")
    try:
        messages = [
            {"role": "user", "content": "Hello! Can you help me create a task for tomorrow?"}
        ]
        
        response = await model_manager.generate_response(
            messages=messages,
            model_name='glm',
            temperature=0.7
        )
        
        print("✅ GLM Response:")
        print(f"   {response}")
        return True
        
    except Exception as e:
        print(f"❌ GLM Error: {e}")
        return False

async def test_groq():
    """Test GROQ model"""
    print("\n🧪 Testing GROQ model...")
    try:
        messages = [
            {"role": "user", "content": "What are some productivity tips for managing multiple tasks?"}
        ]
        
        response = await model_manager.generate_response(
            messages=messages,
            model_name='groq',
            temperature=0.7
        )
        
        print("✅ GROQ Response:")
        print(f"   {response}")
        return True
        
    except Exception as e:
        print(f"❌ GROQ Error: {e}")
        return False

async def test_tool_calling():
    """Test tool calling functionality"""
    print("\n🧪 Testing tool calling...")
    try:
        messages = [
            {"role": "user", "content": "I need to create a task called 'Review project proposal' with high priority"}
        ]
        
        tools = [
            {
                "name": "CreateTask",
                "description": "Creates a new task",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "priority": {"type": "string"}
                    }
                }
            }
        ]
        
        result = await model_manager.generate_with_tools(
            messages=messages,
            tools=tools,
            model_name='glm'
        )
        
        print("✅ Tool Calling Response:")
        print(f"   Content: {result.get('content', 'No content')}")
        print(f"   Tool Calls: {result.get('tool_calls', [])}")
        return True
        
    except Exception as e:
        print(f"❌ Tool Calling Error: {e}")
        return False

async def main():
    """Main test function"""
    print("🚀 Testing AI Models Integration")
    print("=" * 50)
    
    # Check available models
    available_models = model_manager.get_available_models()
    print(f"📋 Available models: {available_models}")
    
    if not available_models:
        print("❌ No AI models configured. Please check your API keys.")
        return
    
    # Test each model
    results = []
    
    if 'glm' in available_models:
        results.append(await test_glm())
    
    if 'groq' in available_models:
        results.append(await test_groq())
    
    # Test tool calling
    if available_models:
        results.append(await test_tool_calling())
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Total tests: {len(results)}")
    print(f"   Passed: {sum(results)}")
    print(f"   Failed: {len(results) - sum(results)}")
    
    if all(results):
        print("🎉 All tests passed! AI models are working correctly.")
    else:
        print("⚠️  Some tests failed. Please check your configuration.")

if __name__ == "__main__":
    asyncio.run(main())
