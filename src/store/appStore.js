import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiService from '../services/apiService';
import firestoreService from '../services/firestoreService';

const useAppStore = create(
  persist(
    (set, get) => ({
      // App State
      isInitialized: false,
      isLoading: false,
      error: null,
      theme: 'light',
      
      // User Context
      userContext: {
        current_time: new Date().toISOString(),
        time_of_day: 'morning',
        energy_level: 'medium',
        location: 'Unknown',
        current_focus: 'General',
        recent_activity: 'None',
      },
      
      // Chat State
      chatHistory: [],
      isTyping: false,
      
      // Tasks
      tasks: [],
      completedTasks: [],
      
      // Messages
      messages: [],
      unreadCount: 0,
      
      // Social Media
      socialPosts: [],
      connectedPlatforms: [],
      
      // Automations
      automations: [],
      
      // Life Metrics
      lifeMetrics: {
        overall_score: 0,
        health: { score: 0, trends: [] },
        finance: { score: 0, trends: [] },
        learning: { score: 0, trends: [] },
        habits: { score: 0, trends: [] },
      },
      
      // Dashboard Data
      dashboardData: {
        life_metrics: {
          overall_score: 0.75,
          health: {
            sleep_hours: 0.8,
            exercise_minutes: 0.6,
            water_intake: 0.9,
            stress_level: 0.4
          },
          finance: {
            savings_rate: 0.7,
            budget_adherence: 0.8,
            investment_growth: 0.6
          },
          learning: {
            daily_reading: 0.5,
            skill_development: 0.7,
            course_progress: 0.6
          },
          habits: {
            morning_routine: 0.8,
            meditation: 0.6,
            journaling: 0.4
          },
          relationships: {
            family_time: 0.7,
            social_connections: 0.6,
            communication: 0.8
          },
          career: {
            productivity: 0.8,
            skill_growth: 0.7,
            work_life_balance: 0.6
          },
          personal_growth: {
            goal_achievement: 0.7,
            self_reflection: 0.6,
            creativity: 0.5
          }
        },
        automations: [
          {
            id: 1,
            name: 'Morning Routine',
            description: 'Automated morning routine with weather check and task planning',
            enabled: true,
            trigger_type: 'time_based',
            actions_count: 3,
            run_count: 45,
            success_rate: 0.95,
            last_run: '2024-01-15T08:00:00Z'
          },
          {
            id: 2,
            name: 'Social Media Post',
            description: 'Weekly motivational post to LinkedIn',
            enabled: true,
            trigger_type: 'time_based',
            actions_count: 1,
            run_count: 12,
            success_rate: 0.92,
            last_run: '2024-01-14T10:00:00Z'
          },
          {
            id: 3,
            name: 'Health Reminder',
            description: 'Remind to take breaks and drink water',
            enabled: false,
            trigger_type: 'time_based',
            actions_count: 2,
            run_count: 0,
            success_rate: 0,
            last_run: null
          }
        ]
      },
      
      // Actions
      initializeApp: async () => {
        set({ isLoading: true });
        try {
          // Simulate initialization
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isInitialized: true, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Chat Actions
      addChatMessage: (message) => {
        set(state => ({
          chatHistory: [...state.chatHistory, message]
        }));
      },
      
      sendChatMessage: async (message) => {
        set({ isTyping: true });
        
        // Add user message immediately
        const userMessage = {
          id: Date.now(),
          type: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        };
        
        set(state => ({
          chatHistory: [...state.chatHistory, userMessage]
        }));
        
        try {
          // Try the intelligent chat endpoint first
          const response = await apiService.intelligentChat(
            message,
            get().userContext,
            'default'
          );
          
          if (response.success) {
            const aiMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: response.data.response,
              timestamp: new Date().toISOString(),
              intent: response.data.intent,
              confidence: response.data.confidence,
              actions_taken: response.data.actions_taken || [],
              suggestions: response.data.suggestions || [],
            };
            
            set(state => ({
              chatHistory: [...state.chatHistory, aiMessage],
              isTyping: false
            }));
          }
        } catch (error) {
          console.error('Error sending message:', error);
          
          // Fallback to simple response
          const fallbackMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: `I understand you said: "${message}". I'm here to help you manage your digital life. What would you like me to help you with?`,
            timestamp: new Date().toISOString(),
            suggestions: [
              'Create a new task',
              'Schedule a meeting', 
              'Post to social media',
              'Check my schedule',
              'Help with organization'
            ]
          };
          
          set(state => ({
            chatHistory: [...state.chatHistory, fallbackMessage],
            isTyping: false
          }));
        }
      },
      
      // Theme Actions
      setTheme: (theme) => set({ theme }),
      
      // Message Actions
      addMessage: async (message) => {
        const newMessage = {
          ...message,
          timestamp: new Date().toISOString(),
          unread: true
        };
        
        // Add to local state immediately
        set(state => ({
          messages: [...state.messages, { ...newMessage, id: Date.now() }]
        }));
        
        // Save to Firestore
        try {
          const result = await firestoreService.createMessage('current-user', newMessage);
          if (result.success) {
            console.log('Message saved to Firestore:', result.messageId);
          }
        } catch (error) {
          console.error('Error saving message to Firestore:', error);
        }
      },
      
      markMessageAsRead: (messageId) => {
        set(state => ({
          messages: state.messages.map(msg => 
            msg.id === messageId 
              ? { ...msg, unread: false }
              : msg
          )
        }));
      },
      
      // Task Actions
      addTask: async (task) => {
        const newTask = {
          ...task,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add to local state immediately
        set(state => ({
          tasks: [...state.tasks, { ...newTask, id: Date.now() }]
        }));
        
        // Save to Firestore
        try {
          const result = await firestoreService.createTask('current-user', newTask);
          if (result.success) {
            console.log('Task saved to Firestore:', result.taskId);
          }
        } catch (error) {
          console.error('Error saving task to Firestore:', error);
        }
      },
      
      updateTask: (taskId, updates) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          )
        }));
      },
      
      deleteTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== taskId)
        }));
      },
      
      toggleTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
              : task
          )
        }));
      },
      
      completeTask: (taskId) => {
        set(state => {
          const task = state.tasks.find(t => t.id === taskId);
          if (task) {
            return {
              tasks: state.tasks.filter(t => t.id !== taskId),
              completedTasks: [...state.completedTasks, { ...task, completedAt: new Date().toISOString() }]
            };
          }
          return state;
        });
      },
      
      markAsRead: (messageId) => {
        set(state => ({
          messages: state.messages.map(m => 
            m.id === messageId ? { ...m, read: true } : m
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },
      
      // Social Media Actions
      addSocialPost: (post) => {
        set(state => ({
          socialPosts: [...state.socialPosts, { ...post, id: Date.now() }]
        }));
      },
      
      connectPlatform: (platform) => {
        set(state => ({
          connectedPlatforms: [...state.connectedPlatforms, platform]
        }));
      },
      
      // Life Metrics Actions
      updateLifeMetrics: (metrics) => {
        set(state => ({
          lifeMetrics: { ...state.lifeMetrics, ...metrics }
        }));
      },
      
      // Automation Actions
      createAutomation: async (automation) => {
        const newAutomation = {
          ...automation,
          id: Date.now(),
          enabled: true,
          actions_count: automation.actions?.length || 0,
          run_count: 0,
          success_rate: 0,
          last_run: null,
          created_at: new Date().toISOString()
        };
        
        set(state => ({
          dashboardData: {
            ...state.dashboardData,
            automations: [...state.dashboardData.automations, newAutomation]
          }
        }));
        
        return { success: true, automation: newAutomation };
      },
      
      // Utility Actions
      clearError: () => set({ error: null }),
      resetApp: () => set({
        isInitialized: false,
        chatHistory: [],
        tasks: [],
        completedTasks: [],
        messages: [],
        unreadCount: 0,
        socialPosts: [],
        connectedPlatforms: [],
        lifeMetrics: {
          health: { score: 0, trends: [] },
          finance: { score: 0, trends: [] },
          learning: { score: 0, trends: [] },
          habits: { score: 0, trends: [] },
        },
      }),
    }),
    {
      name: 'omni-app-store',
      partialize: (state) => ({
        userContext: state.userContext,
        tasks: state.tasks,
        completedTasks: state.completedTasks,
        messages: state.messages,
        socialPosts: state.socialPosts,
        connectedPlatforms: state.connectedPlatforms,
        lifeMetrics: state.lifeMetrics,
      }),
    }
  )
);

export { useAppStore };