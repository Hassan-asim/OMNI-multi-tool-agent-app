#!/usr/bin/env python3
"""
Test script for the Intelligent Agent
Demonstrates natural language understanding and action execution
"""

import asyncio
import sys
import os

# Add backend to path
sys.path.append('backend')

from intelligent_agent import IntelligentAgent
from service_connectors import ServiceManager
from context_engine import ContextEngine
from automation_engine import AutomationEngine

async def test_intelligent_agent():
    """Test the intelligent agent with various natural language inputs"""
    
    # Initialize components
    service_manager = ServiceManager()
    context_engine = ContextEngine()
    automation_engine = AutomationEngine(service_manager, context_engine)
    intelligent_agent = IntelligentAgent(service_manager, context_engine, automation_engine)
    
    # Test cases
    test_cases = [
        "I need to create a task to review the project proposal by tomorrow",
        "Send an email to john@example.com about the meeting",
        "Post on Twitter about our new product launch",
        "What's my schedule for today?",
        "Search for information about AI trends",
        "Automate sending a reminder when I receive an email from my boss",
        "I should call my mom this weekend",
        "Schedule a meeting with the team for next Monday at 2 PM",
        "Create a high priority task to fix the bug in the login system",
        "Post on Facebook about the company party"
    ]
    
    print("🧠 Testing Intelligent Agent")
    print("=" * 60)
    
    for i, test_input in enumerate(test_cases, 1):
        print(f"\n📝 Test Case {i}: {test_input}")
        print("-" * 40)
        
        try:
            # Create context
            context = {
                'current_time': '2024-01-15 14:30:00',
                'location': 'Office',
                'energy_level': 'High',
                'current_focus': 'Work',
                'recent_activity': 'Coding'
            }
            
            # Process the input
            result = await intelligent_agent.process_natural_input(
                test_input, 
                context, 
                f"test_session_{i}"
            )
            
            # Display results
            print(f"✅ Response: {result['response']}")
            
            if result.get('intent'):
                intent = result['intent']
                print(f"🎯 Intent: {intent.get('primary_intent', 'Unknown')}")
                print(f"📊 Confidence: {intent.get('confidence', 0)}%")
                print(f"📂 Category: {intent.get('category', 'Unknown')}")
                print(f"⚡ Urgency: {intent.get('urgency', 'Unknown')}")
            
            if result.get('entities'):
                entities = result['entities']
                print(f"🔍 Entities: {entities}")
            
            if result.get('actions_taken'):
                actions = result['actions_taken']
                print(f"⚙️  Actions Taken: {len(actions)}")
                for action in actions:
                    print(f"   - {action.get('action', 'Unknown')}: {action.get('result', 'No result')}")
            
            if result.get('suggestions'):
                suggestions = result['suggestions']
                print(f"💡 Suggestions: {suggestions}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print()
    
    print("=" * 60)
    print("🎉 Intelligent Agent testing completed!")

async def test_intent_analysis():
    """Test intent analysis specifically"""
    print("\n🔍 Testing Intent Analysis")
    print("=" * 40)
    
    # Initialize components
    service_manager = ServiceManager()
    context_engine = ContextEngine()
    automation_engine = AutomationEngine(service_manager, context_engine)
    intelligent_agent = IntelligentAgent(service_manager, context_engine, automation_engine)
    
    test_inputs = [
        "I need to buy groceries",
        "Call my doctor tomorrow",
        "Post a photo on Instagram",
        "What's the weather like?",
        "Set up an automation for emails",
        "Schedule a team meeting",
        "Send a message to Sarah",
        "Create a reminder for the deadline"
    ]
    
    for test_input in test_inputs:
        try:
            context = {'current_time': '2024-01-15 14:30:00'}
            intent = await intelligent_agent._analyze_intent(test_input, context)
            
            print(f"Input: {test_input}")
            print(f"Intent: {intent.get('primary_intent', 'Unknown')}")
            print(f"Category: {intent.get('category', 'Unknown')}")
            print(f"Confidence: {intent.get('confidence', 0)}%")
            print()
            
        except Exception as e:
            print(f"Error analyzing '{test_input}': {e}")

async def main():
    """Main test function"""
    print("🚀 Starting Intelligent Agent Tests")
    print("=" * 60)
    
    # Test intent analysis
    await test_intent_analysis()
    
    # Test full intelligent agent
    await test_intelligent_agent()
    
    print("\n✨ All tests completed!")

if __name__ == "__main__":
    asyncio.run(main())
