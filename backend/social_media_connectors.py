"""
Social Media Connectors - Integration with various social media platforms
Handles posting, scheduling, and analytics for multiple social media accounts
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import asyncio
import aiohttp
from abc import ABC, abstractmethod

class SocialMediaConnector(ABC):
    """Base class for all social media connectors"""
    
    def __init__(self, platform_name: str):
        self.platform_name = platform_name
        self.connected = False
        self.credentials = {}
        self.base_url = ""
    
    @abstractmethod
    async def connect(self, credentials: Dict) -> bool:
        """Connect to the social media platform"""
        pass
    
    @abstractmethod
    async def post_content(self, content: str, media_urls: List[str] = None, 
                          scheduled_time: datetime = None) -> Dict:
        """Post content to the platform"""
        pass
    
    @abstractmethod
    async def get_analytics(self, post_id: str) -> Dict:
        """Get analytics for a specific post"""
        pass
    
    @abstractmethod
    async def get_account_info(self) -> Dict:
        """Get account information"""
        pass

class FacebookConnector(SocialMediaConnector):
    """Facebook integration for posting and analytics"""
    
    def __init__(self):
        super().__init__("facebook")
        self.base_url = "https://graph.facebook.com/v18.0"
        self.access_token = None
        self.page_id = None
    
    async def connect(self, credentials: Dict) -> bool:
        try:
            self.access_token = credentials.get('access_token')
            self.page_id = credentials.get('page_id')
            
            if not self.access_token or not self.page_id:
                return False
            
            # Test connection by getting page info
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/{self.page_id}"
                params = {
                    'access_token': self.access_token,
                    'fields': 'id,name,access_token'
                }
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        self.connected = True
                        self.credentials = credentials
                        return True
            return False
        except Exception as e:
            print(f"Error connecting to Facebook: {e}")
            return False
    
    async def post_content(self, content: str, media_urls: List[str] = None, 
                          scheduled_time: datetime = None) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Facebook"}
        
        try:
            post_data = {
                'message': content,
                'access_token': self.access_token
            }
            
            if scheduled_time:
                post_data['scheduled_publish_time'] = int(scheduled_time.timestamp())
                post_data['published'] = False
            
            if media_urls:
                if len(media_urls) == 1:
                    # Single image/video
                    post_data['link'] = media_urls[0]
                else:
                    # Multiple media - use album
                    post_data['attached_media'] = json.dumps([
                        {"media_fbid": media_url} for media_url in media_urls
                    ])
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/{self.page_id}/feed"
                async with session.post(url, data=post_data) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {"success": True, "post_id": result.get('id')}
                    else:
                        error = await response.json()
                        return {"error": error.get('error', {}).get('message', 'Unknown error')}
        except Exception as e:
            return {"error": f"Error posting to Facebook: {e}"}
    
    async def get_analytics(self, post_id: str) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Facebook"}
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/{post_id}/insights"
                params = {
                    'access_token': self.access_token,
                    'metric': 'post_impressions,post_engaged_users,post_clicks'
                }
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {"success": True, "analytics": data}
                    else:
                        return {"error": "Failed to fetch analytics"}
        except Exception as e:
            return {"error": f"Error fetching Facebook analytics: {e}"}
    
    async def get_account_info(self) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Facebook"}
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/{self.page_id}"
                params = {
                    'access_token': self.access_token,
                    'fields': 'id,name,fan_count,website'
                }
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {"success": True, "account": data}
                    else:
                        return {"error": "Failed to fetch account info"}
        except Exception as e:
            return {"error": f"Error fetching Facebook account info: {e}"}

class TwitterConnector(SocialMediaConnector):
    """Twitter integration for posting and analytics"""
    
    def __init__(self):
        super().__init__("twitter")
        self.base_url = "https://api.twitter.com/2"
        self.access_token = None
        self.access_token_secret = None
        self.api_key = None
        self.api_secret = None
    
    async def connect(self, credentials: Dict) -> bool:
        try:
            self.access_token = credentials.get('access_token')
            self.access_token_secret = credentials.get('access_token_secret')
            self.api_key = credentials.get('api_key')
            self.api_secret = credentials.get('api_secret')
            
            if not all([self.access_token, self.access_token_secret, self.api_key, self.api_secret]):
                return False
            
            # Test connection by getting user info
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/users/me"
                headers = {
                    'Authorization': f'Bearer {self.access_token}'
                }
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        self.connected = True
                        self.credentials = credentials
                        return True
            return False
        except Exception as e:
            print(f"Error connecting to Twitter: {e}")
            return False
    
    async def post_content(self, content: str, media_urls: List[str] = None, 
                          scheduled_time: datetime = None) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Twitter"}
        
        try:
            tweet_data = {
                'text': content[:280]  # Twitter character limit
            }
            
            if media_urls:
                # For now, just include media URLs in text
                # In production, you'd upload media first and get media IDs
                tweet_data['text'] += f"\n\nMedia: {', '.join(media_urls)}"
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/tweets"
                headers = {
                    'Authorization': f'Bearer {self.access_token}',
                    'Content-Type': 'application/json'
                }
                async with session.post(url, headers=headers, json=tweet_data) as response:
                    if response.status == 201:
                        result = await response.json()
                        return {"success": True, "post_id": result.get('data', {}).get('id')}
                    else:
                        error = await response.json()
                        return {"error": error.get('detail', 'Unknown error')}
        except Exception as e:
            return {"error": f"Error posting to Twitter: {e}"}
    
    async def get_analytics(self, post_id: str) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Twitter"}
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/tweets/{post_id}"
                params = {
                    'tweet.fields': 'public_metrics'
                }
                headers = {
                    'Authorization': f'Bearer {self.access_token}'
                }
                async with session.get(url, headers=headers, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {"success": True, "analytics": data.get('data', {}).get('public_metrics', {})}
                    else:
                        return {"error": "Failed to fetch analytics"}
        except Exception as e:
            return {"error": f"Error fetching Twitter analytics: {e}"}
    
    async def get_account_info(self) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Twitter"}
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/users/me"
                params = {
                    'user.fields': 'id,name,username,public_metrics'
                }
                headers = {
                    'Authorization': f'Bearer {self.access_token}'
                }
                async with session.get(url, headers=headers, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {"success": True, "account": data.get('data', {})}
                    else:
                        return {"error": "Failed to fetch account info"}
        except Exception as e:
            return {"error": f"Error fetching Twitter account info: {e}"}

class InstagramConnector(SocialMediaConnector):
    """Instagram integration for posting and analytics"""
    
    def __init__(self):
        super().__init__("instagram")
        self.base_url = "https://graph.facebook.com/v18.0"
        self.access_token = None
        self.instagram_account_id = None
    
    async def connect(self, credentials: Dict) -> bool:
        try:
            self.access_token = credentials.get('access_token')
            self.instagram_account_id = credentials.get('instagram_account_id')
            
            if not self.access_token or not self.instagram_account_id:
                return False
            
            # Test connection by getting account info
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/{self.instagram_account_id}"
                params = {
                    'access_token': self.access_token,
                    'fields': 'id,username,account_type,media_count'
                }
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        self.connected = True
                        self.credentials = credentials
                        return True
            return False
        except Exception as e:
            print(f"Error connecting to Instagram: {e}")
            return False
    
    async def post_content(self, content: str, media_urls: List[str] = None, 
                          scheduled_time: datetime = None) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Instagram"}
        
        try:
            if not media_urls:
                return {"error": "Instagram requires media content"}
            
            # For Instagram, we need to create a media container first
            media_data = {
                'image_url': media_urls[0],  # Instagram typically uses single image
                'caption': content,
                'access_token': self.access_token
            }
            
            async with aiohttp.ClientSession() as session:
                # Create media container
                url = f"{self.base_url}/{self.instagram_account_id}/media"
                async with session.post(url, data=media_data) as response:
                    if response.status == 200:
                        container_result = await response.json()
                        container_id = container_result.get('id')
                        
                        # Publish the media
                        publish_data = {
                            'creation_id': container_id,
                            'access_token': self.access_token
                        }
                        
                        publish_url = f"{self.base_url}/{self.instagram_account_id}/media_publish"
                        async with session.post(publish_url, data=publish_data) as publish_response:
                            if publish_response.status == 200:
                                result = await publish_response.json()
                                return {"success": True, "post_id": result.get('id')}
                            else:
                                return {"error": "Failed to publish Instagram post"}
                    else:
                        error = await response.json()
                        return {"error": error.get('error', {}).get('message', 'Unknown error')}
        except Exception as e:
            return {"error": f"Error posting to Instagram: {e}"}
    
    async def get_analytics(self, post_id: str) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Instagram"}
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/{post_id}/insights"
                params = {
                    'access_token': self.access_token,
                    'metric': 'impressions,reach,likes,comments,shares,saves'
                }
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {"success": True, "analytics": data}
                    else:
                        return {"error": "Failed to fetch analytics"}
        except Exception as e:
            return {"error": f"Error fetching Instagram analytics: {e}"}
    
    async def get_account_info(self) -> Dict:
        if not self.connected:
            return {"error": "Not connected to Instagram"}
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/{self.instagram_account_id}"
                params = {
                    'access_token': self.access_token,
                    'fields': 'id,username,account_type,media_count,followers_count,follows_count'
                }
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {"success": True, "account": data}
                    else:
                        return {"error": "Failed to fetch account info"}
        except Exception as e:
            return {"error": f"Error fetching Instagram account info: {e}"}

class LinkedInConnector(SocialMediaConnector):
    """LinkedIn integration for posting and analytics"""
    
    def __init__(self):
        super().__init__("linkedin")
        self.base_url = "https://api.linkedin.com/v2"
        self.access_token = None
        self.person_urn = None
    
    async def connect(self, credentials: Dict) -> bool:
        try:
            self.access_token = credentials.get('access_token')
            self.person_urn = credentials.get('person_urn')
            
            if not self.access_token or not self.person_urn:
                return False
            
            # Test connection by getting profile info
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/people/~"
                headers = {
                    'Authorization': f'Bearer {self.access_token}',
                    'X-Restli-Protocol-Version': '2.0.0'
                }
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        self.connected = True
                        self.credentials = credentials
                        return True
            return False
        except Exception as e:
            print(f"Error connecting to LinkedIn: {e}")
            return False
    
    async def post_content(self, content: str, media_urls: List[str] = None, 
                          scheduled_time: datetime = None) -> Dict:
        if not self.connected:
            return {"error": "Not connected to LinkedIn"}
        
        try:
            post_data = {
                'author': self.person_urn,
                'lifecycleState': 'PUBLISHED',
                'specificContent': {
                    'com.linkedin.ugc.ShareContent': {
                        'shareCommentary': {
                            'text': content
                        },
                        'shareMediaCategory': 'NONE'
                    }
                },
                'visibility': {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            }
            
            if media_urls:
                post_data['specificContent']['com.linkedin.ugc.ShareContent']['shareMediaCategory'] = 'IMAGE'
                post_data['specificContent']['com.linkedin.ugc.ShareContent']['media'] = [
                    {
                        'status': 'READY',
                        'description': {
                            'text': content
                        },
                        'media': media_urls[0],
                        'title': {
                            'text': 'Shared via Omni'
                        }
                    }
                ]
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/ugcPosts"
                headers = {
                    'Authorization': f'Bearer {self.access_token}',
                    'X-Restli-Protocol-Version': '2.0.0',
                    'Content-Type': 'application/json'
                }
                async with session.post(url, headers=headers, json=post_data) as response:
                    if response.status == 201:
                        result = await response.json()
                        return {"success": True, "post_id": result.get('id')}
                    else:
                        error = await response.json()
                        return {"error": error.get('message', 'Unknown error')}
        except Exception as e:
            return {"error": f"Error posting to LinkedIn: {e}"}
    
    async def get_analytics(self, post_id: str) -> Dict:
        # LinkedIn analytics require special permissions and are complex
        return {"success": True, "analytics": {"message": "Analytics not available for this post"}}
    
    async def get_account_info(self) -> Dict:
        if not self.connected:
            return {"error": "Not connected to LinkedIn"}
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/people/~"
                params = {
                    'projection': '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'
                }
                headers = {
                    'Authorization': f'Bearer {self.access_token}',
                    'X-Restli-Protocol-Version': '2.0.0'
                }
                async with session.get(url, headers=headers, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {"success": True, "account": data}
                    else:
                        return {"error": "Failed to fetch account info"}
        except Exception as e:
            return {"error": f"Error fetching LinkedIn account info: {e}"}

class SocialMediaManager:
    """Manages all social media connections and provides unified API"""
    
    def __init__(self):
        self.connectors = {
            'facebook': FacebookConnector(),
            'twitter': TwitterConnector(),
            'instagram': InstagramConnector(),
            'linkedin': LinkedInConnector(),
        }
        self.connected_platforms = set()
    
    async def connect_platform(self, platform: str, credentials: Dict) -> Dict:
        """Connect to a social media platform"""
        if platform not in self.connectors:
            return {"error": f"Platform {platform} not supported"}
        
        connector = self.connectors[platform]
        success = await connector.connect(credentials)
        
        if success:
            self.connected_platforms.add(platform)
            return {"success": True, "platform": platform}
        else:
            return {"error": f"Failed to connect to {platform}"}
    
    async def disconnect_platform(self, platform: str) -> Dict:
        """Disconnect from a social media platform"""
        if platform in self.connected_platforms:
            self.connected_platforms.discard(platform)
            return {"success": True, "platform": platform}
        return {"error": f"Platform {platform} not connected"}
    
    async def post_to_platforms(self, content: str, platforms: List[str], 
                               media_urls: List[str] = None, 
                               scheduled_time: datetime = None) -> Dict:
        """Post content to multiple platforms"""
        results = {}
        
        for platform in platforms:
            if platform in self.connected_platforms:
                connector = self.connectors[platform]
                result = await connector.post_content(content, media_urls, scheduled_time)
                results[platform] = result
            else:
                results[platform] = {"error": f"Platform {platform} not connected"}
        
        return {"success": True, "results": results}
    
    async def get_platform_analytics(self, platform: str, post_id: str) -> Dict:
        """Get analytics for a specific platform and post"""
        if platform not in self.connected_platforms:
            return {"error": f"Platform {platform} not connected"}
        
        connector = self.connectors[platform]
        return await connector.get_analytics(post_id)
    
    async def get_platform_account_info(self, platform: str) -> Dict:
        """Get account information for a specific platform"""
        if platform not in self.connected_platforms:
            return {"error": f"Platform {platform} not connected"}
        
        connector = self.connectors[platform]
        return await connector.get_account_info()
    
    def get_connected_platforms(self) -> List[str]:
        """Get list of connected platforms"""
        return list(self.connected_platforms)
    
    def get_supported_platforms(self) -> List[Dict]:
        """Get list of supported platforms with their capabilities"""
        return [
            {
                "id": "facebook",
                "name": "Facebook",
                "icon": "📘",
                "color": "#1877F2",
                "max_characters": 63206,
                "supports_images": True,
                "supports_videos": True,
                "supports_links": True,
                "supports_hashtags": True,
                "supports_mentions": True,
            },
            {
                "id": "twitter",
                "name": "Twitter",
                "icon": "🐦",
                "color": "#1DA1F2",
                "max_characters": 280,
                "supports_images": True,
                "supports_videos": True,
                "supports_links": True,
                "supports_hashtags": True,
                "supports_mentions": True,
            },
            {
                "id": "instagram",
                "name": "Instagram",
                "icon": "📷",
                "color": "#E4405F",
                "max_characters": 2200,
                "supports_images": True,
                "supports_videos": True,
                "supports_links": False,
                "supports_hashtags": True,
                "supports_mentions": True,
            },
            {
                "id": "linkedin",
                "name": "LinkedIn",
                "icon": "💼",
                "color": "#0077B5",
                "max_characters": 3000,
                "supports_images": True,
                "supports_videos": True,
                "supports_links": True,
                "supports_hashtags": True,
                "supports_mentions": True,
            },
        ]
