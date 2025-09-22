"""
Automation Engine - Smart workflow automation and cross-service orchestration
Creates intelligent automations that connect different services and reduce manual work
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass
from enum import Enum
import schedule
import time
from threading import Thread

class TriggerType(Enum):
    TIME_BASED = "time_based"
    EVENT_BASED = "event_based"
    CONDITION_BASED = "condition_based"
    MANUAL = "manual"

class ActionType(Enum):
    SEND_MESSAGE = "send_message"
    CREATE_TASK = "create_task"
    UPDATE_TASK = "update_task"
    SEND_EMAIL = "send_email"
    CREATE_CALENDAR_EVENT = "create_calendar_event"
    PLAY_MUSIC = "play_music"
    SET_REMINDER = "set_reminder"
    LOG_ACTIVITY = "log_activity"
    CUSTOM_SCRIPT = "custom_script"

@dataclass
class AutomationTrigger:
    """Defines when an automation should be triggered"""
    type: TriggerType
    condition: str  # Cron expression, event name, or condition
    parameters: Dict[str, Any]

@dataclass
class AutomationAction:
    """Defines what action to take when triggered"""
    type: ActionType
    parameters: Dict[str, Any]
    service: str
    delay_seconds: int = 0

@dataclass
class Automation:
    """Complete automation definition"""
    id: str
    name: str
    description: str
    trigger: AutomationTrigger
    actions: List[AutomationAction]
    conditions: List[str]  # Additional conditions that must be met
    enabled: bool
    created_at: datetime
    last_run: Optional[datetime]
    run_count: int
    success_rate: float

class AutomationEngine:
    """
    Advanced automation engine that creates intelligent workflows
    between different services and reduces manual work
    """
    
    def __init__(self, service_manager, context_engine):
        self.service_manager = service_manager
        self.context_engine = context_engine
        self.automations = {}
        self.running = False
        self.worker_thread = None
        
        # Pre-built automation templates
        self.templates = self._initialize_templates()
        
        # Start the automation worker
        self.start_worker()
    
    def _initialize_templates(self) -> Dict[str, Dict]:
        """Initialize pre-built automation templates"""
        return {
            "morning_routine": {
                "name": "Morning Routine",
                "description": "Automated morning routine with task planning and motivation",
                "trigger": {
                    "type": "time_based",
                    "condition": "0 8 * * *",  # 8 AM daily
                    "parameters": {}
                },
                "actions": [
                    {
                        "type": "create_task",
                        "parameters": {
                            "title": "Plan your day",
                            "description": "Review goals and prioritize tasks",
                            "priority": "high"
                        },
                        "service": "auto",
                        "delay_seconds": 0
                    },
                    {
                        "type": "send_message",
                        "parameters": {
                            "message": "Good morning! Here's your daily plan and motivation quote.",
                            "recipient": "self"
                        },
                        "service": "slack",
                        "delay_seconds": 30
                    }
                ],
                "conditions": ["work_mode"]
            },
            "task_completion_celebration": {
                "name": "Task Completion Celebration",
                "description": "Celebrates completed tasks and suggests next steps",
                "trigger": {
                    "type": "event_based",
                    "condition": "task_completed",
                    "parameters": {}
                },
                "actions": [
                    {
                        "type": "send_message",
                        "parameters": {
                            "message": "🎉 Great job completing that task! What's next?",
                            "recipient": "self"
                        },
                        "service": "slack",
                        "delay_seconds": 0
                    },
                    {
                        "type": "play_music",
                        "parameters": {
                            "playlist": "celebration",
                            "duration": 30
                        },
                        "service": "spotify",
                        "delay_seconds": 5
                    }
                ],
                "conditions": []
            },
            "focus_time_automation": {
                "name": "Focus Time Automation",
                "description": "Creates optimal focus environment when starting deep work",
                "trigger": {
                    "type": "manual",
                    "condition": "start_focus",
                    "parameters": {}
                },
                "actions": [
                    {
                        "type": "play_music",
                        "parameters": {
                            "playlist": "focus",
                            "duration": 0  # Play indefinitely
                        },
                        "service": "spotify",
                        "delay_seconds": 0
                    },
                    {
                        "type": "send_message",
                        "parameters": {
                            "message": "🔇 Focus mode activated. I'll minimize distractions.",
                            "recipient": "self"
                        },
                        "service": "slack",
                        "delay_seconds": 0
                    },
                    {
                        "type": "set_reminder",
                        "parameters": {
                            "message": "Time for a break!",
                            "delay_minutes": 25
                        },
                        "service": "system",
                        "delay_seconds": 0
                    }
                ],
                "conditions": []
            },
            "meeting_preparation": {
                "name": "Meeting Preparation",
                "description": "Prepares for upcoming meetings with relevant information",
                "trigger": {
                    "type": "time_based",
                    "condition": "15 * * * *",  # Every 15 minutes
                    "parameters": {}
                },
                "actions": [
                    {
                        "type": "send_message",
                        "parameters": {
                            "message": "📅 Meeting in 15 minutes: {meeting_title}. Here's the agenda and prep materials.",
                            "recipient": "self"
                        },
                        "service": "slack",
                        "delay_seconds": 0
                    }
                ],
                "conditions": ["upcoming_meeting"]
            },
            "evening_wind_down": {
                "name": "Evening Wind Down",
                "description": "Helps transition from work to personal time",
                "trigger": {
                    "type": "time_based",
                    "condition": "0 18 * * *",  # 6 PM daily
                    "parameters": {}
                },
                "actions": [
                    {
                        "type": "send_message",
                        "parameters": {
                            "message": "🌅 Time to wind down! Here's your evening routine and tomorrow's preview.",
                            "recipient": "self"
                        },
                        "service": "slack",
                        "delay_seconds": 0
                    },
                    {
                        "type": "create_task",
                        "parameters": {
                            "title": "Evening reflection",
                            "description": "Review today's accomplishments and plan for tomorrow",
                            "priority": "medium"
                        },
                        "service": "auto",
                        "delay_seconds": 0
                    }
                ],
                "conditions": ["work_mode"]
            },
            "health_reminder": {
                "name": "Health Reminder",
                "description": "Reminds to take breaks and maintain health habits",
                "trigger": {
                    "type": "time_based",
                    "condition": "0 */2 * * *",  # Every 2 hours
                    "parameters": {}
                },
                "actions": [
                    {
                        "type": "send_message",
                        "parameters": {
                            "message": "💧 Time for a water break and stretch!",
                            "recipient": "self"
                        },
                        "service": "slack",
                        "delay_seconds": 0
                    }
                ],
                "conditions": ["work_mode"]
            },
            "deadline_alert": {
                "name": "Deadline Alert",
                "description": "Alerts about upcoming deadlines and helps prioritize",
                "trigger": {
                    "type": "condition_based",
                    "condition": "deadline_approaching",
                    "parameters": {
                        "hours_ahead": 24
                    }
                },
                "actions": [
                    {
                        "type": "send_message",
                        "parameters": {
                            "message": "⚠️ Deadline approaching: {task_title} due in {time_remaining}",
                            "recipient": "self"
                        },
                        "service": "slack",
                        "delay_seconds": 0
                    },
                    {
                        "type": "update_task",
                        "parameters": {
                            "task_id": "{task_id}",
                            "updates": {"priority": "urgent"}
                        },
                        "service": "auto",
                        "delay_seconds": 0
                    }
                ],
                "conditions": []
            }
        }
    
    def create_automation(self, name: str, trigger: Dict, actions: List[Dict], 
                         conditions: List[str] = None) -> Dict:
        """Create a new automation"""
        automation_id = f"auto_{int(datetime.now().timestamp())}"
        
        # Parse trigger
        trigger_obj = AutomationTrigger(
            type=TriggerType(trigger['type']),
            condition=trigger['condition'],
            parameters=trigger.get('parameters', {})
        )
        
        # Parse actions
        action_objs = []
        for action_data in actions:
            action_obj = AutomationAction(
                type=ActionType(action_data['type']),
                parameters=action_data['parameters'],
                service=action_data.get('service', 'auto'),
                delay_seconds=action_data.get('delay_seconds', 0)
            )
            action_objs.append(action_obj)
        
        # Create automation
        automation = Automation(
            id=automation_id,
            name=name,
            description=f"Custom automation: {name}",
            trigger=trigger_obj,
            actions=action_objs,
            conditions=conditions or [],
            enabled=True,
            created_at=datetime.now(),
            last_run=None,
            run_count=0,
            success_rate=1.0
        )
        
        # Store automation
        self.automations[automation_id] = automation
        
        # Schedule if time-based
        if trigger_obj.type == TriggerType.TIME_BASED:
            self._schedule_automation(automation)
        
        return {
            "id": automation_id,
            "name": name,
            "status": "created",
            "message": f"Automation '{name}' created successfully"
        }
    
    def create_from_template(self, template_name: str, customizations: Dict = None) -> Dict:
        """Create automation from a template"""
        if template_name not in self.templates:
            return {"error": f"Template '{template_name}' not found"}
        
        template = self.templates[template_name]
        customizations = customizations or {}
        
        # Merge template with customizations
        name = customizations.get('name', template['name'])
        trigger = {**template['trigger'], **customizations.get('trigger', {})}
        actions = customizations.get('actions', template['actions'])
        conditions = customizations.get('conditions', template['conditions'])
        
        return self.create_automation(name, trigger, actions, conditions)
    
    def get_active_automations(self) -> List[Dict]:
        """Get all active automations"""
        return [
            {
                "id": auto.id,
                "name": auto.name,
                "description": auto.description,
                "trigger_type": auto.trigger.type.value,
                "trigger_condition": auto.trigger.condition,
                "actions_count": len(auto.actions),
                "enabled": auto.enabled,
                "last_run": auto.last_run.isoformat() if auto.last_run else None,
                "run_count": auto.run_count,
                "success_rate": auto.success_rate
            }
            for auto in self.automations.values()
        ]
    
    def enable_automation(self, automation_id: str) -> Dict:
        """Enable an automation"""
        if automation_id not in self.automations:
            return {"error": "Automation not found"}
        
        automation = self.automations[automation_id]
        automation.enabled = True
        
        # Re-schedule if time-based
        if automation.trigger.type == TriggerType.TIME_BASED:
            self._schedule_automation(automation)
        
        return {"success": True, "message": f"Automation '{automation.name}' enabled"}
    
    def disable_automation(self, automation_id: str) -> Dict:
        """Disable an automation"""
        if automation_id not in self.automations:
            return {"error": "Automation not found"}
        
        automation = self.automations[automation_id]
        automation.enabled = False
        
        # Unschedule if time-based
        if automation.trigger.type == TriggerType.TIME_BASED:
            schedule.clear(automation_id)
        
        return {"success": True, "message": f"Automation '{automation.name}' disabled"}
    
    def delete_automation(self, automation_id: str) -> Dict:
        """Delete an automation"""
        if automation_id not in self.automations:
            return {"error": "Automation not found"}
        
        automation = self.automations[automation_id]
        
        # Unschedule if time-based
        if automation.trigger.type == TriggerType.TIME_BASED:
            schedule.clear(automation_id)
        
        # Remove from storage
        del self.automations[automation_id]
        
        return {"success": True, "message": f"Automation '{automation.name}' deleted"}
    
    def trigger_automation(self, automation_id: str, context: Dict = None) -> Dict:
        """Manually trigger an automation"""
        if automation_id not in self.automations:
            return {"error": "Automation not found"}
        
        automation = self.automations[automation_id]
        if not automation.enabled:
            return {"error": "Automation is disabled"}
        
        # Check conditions
        if not self._check_conditions(automation.conditions, context or {}):
            return {"error": "Automation conditions not met"}
        
        # Execute automation
        result = self._execute_automation(automation, context or {})
        
        # Update automation stats
        automation.last_run = datetime.now()
        automation.run_count += 1
        
        return result
    
    def _schedule_automation(self, automation: Automation):
        """Schedule a time-based automation"""
        if automation.trigger.type != TriggerType.TIME_BASED:
            return
        
        cron_expression = automation.trigger.condition
        
        # Convert cron to schedule format (simplified)
        if cron_expression == "0 8 * * *":  # 8 AM daily
            schedule.every().day.at("08:00").do(
                self._execute_automation, automation, {}
            ).tag(automation.id)
        elif cron_expression == "0 18 * * *":  # 6 PM daily
            schedule.every().day.at("18:00").do(
                self._execute_automation, automation, {}
            ).tag(automation.id)
        elif cron_expression == "0 */2 * * *":  # Every 2 hours
            schedule.every(2).hours.do(
                self._execute_automation, automation, {}
            ).tag(automation.id)
        elif cron_expression == "15 * * * *":  # Every 15 minutes
            schedule.every(15).minutes.do(
                self._execute_automation, automation, {}
            ).tag(automation.id)
    
    def _check_conditions(self, conditions: List[str], context: Dict) -> bool:
        """Check if automation conditions are met"""
        if not conditions:
            return True
        
        for condition in conditions:
            if condition == "work_mode":
                if not context.get('work_mode', False):
                    return False
            elif condition == "personal_mode":
                if not context.get('personal_mode', False):
                    return False
            elif condition == "upcoming_meeting":
                # Check if there's a meeting in the next 15 minutes
                if not self._has_upcoming_meeting():
                    return False
            # Add more condition checks as needed
        
        return True
    
    def _has_upcoming_meeting(self) -> bool:
        """Check if there's an upcoming meeting"""
        # This would check the calendar for meetings in the next 15 minutes
        # For now, return False as placeholder
        return False
    
    def _execute_automation(self, automation: Automation, context: Dict) -> Dict:
        """Execute an automation's actions"""
        results = []
        
        for action in automation.actions:
            try:
                # Apply delay if specified
                if action.delay_seconds > 0:
                    time.sleep(action.delay_seconds)
                
                # Execute action
                result = self._execute_action(action, context)
                results.append({
                    "action": action.type.value,
                    "success": True,
                    "result": result
                })
                
            except Exception as e:
                results.append({
                    "action": action.type.value,
                    "success": False,
                    "error": str(e)
                })
        
        return {
            "automation_id": automation.id,
            "automation_name": automation.name,
            "executed_at": datetime.now().isoformat(),
            "results": results
        }
    
    def _execute_action(self, action: AutomationAction, context: Dict) -> Dict:
        """Execute a single action"""
        action_type = action.type
        params = action.parameters
        service = action.service
        
        # Replace placeholders in parameters
        params = self._replace_placeholders(params, context)
        
        if action_type == ActionType.SEND_MESSAGE:
            return self.service_manager.send_message(
                message=params['message'],
                recipient=params['recipient'],
                channel=service
            )
        
        elif action_type == ActionType.CREATE_TASK:
            return self.service_manager.create_task(
                title=params['title'],
                description=params.get('description', ''),
                priority=params.get('priority', 'medium'),
                due_date=params.get('due_date'),
                service=service
            )
        
        elif action_type == ActionType.UPDATE_TASK:
            return self.service_manager.update_task(
                task_id=params['task_id'],
                updates=params['updates']
            )
        
        elif action_type == ActionType.SEND_EMAIL:
            return self.service_manager.send_message(
                message=params['message'],
                recipient=params['recipient'],
                channel='email'
            )
        
        elif action_type == ActionType.CREATE_CALENDAR_EVENT:
            return self.service_manager.create_calendar_event(
                title=params['title'],
                start_time=params['start_time'],
                end_time=params['end_time'],
                description=params.get('description', '')
            )
        
        elif action_type == ActionType.PLAY_MUSIC:
            # This would integrate with Spotify or other music services
            return {"success": True, "message": f"Playing music: {params.get('playlist', 'default')}"}
        
        elif action_type == ActionType.SET_REMINDER:
            # This would set a system reminder
            return {"success": True, "message": f"Reminder set: {params['message']}"}
        
        elif action_type == ActionType.LOG_ACTIVITY:
            # Log activity for analytics
            return {"success": True, "message": "Activity logged"}
        
        else:
            return {"error": f"Unknown action type: {action_type}"}
    
    def _replace_placeholders(self, params: Dict, context: Dict) -> Dict:
        """Replace placeholders in parameters with actual values"""
        # This would replace placeholders like {meeting_title} with actual values
        # For now, return params as-is
        return params
    
    def start_worker(self):
        """Start the automation worker thread"""
        if self.running:
            return
        
        self.running = True
        self.worker_thread = Thread(target=self._worker_loop, daemon=True)
        self.worker_thread.start()
    
    def stop_worker(self):
        """Stop the automation worker thread"""
        self.running = False
        if self.worker_thread:
            self.worker_thread.join()
    
    def _worker_loop(self):
        """Main worker loop for executing scheduled automations"""
        while self.running:
            try:
                schedule.run_pending()
                time.sleep(1)
            except Exception as e:
                print(f"Error in automation worker: {e}")
                time.sleep(5)
    
    def get_automation_templates(self) -> List[Dict]:
        """Get available automation templates"""
        return [
            {
                "id": template_id,
                "name": template["name"],
                "description": template["description"],
                "trigger_type": template["trigger"]["type"],
                "actions_count": len(template["actions"])
            }
            for template_id, template in self.templates.items()
        ]
    
    def suggest_automations(self, user_activity: Dict) -> List[Dict]:
        """Suggest automations based on user activity patterns"""
        suggestions = []
        
        # Analyze user activity to suggest relevant automations
        if user_activity.get('frequent_task_creation'):
            suggestions.append({
                "template": "task_completion_celebration",
                "reason": "You create many tasks - celebrate completions!",
                "impact": "high"
            })
        
        if user_activity.get('long_work_sessions'):
            suggestions.append({
                "template": "health_reminder",
                "reason": "You work long sessions - stay healthy with breaks!",
                "impact": "medium"
            })
        
        if user_activity.get('morning_planning'):
            suggestions.append({
                "template": "morning_routine",
                "reason": "You plan in the morning - automate your routine!",
                "impact": "high"
            })
        
        return suggestions
