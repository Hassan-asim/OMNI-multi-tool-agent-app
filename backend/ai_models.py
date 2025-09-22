"""
AI Model Configuration and Integration
Supports GLM, GROQ, and other AI models for the Omni agent
"""

import os
import json
from typing import Dict, List, Any, Optional
from abc import ABC, abstractmethod
import requests
import zhipuai
from groq import Groq

class AIModel(ABC):
    """Base class for AI model integrations"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    @abstractmethod
    async def generate_response(self, messages: List[Dict], **kwargs) -> str:
        """Generate a response from the AI model"""
        pass
    
    @abstractmethod
    async def generate_with_tools(self, messages: List[Dict], tools: List[Dict], **kwargs) -> Dict:
        """Generate a response with tool calling capabilities"""
        pass

class GLMModel(AIModel):
    """GLM (Zhipu AI) model integration"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        zhipuai.api_key = api_key
    
    async def generate_response(self, messages: List[Dict], **kwargs) -> str:
        """Generate a response using GLM model"""
        try:
            # Convert messages to GLM format
            prompt = self._convert_messages_to_prompt(messages)
            
            response = zhipuai.model_api.invoke(
                model="glm-4",
                prompt=prompt,
                temperature=kwargs.get('temperature', 0.7),
                max_tokens=kwargs.get('max_tokens', 2000),
            )
            
            if response['code'] == 200:
                return response['data']['choices'][0]['message']['content']
            else:
                raise Exception(f"GLM API error: {response['msg']}")
                
        except Exception as e:
            raise Exception(f"Error calling GLM API: {str(e)}")
    
    async def generate_with_tools(self, messages: List[Dict], tools: List[Dict], **kwargs) -> Dict:
        """Generate a response with tool calling using GLM"""
        try:
            # Convert messages to GLM format
            prompt = self._convert_messages_to_prompt(messages)
            
            # Add tool information to prompt
            tool_descriptions = []
            for tool in tools:
                tool_descriptions.append(f"- {tool['name']}: {tool['description']}")
            
            tool_prompt = f"""
Available tools:
{chr(10).join(tool_descriptions)}

Please respond with your answer and indicate if you want to use any tools.
"""
            
            full_prompt = prompt + "\n\n" + tool_prompt
            
            response = zhipuai.model_api.invoke(
                model="glm-4",
                prompt=full_prompt,
                temperature=kwargs.get('temperature', 0.7),
                max_tokens=kwargs.get('max_tokens', 2000),
            )
            
            if response['code'] == 200:
                content = response['data']['choices'][0]['message']['content']
                return {
                    'content': content,
                    'tool_calls': self._extract_tool_calls(content, tools)
                }
            else:
                raise Exception(f"GLM API error: {response['msg']}")
                
        except Exception as e:
            raise Exception(f"Error calling GLM API with tools: {str(e)}")
    
    def _convert_messages_to_prompt(self, messages: List[Dict]) -> str:
        """Convert LangChain messages to GLM prompt format"""
        prompt_parts = []
        
        for message in messages:
            role = message.get('role', 'user')
            content = message.get('content', '')
            
            if role == 'system':
                prompt_parts.append(f"System: {content}")
            elif role == 'user':
                prompt_parts.append(f"Human: {content}")
            elif role == 'assistant':
                prompt_parts.append(f"Assistant: {content}")
        
        return "\n\n".join(prompt_parts)
    
    def _extract_tool_calls(self, content: str, tools: List[Dict]) -> List[Dict]:
        """Extract tool calls from GLM response"""
        tool_calls = []
        
        # Simple tool call extraction (can be enhanced)
        for tool in tools:
            if f"use {tool['name']}" in content.lower() or f"call {tool['name']}" in content.lower():
                tool_calls.append({
                    'name': tool['name'],
                    'arguments': {}  # Would need more sophisticated parsing
                })
        
        return tool_calls

class GROQModel(AIModel):
    """GROQ model integration"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Groq(api_key=api_key)
    
    async def generate_response(self, messages: List[Dict], **kwargs) -> str:
        """Generate a response using GROQ model"""
        try:
            response = self.client.chat.completions.create(
                model="llama3-8b-8192",  # or "mixtral-8x7b-32768"
                messages=messages,
                temperature=kwargs.get('temperature', 0.7),
                max_tokens=kwargs.get('max_tokens', 2000),
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"Error calling GROQ API: {str(e)}")
    
    async def generate_with_tools(self, messages: List[Dict], tools: List[Dict], **kwargs) -> Dict:
        """Generate a response with tool calling using GROQ"""
        try:
            # Convert tools to GROQ format
            groq_tools = []
            for tool in tools:
                groq_tools.append({
                    "type": "function",
                    "function": {
                        "name": tool['name'],
                        "description": tool['description'],
                        "parameters": tool.get('parameters', {})
                    }
                })
            
            response = self.client.chat.completions.create(
                model="llama3-8b-8192",
                messages=messages,
                tools=groq_tools,
                tool_choice="auto",
                temperature=kwargs.get('temperature', 0.7),
                max_tokens=kwargs.get('max_tokens', 2000),
            )
            
            message = response.choices[0].message
            tool_calls = []
            
            if message.tool_calls:
                for tool_call in message.tool_calls:
                    tool_calls.append({
                        'name': tool_call.function.name,
                        'arguments': json.loads(tool_call.function.arguments)
                    })
            
            return {
                'content': message.content,
                'tool_calls': tool_calls
            }
            
        except Exception as e:
            raise Exception(f"Error calling GROQ API with tools: {str(e)}")

class ModelManager:
    """Manages different AI models and provides unified interface"""
    
    def __init__(self):
        self.models = {}
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize available AI models"""
        # GLM Model
        glm_key = os.getenv('GLM_API_KEY')
        if glm_key:
            self.models['glm'] = GLMModel(glm_key)
        
        # GROQ Model
        groq_key = os.getenv('GROQ_API_KEY')
        if groq_key:
            self.models['groq'] = GROQModel(groq_key)
    
    def get_model(self, model_name: str = 'glm') -> Optional[AIModel]:
        """Get a specific AI model"""
        return self.models.get(model_name)
    
    def get_available_models(self) -> List[str]:
        """Get list of available models"""
        return list(self.models.keys())
    
    async def generate_response(self, messages: List[Dict], model_name: str = 'glm', **kwargs) -> str:
        """Generate response using specified model"""
        model = self.get_model(model_name)
        if not model:
            raise Exception(f"Model {model_name} not available")
        
        return await model.generate_response(messages, **kwargs)
    
    async def generate_with_tools(self, messages: List[Dict], tools: List[Dict], 
                                model_name: str = 'glm', **kwargs) -> Dict:
        """Generate response with tools using specified model"""
        model = self.get_model(model_name)
        if not model:
            raise Exception(f"Model {model_name} not available")
        
        return await model.generate_with_tools(messages, tools, **kwargs)

# Global model manager instance
model_manager = ModelManager()
