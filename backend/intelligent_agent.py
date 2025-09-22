"""
Intelligent Agent for Omni Universal Assistant
Understands natural language and executes actions automatically
"""

import re
import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from ai_models import model_manager

class IntelligentAgent:
    """
    Advanced AI agent that understands natural language and executes actions
    """
    
    def __init__(self, service_manager, context_engine, automation_engine):
        self.service_manager = service_manager
        self.context_engine = context_engine
        self.automation_engine = automation_engine
        self.model_manager = model_manager
        
        # Intent patterns for common actions
        self.intent_patterns = {
            'create_task': [
                r'create.*task',
                r'add.*task',
                r'new.*task',
                r'remind.*me.*to',
                r'i need to',
                r'i should',
                r'i have to'
            ],
            'schedule_meeting': [
                r'schedule.*meeting',
                r'book.*meeting',
                r'arrange.*meeting',
                r'meet.*with',
                r'call.*with'
            ],
            'send_message': [
                r'send.*message',
                r'text.*to',
                r'email.*to',
                r'contact.*',
                r'message.*'
            ],
            'post_social': [
                r'post.*on',
                r'share.*on',
                r'update.*status',
                r'tweet.*about',
                r'post.*to.*facebook',
                r'post.*to.*instagram'
            ],
            'check_schedule': [
                r'what.*my.*schedule',
                r'what.*am.*i.*doing',
                r'when.*is.*my.*next',
                r'check.*calendar',
                r'show.*me.*today'
            ],
            'search_information': [
                r'search.*for',
                r'find.*information',
                r'look.*up',
                r'what.*is',
                r'how.*to',
                r'tell.*me.*about'
            ],
            'automate_workflow': [
                r'automate.*this',
                r'create.*workflow',
                r'set.*up.*automation',
                r'when.*this.*happens',
                r'if.*then'
            ]
        }
    
    async def process_natural_input(self, user_input: str, context: Dict, session_id: str) -> Dict:
        """
        Process natural language input and execute appropriate actions
        """
        try:
            # Step 1: Analyze intent using AI
            intent_analysis = await self._analyze_intent(user_input, context)
            
            # Step 2: Extract entities and parameters
            entities = await self._extract_entities(user_input, intent_analysis)
            
            # Step 3: Determine actions to take
            actions = await self._determine_actions(intent_analysis, entities, context)
            
            # Step 4: Execute actions
            results = await self._execute_actions(actions, context, session_id)
            
            # Step 5: Generate response
            response = await self._generate_response(user_input, intent_analysis, results, context)
            
            return {
                'response': response,
                'intent': intent_analysis,
                'entities': entities,
                'actions_taken': results,
                'suggestions': self._generate_suggestions(intent_analysis, results),
                'context_updated': True
            }
            
        except Exception as e:
            return {
                'response': f"I apologize, but I encountered an error: {str(e)}. Please try rephrasing your request.",
                'intent': 'error',
                'entities': {},
                'actions_taken': [],
                'suggestions': [],
                'context_updated': False
            }
    
    async def _analyze_intent(self, user_input: str, context: Dict) -> Dict:
        """Analyze user intent using AI model"""
        messages = [
            {
                "role": "system",
                "content": """You are an intent analysis expert. Analyze the user's input and determine:

1. PRIMARY INTENT: What does the user want to accomplish?
2. CONFIDENCE: How confident are you (0-100)?
3. CATEGORY: Which category best fits (task, communication, social, information, automation, other)?
4. URGENCY: How urgent is this (low, medium, high)?
5. CONTEXT_RELEVANCE: How relevant to current context (0-100)?

Respond in JSON format:
{
    "primary_intent": "string",
    "confidence": number,
    "category": "string",
    "urgency": "string",
    "context_relevance": number,
    "reasoning": "string"
}"""
            },
            {
                "role": "user",
                "content": f"""
User Input: "{user_input}"

Current Context:
- Time: {context.get('current_time', 'Unknown')}
- Location: {context.get('location', 'Unknown')}
- Energy Level: {context.get('energy_level', 'Unknown')}
- Current Focus: {context.get('current_focus', 'General')}
- Recent Activity: {context.get('recent_activity', 'None')}

Analyze the intent and respond with JSON.
"""
            }
        ]
        
        try:
            response = await self.model_manager.generate_response(
                messages=messages,
                model_name='glm',
                temperature=0.3
            )
            
            # Parse JSON response
            intent_data = json.loads(response)
            return intent_data
            
        except Exception as e:
            # Fallback to pattern matching
            return self._fallback_intent_analysis(user_input)
    
    async def _extract_entities(self, user_input: str, intent_analysis: Dict) -> Dict:
        """Extract entities and parameters from user input"""
        messages = [
            {
                "role": "system",
                "content": """You are an entity extraction expert. Extract relevant entities from the user's input:

For TASK creation:
- title: The task title
- priority: high/medium/low
- due_date: When it's due
- category: Work/Personal/Health/etc

For MEETING scheduling:
- title: Meeting title
- attendees: Who to meet with
- date_time: When to meet
- duration: How long
- location: Where to meet

For MESSAGING:
- recipient: Who to contact
- platform: email/sms/slack/etc
- message: What to send

For SOCIAL posting:
- platform: Which platform
- content: What to post
- hashtags: Relevant hashtags

Respond in JSON format with extracted entities.
"""
            },
            {
                "role": "user",
                "content": f"""
User Input: "{user_input}"
Intent: {intent_analysis.get('primary_intent', 'Unknown')}

Extract relevant entities.
"""
            }
        ]
        
        try:
            response = await self.model_manager.generate_response(
                messages=messages,
                model_name='glm',
                temperature=0.3
            )
            
            entities = json.loads(response)
            return entities
            
        except Exception as e:
            return self._fallback_entity_extraction(user_input, intent_analysis)
    
    async def _determine_actions(self, intent_analysis: Dict, entities: Dict, context: Dict) -> List[Dict]:
        """Determine what actions to take based on intent and entities"""
        actions = []
        category = intent_analysis.get('category', 'other')
        
        if category == 'task':
            actions.append({
                'type': 'create_task',
                'title': entities.get('title', 'New Task'),
                'priority': entities.get('priority', 'medium'),
                'due_date': entities.get('due_date'),
                'category': entities.get('category', 'General')
            })
        
        elif category == 'communication':
            actions.append({
                'type': 'send_message',
                'recipient': entities.get('recipient'),
                'platform': entities.get('platform', 'email'),
                'message': entities.get('message', 'Hello!'),
                'subject': entities.get('subject', '')
            })
        
        elif category == 'social':
            actions.append({
                'type': 'post_social',
                'platform': entities.get('platform', 'twitter'),
                'content': entities.get('content', ''),
                'hashtags': entities.get('hashtags', [])
            })
        
        elif category == 'information':
            actions.append({
                'type': 'search_information',
                'query': entities.get('query', ''),
                'source': entities.get('source', 'web')
            })
        
        elif category == 'automation':
            actions.append({
                'type': 'create_automation',
                'trigger': entities.get('trigger', ''),
                'action': entities.get('action', ''),
                'conditions': entities.get('conditions', [])
            })
        
        return actions
    
    async def _execute_actions(self, actions: List[Dict], context: Dict, session_id: str) -> List[Dict]:
        """Execute the determined actions"""
        results = []
        
        for action in actions:
            try:
                if action['type'] == 'create_task':
                    result = await self._create_task(action, context)
                    results.append({
                        'action': 'create_task',
                        'success': True,
                        'result': result
                    })
                
                elif action['type'] == 'send_message':
                    result = await self._send_message(action, context)
                    results.append({
                        'action': 'send_message',
                        'success': True,
                        'result': result
                    })
                
                elif action['type'] == 'post_social':
                    result = await self._post_social(action, context)
                    results.append({
                        'action': 'post_social',
                        'success': True,
                        'result': result
                    })
                
                elif action['type'] == 'search_information':
                    result = await self._search_information(action, context)
                    results.append({
                        'action': 'search_information',
                        'success': True,
                        'result': result
                    })
                
                elif action['type'] == 'create_automation':
                    result = await self._create_automation(action, context)
                    results.append({
                        'action': 'create_automation',
                        'success': True,
                        'result': result
                    })
                
            except Exception as e:
                results.append({
                    'action': action['type'],
                    'success': False,
                    'error': str(e)
                })
        
        return results
    
    async def _create_task(self, action: Dict, context: Dict) -> str:
        """Create a new task"""
        # This would integrate with your task management system
        return f"Created task: {action['title']} (Priority: {action['priority']})"
    
    async def _send_message(self, action: Dict, context: Dict) -> str:
        """Send a message"""
        # This would integrate with your communication system
        return f"Sent message to {action['recipient']} via {action['platform']}"
    
    async def _post_social(self, action: Dict, context: Dict) -> str:
        """Post to social media"""
        # This would integrate with your social media system
        return f"Posted to {action['platform']}: {action['content']}"
    
    async def _search_information(self, action: Dict, context: Dict) -> str:
        """Search for information"""
        # This would integrate with your search system
        return f"Found information about: {action['query']}"
    
    async def _create_automation(self, action: Dict, context: Dict) -> str:
        """Create an automation"""
        # This would integrate with your automation system
        return f"Created automation: When {action['trigger']}, then {action['action']}"
    
    async def _generate_response(self, user_input: str, intent_analysis: Dict, results: List[Dict], context: Dict) -> str:
        """Generate a natural response to the user"""
        messages = [
            {
                "role": "system",
                "content": """You are Omni, the Universal Life Connector. Generate a natural, helpful response to the user based on:

1. What they asked for
2. What actions were taken
3. The results of those actions
4. Any suggestions for next steps

Be conversational, helpful, and proactive. If actions were successful, confirm them. If there were issues, explain what happened and suggest alternatives.

Keep responses concise but informative.
"""
            },
            {
                "role": "user",
                "content": f"""
User Input: "{user_input}"
Intent: {intent_analysis.get('primary_intent', 'Unknown')}
Actions Taken: {results}

Generate a helpful response.
"""
            }
        ]
        
        try:
            response = await self.model_manager.generate_response(
                messages=messages,
                model_name='glm',
                temperature=0.7
            )
            return response
            
        except Exception as e:
            return f"I've processed your request and taken the appropriate actions. {len(results)} actions were completed."
    
    def _fallback_intent_analysis(self, user_input: str) -> Dict:
        """Fallback intent analysis using pattern matching"""
        user_input_lower = user_input.lower()
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, user_input_lower):
                    return {
                        'primary_intent': intent,
                        'confidence': 70,
                        'category': self._get_category_from_intent(intent),
                        'urgency': 'medium',
                        'context_relevance': 50,
                        'reasoning': f'Matched pattern: {pattern}'
                    }
        
        return {
            'primary_intent': 'general_query',
            'confidence': 30,
            'category': 'other',
            'urgency': 'low',
            'context_relevance': 30,
            'reasoning': 'No specific pattern matched'
        }
    
    def _fallback_entity_extraction(self, user_input: str, intent_analysis: Dict) -> Dict:
        """Fallback entity extraction using simple parsing"""
        entities = {}
        
        # Extract common entities
        if 'task' in intent_analysis.get('primary_intent', ''):
            # Try to extract task title
            if 'to ' in user_input.lower():
                entities['title'] = user_input.split('to ')[-1].strip()
            else:
                entities['title'] = user_input
        
        if 'message' in intent_analysis.get('primary_intent', ''):
            # Try to extract recipient
            if 'to ' in user_input.lower():
                entities['recipient'] = user_input.split('to ')[1].split()[0]
        
        return entities
    
    def _get_category_from_intent(self, intent: str) -> str:
        """Map intent to category"""
        category_map = {
            'create_task': 'task',
            'schedule_meeting': 'communication',
            'send_message': 'communication',
            'post_social': 'social',
            'check_schedule': 'information',
            'search_information': 'information',
            'automate_workflow': 'automation'
        }
        return category_map.get(intent, 'other')
    
    def _generate_suggestions(self, intent_analysis: Dict, results: List[Dict]) -> List[str]:
        """Generate helpful suggestions based on the interaction"""
        suggestions = []
        category = intent_analysis.get('category', 'other')
        
        if category == 'task':
            suggestions.extend([
                "Would you like me to set a reminder for this task?",
                "Should I add this to your calendar as well?",
                "Would you like me to break this down into smaller subtasks?"
            ])
        
        elif category == 'communication':
            suggestions.extend([
                "Would you like me to schedule a follow-up reminder?",
                "Should I add this person to your contacts?",
                "Would you like me to create a template for similar messages?"
            ])
        
        elif category == 'social':
            suggestions.extend([
                "Would you like me to schedule this post for later?",
                "Should I cross-post this to other platforms?",
                "Would you like me to suggest relevant hashtags?"
            ])
        
        return suggestions[:3]  # Return top 3 suggestions
