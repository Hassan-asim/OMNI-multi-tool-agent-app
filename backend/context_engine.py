"""
Context Engine - AI-powered context awareness and personalization
Understands user's situation, preferences, and patterns to provide intelligent assistance
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import asyncio
import aiohttp
from dataclasses import dataclass
from enum import Enum

class EnergyLevel(Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    EXHAUSTED = "exhausted"

class TimeOfDay(Enum):
    EARLY_MORNING = "early_morning"  # 5-8 AM
    MORNING = "morning"              # 8-12 PM
    AFTERNOON = "afternoon"          # 12-5 PM
    EVENING = "evening"              # 5-9 PM
    NIGHT = "night"                  # 9 PM-5 AM

@dataclass
class UserContext:
    """Current user context and state"""
    current_time: datetime
    time_of_day: TimeOfDay
    energy_level: EnergyLevel
    location: str
    current_focus: str
    recent_activity: List[str]
    mood: str
    productivity_score: float
    stress_level: float
    available_time: int  # minutes
    preferred_communication: str
    work_mode: bool
    personal_mode: bool

@dataclass
class LifeMetrics:
    """Comprehensive life tracking metrics"""
    health: Dict[str, Any]
    finance: Dict[str, Any]
    learning: Dict[str, Any]
    habits: Dict[str, Any]
    relationships: Dict[str, Any]
    career: Dict[str, Any]
    personal_growth: Dict[str, Any]

class ContextEngine:
    """
    Advanced context engine that understands user patterns and provides
    intelligent, personalized assistance
    """
    
    def __init__(self):
        self.user_context = None
        self.life_metrics = None
        self.user_preferences = {}
        self.patterns = {}
        self.insights_history = []
        self.analytics_data = {}
        
        # Initialize with default context
        self._initialize_default_context()
    
    def _initialize_default_context(self):
        """Initialize with default context values"""
        now = datetime.now()
        self.user_context = UserContext(
            current_time=now,
            time_of_day=self._determine_time_of_day(now),
            energy_level=EnergyLevel.MEDIUM,
            location="Unknown",
            current_focus="General",
            recent_activity=[],
            mood="neutral",
            productivity_score=0.5,
            stress_level=0.3,
            available_time=60,
            preferred_communication="email",
            work_mode=True,
            personal_mode=False
        )
    
    def _determine_time_of_day(self, time: datetime) -> TimeOfDay:
        """Determine time of day based on current time"""
        hour = time.hour
        
        if 5 <= hour < 8:
            return TimeOfDay.EARLY_MORNING
        elif 8 <= hour < 12:
            return TimeOfDay.MORNING
        elif 12 <= hour < 17:
            return TimeOfDay.AFTERNOON
        elif 17 <= hour < 21:
            return TimeOfDay.EVENING
        else:
            return TimeOfDay.NIGHT
    
    def _determine_energy_level(self, context: Dict) -> EnergyLevel:
        """Determine energy level based on various factors"""
        # This would use ML models in a real implementation
        time_of_day = context.get('time_of_day')
        recent_activity = context.get('recent_activity', [])
        stress_level = context.get('stress_level', 0.3)
        
        # Simple heuristic for now
        if time_of_day == TimeOfDay.MORNING:
            return EnergyLevel.HIGH
        elif time_of_day == TimeOfDay.AFTERNOON:
            return EnergyLevel.MEDIUM
        elif time_of_day == TimeOfDay.EVENING:
            return EnergyLevel.LOW
        else:
            return EnergyLevel.LOW
    
    def update_context(self, new_data: Dict = None):
        """Update user context with new information"""
        if new_data:
            # Update specific context fields
            for key, value in new_data.items():
                if hasattr(self.user_context, key):
                    setattr(self.user_context, key, value)
        
        # Recalculate derived fields
        now = datetime.now()
        self.user_context.current_time = now
        self.user_context.time_of_day = self._determine_time_of_day(now)
        self.user_context.energy_level = self._determine_energy_level(self.user_context.__dict__)
        
        # Update patterns
        self._update_patterns()
    
    def _update_patterns(self):
        """Update user patterns based on current context"""
        # This would use ML to identify patterns
        # For now, we'll use simple heuristics
        
        time_key = f"{self.user_context.time_of_day.value}_{self.user_context.energy_level.value}"
        
        if time_key not in self.patterns:
            self.patterns[time_key] = {
                'frequency': 0,
                'common_activities': [],
                'preferred_tasks': [],
                'communication_preferences': []
            }
        
        self.patterns[time_key]['frequency'] += 1
    
    def get_context(self) -> Dict:
        """Get current user context"""
        return {
            'current_time': self.user_context.current_time.isoformat(),
            'time_of_day': self.user_context.time_of_day.value,
            'energy_level': self.user_context.energy_level.value,
            'location': self.user_context.location,
            'current_focus': self.user_context.current_focus,
            'recent_activity': self.user_context.recent_activity,
            'mood': self.user_context.mood,
            'productivity_score': self.user_context.productivity_score,
            'stress_level': self.user_context.stress_level,
            'available_time': self.user_context.available_time,
            'preferred_communication': self.user_context.preferred_communication,
            'work_mode': self.user_context.work_mode,
            'personal_mode': self.user_context.personal_mode,
            'patterns': self.patterns
        }
    
    def get_life_metrics(self) -> Dict:
        """Get comprehensive life metrics"""
        if not self.life_metrics:
            self.life_metrics = self._generate_default_life_metrics()
        
        return {
            'health': self.life_metrics.health,
            'finance': self.life_metrics.finance,
            'learning': self.life_metrics.learning,
            'habits': self.life_metrics.habits,
            'relationships': self.life_metrics.relationships,
            'career': self.life_metrics.career,
            'personal_growth': self.life_metrics.personal_growth,
            'overall_score': self._calculate_overall_score()
        }
    
    def _generate_default_life_metrics(self) -> LifeMetrics:
        """Generate default life metrics"""
        return LifeMetrics(
            health={
                'sleep_hours': 7.5,
                'exercise_minutes': 30,
                'water_intake': 8,
                'stress_level': 0.3,
                'energy_level': 0.7,
                'mood_score': 0.6
            },
            finance={
                'monthly_income': 5000,
                'monthly_expenses': 3500,
                'savings_rate': 0.3,
                'investment_growth': 0.08,
                'debt_level': 0.2,
                'financial_stress': 0.4
            },
            learning={
                'hours_per_week': 5,
                'courses_completed': 2,
                'skills_learned': 3,
                'learning_streak': 7,
                'knowledge_areas': ['programming', 'design', 'business'],
                'learning_velocity': 0.6
            },
            habits={
                'morning_routine': True,
                'exercise_consistency': 0.8,
                'meditation_practice': 0.6,
                'reading_habit': 0.7,
                'journaling': 0.4,
                'habit_streak': 21
            },
            relationships={
                'family_time': 10,  # hours per week
                'friend_connections': 5,
                'romantic_relationship': True,
                'social_energy': 0.6,
                'communication_frequency': 0.8,
                'relationship_satisfaction': 0.7
            },
            career={
                'job_satisfaction': 0.7,
                'productivity_score': 0.8,
                'skill_development': 0.6,
                'work_life_balance': 0.5,
                'career_growth': 0.6,
                'team_collaboration': 0.8
            },
            personal_growth={
                'goal_achievement': 0.6,
                'self_reflection': 0.7,
                'creativity_expression': 0.5,
                'spiritual_practice': 0.3,
                'hobby_engagement': 0.6,
                'personal_fulfillment': 0.6
            }
        )
    
    def _calculate_overall_score(self) -> float:
        """Calculate overall life satisfaction score"""
        if not self.life_metrics:
            return 0.5
        
        scores = [
            self.life_metrics.health.get('mood_score', 0.5),
            self.life_metrics.finance.get('financial_stress', 0.5),
            1 - self.life_metrics.finance.get('financial_stress', 0.5),  # Invert stress
            self.life_metrics.learning.get('learning_velocity', 0.5),
            self.life_metrics.habits.get('habit_streak', 0) / 30,  # Normalize to 0-1
            self.life_metrics.relationships.get('relationship_satisfaction', 0.5),
            self.life_metrics.career.get('job_satisfaction', 0.5),
            self.life_metrics.personal_growth.get('personal_fulfillment', 0.5)
        ]
        
        return sum(scores) / len(scores)
    
    def get_insights(self) -> List[Dict]:
        """Get AI-powered insights about user's digital life"""
        insights = []
        
        # Energy-based insights
        if self.user_context.energy_level == EnergyLevel.HIGH:
            insights.append({
                'type': 'productivity',
                'title': 'High Energy Window',
                'message': 'You have high energy right now - perfect for tackling challenging tasks!',
                'action': 'Focus on your most important or difficult tasks',
                'priority': 'high'
            })
        elif self.user_context.energy_level == EnergyLevel.LOW:
            insights.append({
                'type': 'wellness',
                'title': 'Low Energy Detected',
                'message': 'Your energy is low - consider taking a break or doing lighter tasks.',
                'action': 'Take a 15-minute break or switch to administrative tasks',
                'priority': 'medium'
            })
        
        # Time-based insights
        if self.user_context.time_of_day == TimeOfDay.MORNING:
            insights.append({
                'type': 'planning',
                'title': 'Morning Planning',
                'message': 'Good morning! This is a great time to plan your day.',
                'action': 'Review your tasks and set priorities for the day',
                'priority': 'medium'
            })
        elif self.user_context.time_of_day == TimeOfDay.EVENING:
            insights.append({
                'type': 'reflection',
                'title': 'Evening Reflection',
                'message': 'Time to reflect on your day and prepare for tomorrow.',
                'action': 'Review completed tasks and plan for tomorrow',
                'priority': 'medium'
            })
        
        # Pattern-based insights
        if self.patterns:
            most_common_pattern = max(self.patterns.items(), key=lambda x: x[1]['frequency'])
            insights.append({
                'type': 'pattern',
                'title': 'Pattern Recognition',
                'message': f'You\'re most active during {most_common_pattern[0]} periods.',
                'action': 'Schedule important tasks during your peak times',
                'priority': 'low'
            })
        
        # Life metrics insights
        if self.life_metrics:
            overall_score = self._calculate_overall_score()
            if overall_score < 0.4:
                insights.append({
                    'type': 'wellness',
                    'title': 'Life Balance Alert',
                    'message': 'Your overall life satisfaction is below average. Consider focusing on self-care.',
                    'action': 'Take time for activities that bring you joy',
                    'priority': 'high'
                })
            elif overall_score > 0.8:
                insights.append({
                    'type': 'celebration',
                    'title': 'Life Balance Excellent',
                    'message': 'Your life balance is excellent! Keep up the great work.',
                    'action': 'Continue your current practices',
                    'priority': 'low'
                })
        
        # Store insights for analytics
        self.insights_history.extend(insights)
        
        return insights
    
    def get_analytics(self) -> Dict:
        """Get productivity and life analytics"""
        return {
            'productivity_metrics': {
                'daily_tasks_completed': self._calculate_daily_completion_rate(),
                'focus_time': self._calculate_focus_time(),
                'interruption_frequency': self._calculate_interruption_frequency(),
                'energy_efficiency': self._calculate_energy_efficiency()
            },
            'life_balance': {
                'work_life_ratio': self._calculate_work_life_ratio(),
                'health_trend': self._calculate_health_trend(),
                'learning_velocity': self._calculate_learning_velocity(),
                'relationship_quality': self._calculate_relationship_quality()
            },
            'patterns': {
                'peak_productivity_hours': self._identify_peak_hours(),
                'common_activities': self._identify_common_activities(),
                'energy_patterns': self._identify_energy_patterns(),
                'communication_preferences': self._identify_communication_patterns()
            },
            'recommendations': self._generate_recommendations()
        }
    
    def _calculate_daily_completion_rate(self) -> float:
        """Calculate daily task completion rate"""
        # This would be calculated from actual task data
        return 0.75  # Placeholder
    
    def _calculate_focus_time(self) -> int:
        """Calculate average daily focus time in minutes"""
        return 180  # Placeholder
    
    def _calculate_interruption_frequency(self) -> float:
        """Calculate interruptions per hour"""
        return 2.5  # Placeholder
    
    def _calculate_energy_efficiency(self) -> float:
        """Calculate energy efficiency score"""
        return 0.7  # Placeholder
    
    def _calculate_work_life_ratio(self) -> float:
        """Calculate work-life balance ratio"""
        return 0.6  # Placeholder
    
    def _calculate_health_trend(self) -> str:
        """Calculate health trend direction"""
        return "improving"  # Placeholder
    
    def _calculate_learning_velocity(self) -> float:
        """Calculate learning velocity"""
        return 0.6  # Placeholder
    
    def _calculate_relationship_quality(self) -> float:
        """Calculate relationship quality score"""
        return 0.7  # Placeholder
    
    def _identify_peak_hours(self) -> List[int]:
        """Identify peak productivity hours"""
        return [9, 10, 11, 14, 15]  # Placeholder
    
    def _identify_common_activities(self) -> List[str]:
        """Identify most common activities"""
        return ["email", "meetings", "coding", "planning"]  # Placeholder
    
    def _identify_energy_patterns(self) -> Dict:
        """Identify energy patterns throughout the day"""
        return {
            "morning": "high",
            "afternoon": "medium",
            "evening": "low"
        }
    
    def _identify_communication_patterns(self) -> Dict:
        """Identify communication preferences"""
        return {
            "email": 0.4,
            "slack": 0.3,
            "phone": 0.2,
            "in_person": 0.1
        }
    
    def _generate_recommendations(self) -> List[Dict]:
        """Generate personalized recommendations"""
        recommendations = []
        
        # Energy optimization
        if self.user_context.energy_level == EnergyLevel.LOW:
            recommendations.append({
                'category': 'energy',
                'title': 'Energy Boost',
                'description': 'Take a 10-minute walk or do some light stretching',
                'impact': 'high',
                'effort': 'low'
            })
        
        # Productivity optimization
        if self._calculate_daily_completion_rate() < 0.6:
            recommendations.append({
                'category': 'productivity',
                'title': 'Task Prioritization',
                'description': 'Use the Eisenhower Matrix to prioritize your tasks',
                'impact': 'high',
                'effort': 'medium'
            })
        
        # Life balance
        if self._calculate_work_life_ratio() > 0.8:
            recommendations.append({
                'category': 'balance',
                'title': 'Work-Life Balance',
                'description': 'Schedule dedicated personal time in your calendar',
                'impact': 'high',
                'effort': 'low'
            })
        
        return recommendations
    
    def update_life_metrics(self, category: str, metrics: Dict):
        """Update specific life metrics"""
        if not self.life_metrics:
            self.life_metrics = self._generate_default_life_metrics()
        
        if hasattr(self.life_metrics, category):
            current_metrics = getattr(self.life_metrics, category)
            current_metrics.update(metrics)
            setattr(self.life_metrics, category, current_metrics)
    
    def get_personalized_suggestions(self, context: str) -> List[str]:
        """Get personalized suggestions based on current context"""
        suggestions = []
        
        if context == "task_planning":
            if self.user_context.energy_level == EnergyLevel.HIGH:
                suggestions.append("Focus on your most challenging tasks now")
            else:
                suggestions.append("Start with quick, easy tasks to build momentum")
        
        elif context == "communication":
            if self.user_context.time_of_day == TimeOfDay.MORNING:
                suggestions.append("Send important emails now for better response rates")
            else:
                suggestions.append("Use Slack for quick updates, save emails for tomorrow")
        
        elif context == "break_planning":
            if self.user_context.stress_level > 0.7:
                suggestions.append("Take a longer break - try meditation or a walk")
            else:
                suggestions.append("A 5-minute break should be sufficient")
        
        return suggestions
