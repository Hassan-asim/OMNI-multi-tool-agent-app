"""
Omni Universal Assistant - Core AI Agent
The brain that orchestrates all digital services and provides intelligent assistance
"""

# Simplified imports to avoid dependency issues
from typing import Dict, List, Any, Optional
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
from ai_models import model_manager

class OmniAgent:
    """
    The core AI agent that understands user intent and orchestrates actions
    across all connected services
    """
    
    def __init__(self, service_manager, context_engine, automation_engine):
        self.service_manager = service_manager
        self.context_engine = context_engine
        self.automation_engine = automation_engine
        self.model_manager = model_manager
        
        # Initialize tools
        self.tools = self._initialize_tools()
        
        # Create agent
        self.agent = self._create_agent()
        
    def _initialize_tools(self) -> List[Tool]:
        """Initialize all available tools for the agent"""
        tools = []
        
        # Service Management Tools
        tools.extend([
            Tool(
                name="GetAllTasks",
                func=self._get_all_tasks,
                description="Gets and prioritizes tasks from all connected task services"
            ),
            Tool(
                name="CreateTask",
                func=self._create_task,
                description="Creates a task in the most appropriate service"
            ),
            Tool(
                name="UpdateTask",
                func=self._update_task,
                description="Updates an existing task"
            ),
            Tool(
                name="CompleteTask",
                func=self._complete_task,
                description="Marks a task as completed"
            ),
            Tool(
                name="GetAllMessages",
                func=self._get_all_messages,
                description="Gets messages from all communication channels"
            ),
            Tool(
                name="SendMessage",
                func=self._send_message,
                description="Sends a message via the best communication channel"
            ),
            Tool(
                name="GetCalendarEvents",
                func=self._get_calendar_events,
                description="Gets calendar events for a specific time range"
            ),
            Tool(
                name="CreateCalendarEvent",
                func=self._create_calendar_event,
                description="Creates a new calendar event"
            ),
            Tool(
                name="GetLifeMetrics",
                func=self._get_life_metrics,
                description="Gets current life metrics (health, finance, learning, habits)"
            ),
            Tool(
                name="GetInsights",
                func=self._get_insights,
                description="Gets AI-powered insights about user's digital life"
            ),
            Tool(
                name="CreateAutomation",
                func=self._create_automation,
                description="Creates a new automation workflow"
            ),
            Tool(
                name="GetAnalytics",
                func=self._get_analytics,
                description="Gets productivity and life analytics"
            )
        ])
        
        # External Tools
        try:
            tools.extend(GmailToolkit().get_tools())
        except:
            pass
            
        try:
            tools.extend(SlackToolkit().get_tools())
        except:
            pass
            
        try:
            tools.extend(GoogleCalendarToolkit().get_tools())
        except:
            pass
        
        # Utility Tools
        tools.extend([
            Tool(
                name="WebSearch",
                func=GoogleSearchAPIWrapper().run,
                description="Searches the internet for current information"
            ),
            Tool(
                name="KnowledgeBase",
                func=WikipediaAPIWrapper().run,
                description="Accesses general knowledge about concepts"
            ),
            Tool(
                name="CodeExecutor",
                func=PythonREPLTool().run,
                description="Executes Python code for data processing or automation"
            )
        ])
        
        return tools
    
    def _create_agent(self):
        """Create a custom agent using our AI models"""
        # For now, we'll create a simple agent that uses our model manager
        # In a full implementation, you'd create a custom agent class
        return None  # We'll handle this in process_message
    
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
                    'name': tool.name,
                    'description': tool.description,
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
                    if tool.name == tool_name:
                        try:
                            result = tool.func(tool_args)
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
    
    def _generate_suggestions(self, message: str, context: Dict, actions: List) -> List[str]:
        """Generate helpful suggestions based on the conversation"""
        suggestions = []
        
        # Task-related suggestions
        if any('task' in action.get('tool', '').lower() for action in actions):
            suggestions.extend([
                "Would you like me to set up an automation for similar tasks?",
                "I can create a recurring reminder for this type of task.",
                "Would you like me to prioritize your other tasks based on this one?"
            ])
        
        # Communication suggestions
        if any('message' in action.get('tool', '').lower() for action in actions):
            suggestions.extend([
                "I can set up auto-responses for common message types.",
                "Would you like me to create a communication schedule?",
                "I can help you batch similar messages for efficiency."
            ])
        
        # Calendar suggestions
        if any('calendar' in action.get('tool', '').lower() for action in actions):
            suggestions.extend([
                "I can optimize your schedule based on your energy patterns.",
                "Would you like me to create buffer time between meetings?",
                "I can suggest the best times for focused work."
            ])
        
        # General suggestions based on context
        if context.get('energy_level') == 'low':
            suggestions.append("Based on your energy level, I suggest focusing on lighter tasks or taking a break.")
        
        if context.get('time_of_day') == 'morning':
            suggestions.append("Good morning! I can help you plan your day for maximum productivity.")
        
        return suggestions[:3]  # Limit to 3 suggestions
    
    # Tool implementations
    def _get_all_tasks(self, query: str = "") -> str:
        """Get all tasks from connected services"""
        try:
            tasks = self.service_manager.get_all_tasks()
            return json.dumps(tasks, default=str)
        except Exception as e:
            return f"Error getting tasks: {str(e)}"
    
    def _create_task(self, task_data: str) -> str:
        """Create a new task"""
        try:
            data = json.loads(task_data) if isinstance(task_data, str) else task_data
            task = self.service_manager.create_task(
                title=data.get('title'),
                description=data.get('description'),
                priority=data.get('priority', 'medium'),
                due_date=data.get('due_date'),
                service=data.get('service', 'auto')
            )
            return f"Task created successfully: {json.dumps(task, default=str)}"
        except Exception as e:
            return f"Error creating task: {str(e)}"
    
    def _update_task(self, task_data: str) -> str:
        """Update an existing task"""
        try:
            data = json.loads(task_data) if isinstance(task_data, str) else task_data
            result = self.service_manager.update_task(
                task_id=data.get('task_id'),
                updates=data.get('updates', {})
            )
            return f"Task updated successfully: {json.dumps(result, default=str)}"
        except Exception as e:
            return f"Error updating task: {str(e)}"
    
    def _complete_task(self, task_id: str) -> str:
        """Mark a task as completed"""
        try:
            result = self.service_manager.complete_task(task_id)
            return f"Task completed: {json.dumps(result, default=str)}"
        except Exception as e:
            return f"Error completing task: {str(e)}"
    
    def _get_all_messages(self, query: str = "") -> str:
        """Get messages from all communication channels"""
        try:
            messages = self.service_manager.get_all_messages()
            return json.dumps(messages, default=str)
        except Exception as e:
            return f"Error getting messages: {str(e)}"
    
    def _send_message(self, message_data: str) -> str:
        """Send a message via the best channel"""
        try:
            data = json.loads(message_data) if isinstance(message_data, str) else message_data
            result = self.service_manager.send_message(
                message=data.get('message'),
                recipient=data.get('recipient'),
                channel=data.get('channel', 'auto')
            )
            return f"Message sent successfully: {json.dumps(result, default=str)}"
        except Exception as e:
            return f"Error sending message: {str(e)}"
    
    def _get_calendar_events(self, query: str = "") -> str:
        """Get calendar events"""
        try:
            events = self.service_manager.get_calendar_events()
            return json.dumps(events, default=str)
        except Exception as e:
            return f"Error getting calendar events: {str(e)}"
    
    def _create_calendar_event(self, event_data: str) -> str:
        """Create a calendar event"""
        try:
            data = json.loads(event_data) if isinstance(event_data, str) else event_data
            event = self.service_manager.create_calendar_event(
                title=data.get('title'),
                start_time=data.get('start_time'),
                end_time=data.get('end_time'),
                description=data.get('description')
            )
            return f"Event created successfully: {json.dumps(event, default=str)}"
        except Exception as e:
            return f"Error creating calendar event: {str(e)}"
    
    def _get_life_metrics(self, query: str = "") -> str:
        """Get life metrics"""
        try:
            metrics = self.context_engine.get_life_metrics()
            return json.dumps(metrics, default=str)
        except Exception as e:
            return f"Error getting life metrics: {str(e)}"
    
    def _get_insights(self, query: str = "") -> str:
        """Get AI insights"""
        try:
            insights = self.context_engine.get_insights()
            return json.dumps(insights, default=str)
        except Exception as e:
            return f"Error getting insights: {str(e)}"
    
    def _create_automation(self, automation_data: str) -> str:
        """Create an automation"""
        try:
            data = json.loads(automation_data) if isinstance(automation_data, str) else automation_data
            automation = self.automation_engine.create_automation(
                name=data.get('name'),
                trigger=data.get('trigger'),
                actions=data.get('actions'),
                conditions=data.get('conditions', [])
            )
            return f"Automation created successfully: {json.dumps(automation, default=str)}"
        except Exception as e:
            return f"Error creating automation: {str(e)}"
    
    def _get_analytics(self, query: str = "") -> str:
        """Get analytics"""
        try:
            analytics = self.context_engine.get_analytics()
            return json.dumps(analytics, default=str)
        except Exception as e:
            return f"Error getting analytics: {str(e)}"
