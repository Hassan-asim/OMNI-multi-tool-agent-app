// API Service - Handles all backend API calls
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Chat with Omni
  async chatWithOmni(message, context = {}, sessionId = 'default') {
    try {
      const response = await this.client.post('/chat', {
        message,
        context,
        session_id: sessionId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Intelligent chat
  async intelligentChat(message, context = {}, sessionId = 'default') {
    try {
      const response = await this.client.post('/intelligent-chat', {
        message,
        context,
        session_id: sessionId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Task management
  async createTask(taskData) {
    try {
      const response = await this.client.post('/tasks', taskData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateTask(taskId, updates) {
    try {
      const response = await this.client.put(`/tasks/${taskId}`, updates);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteTask(taskId) {
    try {
      const response = await this.client.delete(`/tasks/${taskId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTasks() {
    try {
      const response = await this.client.get('/tasks');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Social media management
  async createPost(postData) {
    try {
      const response = await this.client.post('/posts', postData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async publishPost(postId, platforms) {
    try {
      const response = await this.client.post(`/posts/${postId}/publish`, {
        platforms,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPosts() {
    try {
      const response = await this.client.get('/posts');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Analytics
  async getAnalytics(timeRange = '7d') {
    try {
      const response = await this.client.get(`/analytics?range=${timeRange}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Automation
  async createAutomation(automationData) {
    try {
      const response = await this.client.post('/automations', automationData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAutomations() {
    try {
      const response = await this.client.get('/automations');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // AI content generation
  async generateContent(prompt, platform, tone = 'professional') {
    try {
      const response = await this.client.post('/ai/generate-content', {
        prompt,
        platform,
        tone,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Weather information
  async getWeather(location) {
    try {
      const response = await this.client.get(`/weather?location=${location}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search information
  async searchInformation(query) {
    try {
      const response = await this.client.post('/search', { query });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

const apiService = new ApiService();
export default apiService;
