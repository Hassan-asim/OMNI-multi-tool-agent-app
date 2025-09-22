from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from datetime import datetime

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from intelligent_agent import IntelligentAgent
    from service_connectors import ServiceManager
    from automation_engine import AutomationEngine
    from context_engine import ContextEngine
except ImportError:
    # Fallback for missing dependencies
    class MockIntelligentAgent:
        async def process_natural_input(self, user_input, context, session_id):
            return {
                'response': 'Intelligent AI service temporarily unavailable. Please try again later.',
                'intent': {'primary_intent': 'general_query', 'confidence': 50},
                'entities': {},
                'actions_taken': [],
                'suggestions': ['Try asking about tasks', 'Ask about your schedule', 'Request help with organization'],
                'context_updated': False
            }
    
    class MockServiceManager:
        pass
    
    class MockContextEngine:
        def get_context(self):
            return {
                'current_time': datetime.now().isoformat(),
                'location': 'Unknown',
                'energy_level': 'medium',
                'current_focus': 'General',
                'recent_activity': 'None'
            }
    
    class MockAutomationEngine:
        def __init__(self, service_manager, context_engine):
            pass

# Initialize components
try:
    service_manager = ServiceManager()
    context_engine = ContextEngine()
    automation_engine = MockAutomationEngine(service_manager, context_engine)
    intelligent_agent = IntelligentAgent(service_manager, context_engine, automation_engine)
except:
    service_manager = MockServiceManager()
    context_engine = MockContextEngine()
    automation_engine = MockAutomationEngine(service_manager, context_engine)
    intelligent_agent = MockIntelligentAgent()

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            message = data.get('message', '')
            session_id = data.get('session_id', 'default')
            context = data.get('context', {})
            
            if not message:
                self.send_error_response(400, "Message is required")
                return
            
            # Get current context
            current_context = context_engine.get_context()
            
            # Process message with intelligent agent
            import asyncio
            response = asyncio.run(intelligent_agent.process_natural_input(message, current_context, session_id))
            
            self.send_success_response({
                "success": True,
                "response": response['response'],
                "intent": response.get('intent', {}),
                "entities": response.get('entities', {}),
                "actions_taken": response.get('actions_taken', []),
                "suggestions": response.get('suggestions', []),
                "context": current_context
            })
            
        except Exception as e:
            self.send_error_response(500, str(e))
    
    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        response = {"success": False, "error": message}
        self.wfile.write(json.dumps(response).encode())
