// Social Media Service - Handles all social media operations
import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class SocialMediaService {
  constructor() {
    this.supportedPlatforms = [
      { id: 'facebook', name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
      { id: 'twitter', name: 'Twitter', icon: 'Twitter', color: '#1DA1F2' },
      { id: 'instagram', name: 'Instagram', icon: 'Instagram', color: '#E4405F' },
      { id: 'linkedin', name: 'LinkedIn', icon: 'LinkedIn', color: '#0077B5' },
      { id: 'tiktok', name: 'TikTok', icon: 'VideoLibrary', color: '#000000' },
      // Removed YouTube and Pinterest per user request
    ];
  }

  // Get supported platforms
  getSupportedPlatforms() {
    return this.supportedPlatforms;
  }

  // Connect social media account
  async connectAccount(userId, platform, credentials) {
    try {
      const accountData = {
        userId,
        platform,
        username: credentials.username || '',
        accessToken: credentials.accessToken || '',
        refreshToken: credentials.refreshToken || '',
        expiresAt: credentials.expiresAt || null,
        apiKey: credentials.apiKey || '',
        apiSecret: credentials.apiSecret || '',
        connectedAt: new Date(),
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'social_accounts'), accountData);
      console.log('Social account connected:', docRef.id);
      return { success: true, accountId: docRef.id };
    } catch (error) {
      console.error('Error connecting social account:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's connected accounts
  async getConnectedAccounts(userId) {
    try {
      const q = query(
        collection(db, 'social_accounts'),
        where('userId', '==', userId),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      
      const accounts = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        accounts[data.platform] = { id: doc.id, ...data };
      });
      
      return { success: true, accounts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Disconnect account
  async disconnectAccount(accountId) {
    try {
      await updateDoc(doc(db, 'social_accounts', accountId), {
        status: 'disconnected',
        disconnectedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create a post
  async createPost(userId, postData) {
    try {
      const post = {
        userId,
        content: postData.content,
        platforms: postData.platforms || [],
        media: postData.media || [],
        scheduledAt: postData.scheduledAt || null,
        status: postData.scheduledAt ? 'scheduled' : 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        analytics: {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0
        }
      };

      const docRef = await addDoc(collection(db, 'posts'), post);
      return { success: true, postId: docRef.id };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's posts
  async getUserPosts(userId, limit = 50) {
    try {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      const querySnapshot = await getDocs(q);
      
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, posts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Publish post to selected platforms
  async publishPost(postId, platforms) {
    try {
      // Call backend proxy which uses env credentials to talk to providers
      const res = await axios.post(`${BACKEND_URL}/social/publish`, { postId, platforms });
      return { success: true, results: res.data.results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Generate post content using AI
  async generatePostContent(prompt, platform, tone = 'professional') {
    try {
      // This would call the AI service to generate content
      // For now, we'll return mock content
      const templates = {
        facebook: `📱 ${prompt}\n\n#SocialMedia #Update #Life`,
        twitter: `${prompt}\n\n#Update #Life #Social`,
        instagram: `✨ ${prompt}\n\n#Life #Update #Motivation`,
        linkedin: `Professional Update: ${prompt}\n\n#Professional #Career #Growth`,
        youtube: `🎥 New Update: ${prompt}\n\nDon't forget to like and subscribe!`,
        tiktok: `🎵 ${prompt} #fyp #viral #trending`,
        pinterest: `📌 ${prompt}\n\n#Inspiration #Life #Motivation`
      };

      const content = templates[platform] || `${prompt}\n\n#Update #Life`;
      
      return { success: true, content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get hashtag suggestions
  getHashtagSuggestions(content) {
    const commonHashtags = [
      '#life', '#motivation', '#inspiration', '#success', '#growth',
      '#work', '#career', '#business', '#entrepreneur', '#productivity',
      '#health', '#fitness', '#wellness', '#mindfulness', '#selfcare',
      '#technology', '#innovation', '#digital', '#future', '#trending'
    ];

    // Simple keyword extraction and hashtag suggestion
    const words = content.toLowerCase().split(/\s+/);
    const suggestions = commonHashtags.filter(tag => 
      words.some(word => tag.toLowerCase().includes(word))
    );

    return suggestions.slice(0, 5);
  }

  // Get post templates
  getPostTemplates() {
    return [
      {
        id: 'announcement',
        name: 'Announcement',
        template: '🎉 Exciting news! {content}\n\n#Announcement #Update #Exciting'
      },
      {
        id: 'question',
        name: 'Question',
        template: '❓ {content}\n\nWhat are your thoughts? #Question #Discussion #Community'
      },
      {
        id: 'tip',
        name: 'Tip/Advice',
        template: '💡 Pro tip: {content}\n\n#Tip #Advice #Helpful #Knowledge'
      },
      {
        id: 'personal',
        name: 'Personal Update',
        template: '👋 {content}\n\n#Personal #Update #Life #Sharing'
      },
      {
        id: 'promotional',
        name: 'Promotional',
        template: '🚀 {content}\n\n#Promotion #Business #Opportunity #Growth'
      }
    ];
  }
}

const socialMediaService = new SocialMediaService();
export default socialMediaService;
