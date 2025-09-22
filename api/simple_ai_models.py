"""
Simplified AI Models for Vercel deployment
Lightweight version without heavy dependencies
"""

import os
import json
import requests
from typing import Dict, List, Any, Optional

class SimpleGLMModel:
    """Simplified GLM model integration for Vercel"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    
    async def generate_response(self, messages: List[Dict], **kwargs) -> str:
        """Generate a response using GLM model"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "glm-4",
                "messages": messages,
                "temperature": kwargs.get('temperature', 0.7),
                "max_tokens": kwargs.get('max_tokens', 2000)
            }
            
            response = requests.post(self.base_url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            return result['choices'][0]['message']['content']
            
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}. Please try again."
    
    async def generate_with_tools(self, messages: List[Dict], tools: List[Dict], **kwargs) -> Dict:
        """Generate a response with tool calling using GLM"""
        try:
            # For now, just generate a regular response
            content = await self.generate_response(messages, **kwargs)
            
            # Simple tool call extraction
            tool_calls = []
            for tool in tools:
                if tool['name'].lower() in content.lower():
                    tool_calls.append({
                        'name': tool['name'],
                        'arguments': {}
                    })
            
            return {
                'content': content,
                'tool_calls': tool_calls
            }
            
        except Exception as e:
            return {
                'content': f"I apologize, but I encountered an error: {str(e)}. Please try again.",
                'tool_calls': []
            }

class SimpleGROQModel:
    """Simplified GROQ model integration for Vercel"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
    
    async def generate_response(self, messages: List[Dict], **kwargs) -> str:
        """Generate a response using GROQ model"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "llama3-8b-8192",
                "messages": messages,
                "temperature": kwargs.get('temperature', 0.7),
                "max_tokens": kwargs.get('max_tokens', 2000)
            }
            
            response = requests.post(self.base_url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            return result['choices'][0]['message']['content']
            
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}. Please try again."
    
    async def generate_with_tools(self, messages: List[Dict], tools: List[Dict], **kwargs) -> Dict:
        """Generate a response with tool calling using GROQ"""
        try:
            content = await self.generate_response(messages, **kwargs)
            
            # Simple tool call extraction
            tool_calls = []
            for tool in tools:
                if tool['name'].lower() in content.lower():
                    tool_calls.append({
                        'name': tool['name'],
                        'arguments': {}
                    })
            
            return {
                'content': content,
                'tool_calls': tool_calls
            }
            
        except Exception as e:
            return {
                'content': f"I apologize, but I encountered an error: {str(e)}. Please try again.",
                'tool_calls': []
            }

class SimpleModelManager:
    """Simplified model manager for Vercel deployment"""
    
    def __init__(self):
        self.models = {}
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize available AI models"""
        # GLM Model
        glm_key = os.getenv('GLM_API_KEY')
        if glm_key:
            self.models['glm'] = SimpleGLMModel(glm_key)
        
        # GROQ Model
        groq_key = os.getenv('GROQ_API_KEY')
        if groq_key:
            self.models['groq'] = SimpleGROQModel(groq_key)
    
    def get_model(self, model_name: str = 'glm'):
        """Get a specific AI model"""
        return self.models.get(model_name)
    
    def get_available_models(self):
        """Get list of available models"""
        return list(self.models.keys())
    
    async def generate_response(self, messages: List[Dict], model_name: str = 'glm', **kwargs) -> str:
        """Generate response using specified model"""
        model = self.get_model(model_name)
        if not model:
            return "AI service temporarily unavailable. Please try again later."
        
        return await model.generate_response(messages, **kwargs)
    
    async def generate_with_tools(self, messages: List[Dict], tools: List[Dict], 
                                model_name: str = 'glm', **kwargs) -> Dict:
        """Generate response with tools using specified model"""
        model = self.get_model(model_name)
        if not model:
            return {
                'content': "AI service temporarily unavailable. Please try again later.",
                'tool_calls': []
            }
        
        return await model.generate_with_tools(messages, tools, **kwargs)

# Global model manager instance
model_manager = SimpleModelManager()
