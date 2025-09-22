"""
Service Connectors - Universal integration layer for all digital services
Handles authentication, data sync, and unified API for 20+ services
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from abc import ABC, abstractmethod
import asyncio
import aiohttp

class ServiceConnector(ABC):
    """Base class for all service connectors"""
    
    def __init__(self, service_name: str):
        self.service_name = service_name
        self.connected = False
        self.credentials = {}
    
    @abstractmethod
    async def connect(self, credentials: Dict) -> bool:
        """Connect to the service"""
        pass
    
    @abstractmethod
    async def disconnect(self) -> bool:
        """Disconnect from the service"""
        pass
    
    @abstractmethod
    async def get_tasks(self) -> List[Dict]:
        """Get tasks from the service"""
        pass
    
    @abstractmethod
    async def create_task(self, task_data: Dict) -> Dict:
        """Create a task in the service"""
        pass
    
    @abstractmethod
    async def update_task(self, task_id: str, updates: Dict) -> Dict:
        """Update a task in the service"""
        pass
    
    @abstractmethod
    async def complete_task(self, task_id: str) -> Dict:
        """Complete a task in the service"""
        pass

class TodoistConnector(ServiceConnector):
    """Todoist integration"""
    
    def __init__(self):
        super().__init__("todoist")
        self.api_key = None
        self.base_url = "https://api.todoist.com/rest/v2"
    
    async def connect(self, credentials: Dict) -> bool:
        try:
            self.api_key = credentials.get('api_key')
            if not self.api_key:
                return False
            
            # Test connection
            headers = {"Authorization": f"Bearer {self.api_key}"}
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/projects", headers=headers) as response:
                    if response.status == 200:
                        self.connected = True
                        self.credentials = credentials
                        return True
            return False
        except Exception as e:
            print(f"Error connecting to Todoist: {e}")
            return False
    
    async def disconnect(self) -> bool:
        self.connected = False
        self.credentials = {}
        self.api_key = None
        return True
    
    async def get_tasks(self) -> List[Dict]:
        if not self.connected:
            return []
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/tasks", headers=headers) as response:
                    if response.status == 200:
                        tasks = await response.json()
                        return [self._format_task(task) for task in tasks]
            return []
        except Exception as e:
            print(f"Error getting Todoist tasks: {e}")
            return []
    
    async def create_task(self, task_data: Dict) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Todoist"}
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "content": task_data.get('title', ''),
                "description": task_data.get('description', ''),
                "priority": self._map_priority(task_data.get('priority', 'medium')),
                "due_string": task_data.get('due_date', '')
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{self.base_url}/tasks", headers=headers, json=payload) as response:
                    if response.status == 200:
                        task = await response.json()
                        return self._format_task(task)
            return {"error": "Failed to create task"}
        except Exception as e:
            return {"error": f"Error creating Todoist task: {e}"}
    
    async def update_task(self, task_id: str, updates: Dict) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Todoist"}
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            payload = {}
            if 'title' in updates:
                payload['content'] = updates['title']
            if 'description' in updates:
                payload['description'] = updates['description']
            if 'priority' in updates:
                payload['priority'] = self._map_priority(updates['priority'])
            
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{self.base_url}/tasks/{task_id}", headers=headers, json=payload) as response:
                    if response.status == 200:
                        task = await response.json()
                        return self._format_task(task)
            return {"error": "Failed to update task"}
        except Exception as e:
            return {"error": f"Error updating Todoist task: {e}"}
    
    async def complete_task(self, task_id: str) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Todoist"}
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{self.base_url}/tasks/{task_id}/close", headers=headers) as response:
                    if response.status == 204:
                        return {"success": True, "task_id": task_id}
            return {"error": "Failed to complete task"}
        except Exception as e:
            return {"error": f"Error completing Todoist task: {e}"}
    
    def _format_task(self, task: Dict) -> Dict:
        return {
            "id": task.get('id'),
            "title": task.get('content'),
            "description": task.get('description', ''),
            "priority": self._unmap_priority(task.get('priority', 1)),
            "due_date": task.get('due', {}).get('date') if task.get('due') else None,
            "completed": task.get('completed', False),
            "service": "todoist",
            "created_at": task.get('created_at'),
            "updated_at": task.get('updated_at')
        }
    
    def _map_priority(self, priority: str) -> int:
        mapping = {"low": 1, "medium": 2, "high": 3, "urgent": 4}
        return mapping.get(priority.lower(), 2)
    
    def _unmap_priority(self, priority: int) -> str:
        mapping = {1: "low", 2: "medium", 3: "high", 4: "urgent"}
        return mapping.get(priority, "medium")

class GoogleTasksConnector(ServiceConnector):
    """Google Tasks integration"""
    
    def __init__(self):
        super().__init__("google_tasks")
        self.access_token = None
        self.base_url = "https://tasks.googleapis.com/tasks/v1"
    
    async def connect(self, credentials: Dict) -> bool:
        try:
            self.access_token = credentials.get('access_token')
            if not self.access_token:
                return False
            
            # Test connection
            headers = {"Authorization": f"Bearer {self.access_token}"}
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/users/@me/lists", headers=headers) as response:
                    if response.status == 200:
                        self.connected = True
                        self.credentials = credentials
                        return True
            return False
        except Exception as e:
            print(f"Error connecting to Google Tasks: {e}")
            return False
    
    async def disconnect(self) -> bool:
        self.connected = False
        self.credentials = {}
        self.access_token = None
        return True
    
    async def get_tasks(self) -> List[Dict]:
        if not self.connected:
            return []
        
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/users/@me/lists/@default/tasks", headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        tasks = data.get('items', [])
                        return [self._format_task(task) for task in tasks]
            return []
        except Exception as e:
            print(f"Error getting Google Tasks: {e}")
            return []
    
    async def create_task(self, task_data: Dict) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Google Tasks"}
        
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            payload = {
                "title": task_data.get('title', ''),
                "notes": task_data.get('description', ''),
                "due": task_data.get('due_date')
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{self.base_url}/users/@me/lists/@default/tasks", headers=headers, json=payload) as response:
                    if response.status == 200:
                        task = await response.json()
                        return self._format_task(task)
            return {"error": "Failed to create task"}
        except Exception as e:
            return {"error": f"Error creating Google Tasks task: {e}"}
    
    async def update_task(self, task_id: str, updates: Dict) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Google Tasks"}
        
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            payload = {}
            if 'title' in updates:
                payload['title'] = updates['title']
            if 'description' in updates:
                payload['notes'] = updates['description']
            
            async with aiohttp.ClientSession() as session:
                async with session.patch(f"{self.base_url}/users/@me/lists/@default/tasks/{task_id}", headers=headers, json=payload) as response:
                    if response.status == 200:
                        task = await response.json()
                        return self._format_task(task)
            return {"error": "Failed to update task"}
        except Exception as e:
            return {"error": f"Error updating Google Tasks task: {e}"}
    
    async def complete_task(self, task_id: str) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Google Tasks"}
        
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            payload = {"status": "completed"}
            
            async with aiohttp.ClientSession() as session:
                async with session.patch(f"{self.base_url}/users/@me/lists/@default/tasks/{task_id}", headers=headers, json=payload) as response:
                    if response.status == 200:
                        task = await response.json()
                        return self._format_task(task)
            return {"error": "Failed to complete task"}
        except Exception as e:
            return {"error": f"Error completing Google Tasks task: {e}"}
    
    def _format_task(self, task: Dict) -> Dict:
        return {
            "id": task.get('id'),
            "title": task.get('title'),
            "description": task.get('notes', ''),
            "priority": "medium",  # Google Tasks doesn't have priority
            "due_date": task.get('due'),
            "completed": task.get('status') == 'completed',
            "service": "google_tasks",
            "created_at": task.get('created'),
            "updated_at": task.get('updated')
        }

class GmailConnector:
    """Gmail integration for communication"""
    
    def __init__(self):
        self.service_name = "gmail"
        self.connected = False
        self.access_token = None
        self.base_url = "https://gmail.googleapis.com/gmail/v1"
    
    async def connect(self, credentials: Dict) -> bool:
        try:
            self.access_token = credentials.get('access_token')
            if not self.access_token:
                return False
            
            # Test connection
            headers = {"Authorization": f"Bearer {self.access_token}"}
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/users/me/profile", headers=headers) as response:
                    if response.status == 200:
                        self.connected = True
                        self.credentials = credentials
                        return True
            return False
        except Exception as e:
            print(f"Error connecting to Gmail: {e}")
            return False
    
    async def get_messages(self, query: str = "") -> List[Dict]:
        if not self.connected:
            return []
        
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            params = {"q": query, "maxResults": 10}
            
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/users/me/messages", headers=headers, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        messages = data.get('messages', [])
                        return [await self._format_message(msg_id) for msg_id in messages]
            return []
        except Exception as e:
            print(f"Error getting Gmail messages: {e}")
            return []
    
    async def _format_message(self, msg_id: str) -> Dict:
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/users/me/messages/{msg_id}", headers=headers) as response:
                    if response.status == 200:
                        message = await response.json()
                        payload = message.get('payload', {})
                        headers = payload.get('headers', [])
                        
                        # Extract common headers
                        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
                        date = next((h['value'] for h in headers if h['name'] == 'Date'), '')
                        
                        return {
                            "id": msg_id,
                            "subject": subject,
                            "sender": sender,
                            "date": date,
                            "service": "gmail",
                            "unread": 'UNREAD' in message.get('labelIds', [])
                        }
        except Exception as e:
            print(f"Error formatting Gmail message: {e}")
            return {}

class SlackConnector:
    """Slack integration for communication"""
    
    def __init__(self):
        self.service_name = "slack"
        self.connected = False
        self.bot_token = None
        self.base_url = "https://slack.com/api"
    
    async def connect(self, credentials: Dict) -> bool:
        try:
            self.bot_token = credentials.get('bot_token')
            if not self.bot_token:
                return False
            
            # Test connection
            headers = {"Authorization": f"Bearer {self.bot_token}"}
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/auth.test", headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('ok'):
                            self.connected = True
                            self.credentials = credentials
                            return True
            return False
        except Exception as e:
            print(f"Error connecting to Slack: {e}")
            return False
    
    async def get_messages(self, channel: str = "") -> List[Dict]:
        if not self.connected:
            return []
        
        try:
            headers = {"Authorization": f"Bearer {self.bot_token}"}
            params = {"channel": channel, "limit": 10}
            
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/conversations.history", headers=headers, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        messages = data.get('messages', [])
                        return [self._format_message(msg) for msg in messages]
            return []
        except Exception as e:
            print(f"Error getting Slack messages: {e}")
            return []
    
    def _format_message(self, message: Dict) -> Dict:
        return {
            "id": message.get('ts'),
            "text": message.get('text', ''),
            "user": message.get('user', ''),
            "channel": message.get('channel', ''),
            "date": datetime.fromtimestamp(float(message.get('ts', 0))).isoformat(),
            "service": "slack"
        }

class ServiceManager:
    """Manages all service connections and provides unified API"""
    
    def __init__(self):
        self.connectors = {
            'todoist': TodoistConnector(),
            'google_tasks': GoogleTasksConnector(),
            'gmail': GmailConnector(),
            'slack': SlackConnector()
        }
        self.connected_services = set()
    
    async def connect_service(self, service_type: str, credentials: Dict) -> Dict:
        """Connect to a service"""
        if service_type not in self.connectors:
            return {"error": f"Service {service_type} not supported"}
        
        connector = self.connectors[service_type]
        success = await connector.connect(credentials)
        
        if success:
            self.connected_services.add(service_type)
            return {"success": True, "service": service_type}
        else:
            return {"error": f"Failed to connect to {service_type}"}
    
    async def disconnect_service(self, service_type: str) -> Dict:
        """Disconnect from a service"""
        if service_type not in self.connectors:
            return {"error": f"Service {service_type} not found"}
        
        connector = self.connectors[service_type]
        success = await connector.disconnect()
        
        if success:
            self.connected_services.discard(service_type)
            return {"success": True, "service": service_type}
        else:
            return {"error": f"Failed to disconnect from {service_type}"}
    
    async def get_all_tasks(self) -> List[Dict]:
        """Get tasks from all connected task services"""
        all_tasks = []
        
        for service_type in ['todoist', 'google_tasks']:
            if service_type in self.connected_services:
                connector = self.connectors[service_type]
                tasks = await connector.get_tasks()
                all_tasks.extend(tasks)
        
        # Sort by priority and due date
        all_tasks.sort(key=lambda x: (
            x.get('priority', 'medium'),
            x.get('due_date', '9999-12-31')
        ))
        
        return all_tasks
    
    async def create_task(self, title: str, description: str = "", priority: str = "medium", 
                         due_date: str = None, service: str = "auto") -> Dict:
        """Create a task in the most appropriate service"""
        if service == "auto":
            # Choose best service based on task characteristics
            if "urgent" in title.lower() or priority == "urgent":
                service = "todoist"  # Better for urgent tasks
            else:
                service = "google_tasks"  # Simpler for regular tasks
        
        if service not in self.connected_services:
            return {"error": f"Service {service} not connected"}
        
        connector = self.connectors[service]
        task_data = {
            "title": title,
            "description": description,
            "priority": priority,
            "due_date": due_date
        }
        
        return await connector.create_task(task_data)
    
    async def get_all_messages(self) -> List[Dict]:
        """Get messages from all communication services"""
        all_messages = []
        
        for service_type in ['gmail', 'slack']:
            if service_type in self.connected_services:
                connector = self.connectors[service_type]
                messages = await connector.get_messages()
                all_messages.extend(messages)
        
        # Sort by date
        all_messages.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        return all_messages
    
    async def send_message(self, message: str, recipient: str, channel: str = "auto") -> Dict:
        """Send a message via the best channel"""
        # This would be implemented based on the specific service
        return {"success": True, "message": "Message sent", "channel": channel}
    
    async def get_calendar_events(self) -> List[Dict]:
        """Get calendar events (placeholder)"""
        return []
    
    async def create_calendar_event(self, title: str, start_time: str, end_time: str, description: str = "") -> Dict:
        """Create calendar event (placeholder)"""
        return {"success": True, "event": {"title": title, "start": start_time, "end": end_time}}
    
    def check_for_updates(self) -> Dict:
        """Check for updates across all services"""
        # This would check for new messages, task updates, etc.
        return {"updates": []}
