from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta
import asyncio
from threading import Thread
import time

# Load environment variables
load_dotenv()

# Import our custom modules
from omni_agent_simple import OmniAgent
from intelligent_agent import IntelligentAgent
from service_connectors import ServiceManager
from automation_engine import AutomationEngine
from context_engine import ContextEngine
from social_providers import (
    publish_to_twitter,
    publish_to_linkedin,
    publish_to_instagram,
    publish_to_facebook,
    publish_to_slack,
    publish_to_email,
)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize core components
service_manager = ServiceManager()
context_engine = ContextEngine()
automation_engine = AutomationEngine(service_manager, context_engine)
omni_agent = OmniAgent(service_manager, context_engine, automation_engine)
intelligent_agent = IntelligentAgent(service_manager, context_engine, automation_engine)

# Global state for real-time updates
active_sessions = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/connect-service', methods=['POST'])
def connect_service():
    """Connect a new service to Omni"""
    data = request.get_json()
    service_type = data.get('service_type')
    credentials = data.get('credentials')
    
    try:
        result = service_manager.connect_service(service_type, credentials)
        return jsonify({"success": True, "message": f"Connected to {service_type}", "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/disconnect-service', methods=['POST'])
def disconnect_service():
    """Disconnect a service from Omni"""
    data = request.get_json()
    service_type = data.get('service_type')
    
    try:
        service_manager.disconnect_service(service_type)
        return jsonify({"success": True, "message": f"Disconnected from {service_type}"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/chat', methods=['POST'])
def chat_with_omni():
    """Main chat endpoint for interacting with Omni"""
    data = request.get_json()
    message = data.get('message')
    session_id = data.get('session_id', 'default')
    context = data.get('context', {})
    
    try:
        # Get current context
        current_context = context_engine.get_context()
        
        # Process the message through Omni agent
        response = asyncio.run(omni_agent.process_message(message, current_context, session_id))
        
        # Store session data
        if session_id not in active_sessions:
            active_sessions[session_id] = {
                'messages': [],
                'context': current_context,
                'last_activity': datetime.now()
            }
        
        active_sessions[session_id]['messages'].append({
            'user': message,
            'omni': response['response'],
            'timestamp': datetime.now().isoformat(),
            'actions_taken': response.get('actions_taken', [])
        })
        active_sessions[session_id]['last_activity'] = datetime.now()
        
        # Emit real-time updates if any actions were taken
        if response.get('actions_taken'):
            socketio.emit('actions_completed', {
                'session_id': session_id,
                'actions': response['actions_taken']
            })
        
        return jsonify({
            "success": True,
            "response": response['response'],
            "actions_taken": response.get('actions_taken', []),
            "suggestions": response.get('suggestions', []),
            "context": current_context
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/intelligent-chat', methods=['POST'])
def intelligent_chat():
    """Intelligent chat endpoint that understands natural language and executes actions"""
    data = request.get_json()
    message = data.get('message')
    session_id = data.get('session_id', 'default')
    context = data.get('context', {})
    
    try:
        # Get current context
        current_context = context_engine.get_context()
        
        # Process message with intelligent agent
        response = asyncio.run(intelligent_agent.process_natural_input(message, current_context, session_id))
        
        # Store session data
        if session_id not in active_sessions:
            active_sessions[session_id] = {
                'messages': [],
                'context': current_context,
                'last_activity': datetime.now()
            }
        
        active_sessions[session_id]['messages'].append({
            'user': message,
            'omni': response['response'],
            'timestamp': datetime.now().isoformat(),
            'intent': response.get('intent', {}),
            'entities': response.get('entities', {}),
            'actions_taken': response.get('actions_taken', [])
        })
        active_sessions[session_id]['last_activity'] = datetime.now()
        
        # Emit real-time updates if any actions were taken
        if response.get('actions_taken'):
            socketio.emit('intelligent_actions_completed', {
                'session_id': session_id,
                'intent': response.get('intent', {}),
                'actions': response['actions_taken']
            })
        
        return jsonify({
            "success": True,
            "response": response['response'],
            "intent": response.get('intent', {}),
            "entities": response.get('entities', {}),
            "actions_taken": response.get('actions_taken', []),
            "suggestions": response.get('suggestions', []),
            "context": current_context
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    """Get comprehensive dashboard data"""
    try:
        dashboard_data = {
            'tasks': service_manager.get_all_tasks(),
            'messages': service_manager.get_all_messages(),
            'calendar': service_manager.get_calendar_events(),
            'life_metrics': context_engine.get_life_metrics(),
            'automations': automation_engine.get_active_automations(),
            'insights': context_engine.get_insights()
        }
        return jsonify({"success": True, "data": dashboard_data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks from connected services"""
    try:
        tasks = service_manager.get_all_tasks()
        return jsonify({"success": True, "tasks": tasks})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    data = request.get_json()
    try:
        task = service_manager.create_task(
            title=data.get('title'),
            description=data.get('description'),
            priority=data.get('priority', 'medium'),
            due_date=data.get('due_date'),
            service=data.get('service', 'auto')
        )
        return jsonify({"success": True, "task": task})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Get messages from all communication channels"""
    try:
        messages = service_manager.get_all_messages()
        return jsonify({"success": True, "messages": messages})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/send-message', methods=['POST'])
def send_message():
    """Send a message via the best channel"""
    data = request.get_json()
    try:
        result = service_manager.send_message(
            message=data.get('message'),
            recipient=data.get('recipient'),
            channel=data.get('channel', 'auto')
        )
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/automations', methods=['GET'])
def get_automations():
    """Get all active automations"""
    try:
        automations = automation_engine.get_active_automations()
        return jsonify({"success": True, "automations": automations})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/automations', methods=['POST'])
def create_automation():
    """Create a new automation"""
    data = request.get_json()
    try:
        automation = automation_engine.create_automation(
            name=data.get('name'),
            trigger=data.get('trigger'),
            actions=data.get('actions'),
            conditions=data.get('conditions', [])
        )
        return jsonify({"success": True, "automation": automation})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Get AI-powered insights about user's digital life"""
    try:
        insights = context_engine.get_insights()
        return jsonify({"success": True, "insights": insights})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/context', methods=['GET'])
def get_context():
    """Get current user context"""
    try:
        context = context_engine.get_context()
        return jsonify({"success": True, "context": context})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get productivity and life analytics"""
    try:
        analytics = context_engine.get_analytics()
        return jsonify({"success": True, "analytics": analytics})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Social publishing proxy (uses env credentials server-side)
@app.route('/api/social/publish', methods=['POST'])
def social_publish():
    data = request.get_json() or {}
    post_id = data.get('postId')
    platforms = data.get('platforms', [])
    # TODO: Load user tokens from DB by post_id or session and pass to providers
    content = ""  # Load post content from DB if needed
    results = {}
    for p in platforms:
        if p == 'twitter':
            results[p] = publish_to_twitter(content, {})
        elif p == 'linkedin':
            results[p] = publish_to_linkedin(content, {})
        elif p == 'instagram':
            results[p] = publish_to_instagram(content, {})
        elif p == 'facebook':
            results[p] = publish_to_facebook(content, {})
        elif p == 'slack':
            results[p] = publish_to_slack(content, {})
        elif p == 'email':
            results[p] = publish_to_email("Post", content, {})
        else:
            results[p] = {"success": False, "error": "Unsupported platform"}
    return jsonify({"success": True, "results": results})

# WebSocket events
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connected', {'message': 'Connected to Omni'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_session')
def handle_join_session(data):
    session_id = data.get('session_id', 'default')
    active_sessions[session_id] = {
        'messages': [],
        'context': context_engine.get_context(),
        'last_activity': datetime.now()
    }
    emit('session_joined', {'session_id': session_id})

# Background task for real-time updates
def background_updates():
    """Send periodic updates to connected clients"""
    while True:
        try:
            # Check for new messages, tasks, etc.
            updates = service_manager.check_for_updates()
            if updates:
                socketio.emit('updates', updates)
            
            # Update context periodically
            context_engine.update_context()
            
            time.sleep(30)  # Check every 30 seconds
        except Exception as e:
            print(f"Error in background updates: {e}")
            time.sleep(60)

# Start background thread
update_thread = Thread(target=background_updates, daemon=True)
update_thread.start()

if __name__ == '__main__':
    print("🚀 Starting Omni Universal Assistant...")
    print("📱 Frontend: http://localhost:3000")
    print("🔧 Backend: http://localhost:5000")
    print("🤖 AI Agent: Ready")
    print("🔌 Service Connectors: Initializing...")
    
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
