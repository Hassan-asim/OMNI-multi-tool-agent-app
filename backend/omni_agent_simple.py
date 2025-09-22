"""
Simplified Omni Agent - Core AI Agent
Works without complex LangChain dependencies
"""

import json
from datetime import datetime
from typing import Dict, List, Any, Optional
from ai_models import model_manager

class OmniAgent:
    """
    Simplified AI agent that understands user intent and orchestrates actions
    """
    
    def __init__(self, service_manager, context_engine, automation_engine):
        self.service_manager = service_manager
        self.context_engine = context_engine
        self.automation_engine = automation_engine
        self.model_manager = model_manager
        
        # Initialize tools
        self.tools = self._initialize_tools()
    
    def _initialize_tools(self) -> List[Dict]:
        """Initialize all available tools for the agent"""
        tools = [
            {
                'name': 'create_task',
                'description': 'Create a new task',
                'func': self._create_task_tool
            },
            {
                'name': 'send_message',
                'description': 'Send a message',
                'func': self._send_message_tool
            },
            {
                'name': 'post_social',
                'description': 'Post to social media',
                'func': self._post_social_tool
            },
            {
                'name': 'schedule_meeting',
                'description': 'Schedule a meeting',
                'func': self._schedule_meeting_tool
            },
            {
                'name': 'get_weather',
                'description': 'Get weather information',
                'func': self._get_weather_tool
            },
            {
                'name': 'search_information',
                'description': 'Search for information',
                'func': self._search_information_tool
            }
        ]
        return tools
    
    async def process_message(self, message: str, context: Dict, session_id: str) -> Dict:
        """Process a user message and return response with actions"""
        try:
            # Prepare messages for AI model
            messages = [
                {
                    "role": "system",
                    "content": """You are Omni, the Universal Life Connector - an advanced AI assistant that eliminates digital fragmentation.

MISSION: Transform chaotic digital life into unified, intelligent harmony.

CORE CAPABILITIES:
1. Universal Task Management - Sync and prioritize tasks across all platforms
2. Communication Centralization - Manage all channels from one interface  
3. Life Orchestration - Connect work, health, finance, and personal goals
4. Smart Automation - Create intelligent workflows between services
5. Context Awareness - Adapt to user's situation, energy, and preferences

PERSONALITY:
- Proactive and anticipatory
- Practical and immediately useful
- Empathetic to digital overwhelm
- Focused on actionable insights
- Always learning and adapting

RESPONSE STYLE:
- Be conversational but efficient
- Provide specific, actionable steps
- Suggest optimizations and automations
- Explain the "why" behind recommendations
- Offer multiple options when appropriate

When executing tasks:
- Choose the most appropriate service automatically
- Consider user's context and preferences
- Suggest improvements and optimizations
- Create automations for repetitive tasks
- Provide clear feedback on actions taken

Remember: You're not just managing tasks - you're orchestrating a better digital life."""
                },
                {
                    "role": "user",
                    "content": f"""
User Message: {message}

Current Context:
- Time: {context.get('current_time', 'Unknown')}
- Location: {context.get('location', 'Unknown')}
- Energy Level: {context.get('energy_level', 'Unknown')}
- Current Focus: {context.get('current_focus', 'General')}
- Recent Activity: {context.get('recent_activity', 'None')}

Please help the user with their request, considering their current context and providing actionable solutions.
"""
                }
            ]
            
            # Convert tools to the format expected by our AI models
            tools_for_ai = []
            for tool in self.tools:
                tools_for_ai.append({
                    'name': tool['name'],
                    'description': tool['description'],
                    'parameters': {}  # Would need to extract from tool if available
                })
            
            # Use our model manager to generate response
            result = await self.model_manager.generate_with_tools(
                messages=messages,
                tools=tools_for_ai,
                model_name='glm',  # Default to GLM, can be made configurable
                temperature=0.3,
                max_tokens=2000
            )
            
            response_text = result.get('content', 'I apologize, but I encountered an issue processing your request.')
            tool_calls = result.get('tool_calls', [])
            
            # Process tool calls
            actions_taken = []
            for tool_call in tool_calls:
                tool_name = tool_call.get('name')
                tool_args = tool_call.get('arguments', {})
                
                # Find and execute the tool
                for tool in self.tools:
                    if tool['name'] == tool_name:
                        try:
                            result = tool['func'](tool_args)
                            actions_taken.append({
                                'tool': tool_name,
                                'input': tool_args,
                                'result': result
                            })
                        except Exception as e:
                            actions_taken.append({
                                'tool': tool_name,
                                'input': tool_args,
                                'result': f"Error: {str(e)}"
                            })
                        break
            
            # Generate suggestions based on context and actions
            suggestions = self._generate_suggestions(message, context, actions_taken)
            
            return {
                'response': response_text,
                'actions_taken': actions_taken,
                'suggestions': suggestions,
                'context_updated': True
            }
            
        except Exception as e:
            return {
                'response': f"I apologize, but I encountered an error: {str(e)}. Please try rephrasing your request.",
                'actions_taken': [],
                'suggestions': [],
                'context_updated': False
            }
    
    def _create_task_tool(self, args: Dict) -> str:
        """Create a new task"""
        title = args.get('title', 'New Task')
        priority = args.get('priority', 'medium')
        return f"Created task: {title} (Priority: {priority})"
    
    def _send_message_tool(self, args: Dict) -> str:
        """Send a message"""
        recipient = args.get('recipient', 'Unknown')
        message = args.get('message', 'Hello!')
        return f"Sent message to {recipient}: {message}"
    
    def _post_social_tool(self, args: Dict) -> str:
        """Post to social media"""
        platform = args.get('platform', 'Twitter')
        content = args.get('content', 'Hello World!')
        return f"Posted to {platform}: {content}"
    
    def _schedule_meeting_tool(self, args: Dict) -> str:
        """Schedule a meeting"""
        title = args.get('title', 'Meeting')
        time = args.get('time', 'TBD')
        return f"Scheduled meeting: {title} at {time}"
    
    def _get_weather_tool(self, args: Dict) -> str:
        """Get weather information"""
        location = args.get('location', 'Current location')
        return f"Weather for {location}: Sunny, 72°F"
    
    def _search_information_tool(self, args: Dict) -> str:
        """Search for information"""
        query = args.get('query', '')
        return f"Search results for: {query}"
    
    def _generate_suggestions(self, message: str, context: Dict, actions: List) -> List[str]:
        """Generate helpful suggestions based on the conversation"""
        suggestions = []
        
        # Basic suggestions based on message content
        if 'task' in message.lower():
            suggestions.extend([
                "Would you like me to set a reminder for this task?",
                "Should I add this to your calendar as well?",
                "Would you like me to break this down into smaller subtasks?"
            ])
        
        if 'message' in message.lower() or 'email' in message.lower():
            suggestions.extend([
                "Would you like me to schedule a follow-up reminder?",
                "Should I add this person to your contacts?",
                "Would you like me to create a template for similar messages?"
            ])
        
        if 'post' in message.lower() or 'social' in message.lower():
            suggestions.extend([
                "Would you like me to schedule this post for later?",
                "Should I cross-post this to other platforms?",
                "Would you like me to suggest relevant hashtags?"
            ])
        
        return suggestions[:3]  # Return top 3 suggestions
