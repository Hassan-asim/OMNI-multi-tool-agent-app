import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// Social media post management
export const createPost = async (uid, postData) => {
  try {
    const post = {
      ...postData,
      userId: uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft', // draft, scheduled, published, failed
      platforms: postData.platforms || [],
      analytics: {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
      },
    };
    
    const docRef = await addDoc(collection(db, 'posts'), post);
    return { success: true, postId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updatePost = async (postId, updates) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserPosts = async (uid, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, posts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getScheduledPosts = async (uid) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', uid),
      where('status', '==', 'scheduled'),
      orderBy('scheduledAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, posts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Image upload for posts
export const uploadPostImage = async (uid, file, postId) => {
  try {
    const fileName = `posts/${uid}/${postId}/${file.name}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Social media analytics
export const updatePostAnalytics = async (postId, platform, analytics) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const currentAnalytics = postData.analytics || {};
      
      await updateDoc(postRef, {
        analytics: {
          ...currentAnalytics,
          [platform]: {
            ...currentAnalytics[platform],
            ...analytics,
            lastUpdated: new Date(),
          },
        },
      });
      
      return { success: true };
    }
    return { success: false, error: 'Post not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Social media platform configurations
export const getSupportedPlatforms = () => {
  return [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      maxCharacters: 63206,
      supportsImages: true,
      supportsVideos: true,
      supportsLinks: true,
      supportsHashtags: true,
      supportsMentions: true,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      color: '#1DA1F2',
      maxCharacters: 280,
      supportsImages: true,
      supportsVideos: true,
      supportsLinks: true,
      supportsHashtags: true,
      supportsMentions: true,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: '#E4405F',
      maxCharacters: 2200,
      supportsImages: true,
      supportsVideos: true,
      supportsLinks: false,
      supportsHashtags: true,
      supportsMentions: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: '#0077B5',
      maxCharacters: 3000,
      supportsImages: true,
      supportsVideos: true,
      supportsLinks: true,
      supportsHashtags: true,
      supportsMentions: true,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '📺',
      color: '#FF0000',
      maxCharacters: 5000,
      supportsImages: false,
      supportsVideos: true,
      supportsLinks: true,
      supportsHashtags: true,
      supportsMentions: false,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      color: '#000000',
      maxCharacters: 2200,
      supportsImages: false,
      supportsVideos: true,
      supportsLinks: false,
      supportsHashtags: true,
      supportsMentions: true,
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: '📌',
      color: '#BD081C',
      maxCharacters: 500,
      supportsImages: true,
      supportsVideos: true,
      supportsLinks: true,
      supportsHashtags: true,
      supportsMentions: false,
    },
  ];
};

// Post templates
export const getPostTemplates = () => {
  return [
    {
      id: 'announcement',
      name: 'Product Announcement',
      template: '🚀 Exciting news! We\'re thrilled to announce {product_name}. {description} #announcement #product #innovation',
      platforms: ['twitter', 'linkedin', 'facebook'],
    },
    {
      id: 'tip',
      name: 'Helpful Tip',
      template: '💡 Pro tip: {tip_content}. This simple trick can {benefit}. What\'s your favorite tip? #tips #productivity #lifehack',
      platforms: ['twitter', 'linkedin', 'facebook', 'instagram'],
    },
    {
      id: 'question',
      name: 'Engagement Question',
      template: '❓ Quick question: {question}? Share your thoughts in the comments below! #discussion #community #engagement',
      platforms: ['twitter', 'linkedin', 'facebook', 'instagram'],
    },
    {
      id: 'behind_scenes',
      name: 'Behind the Scenes',
      template: '🎬 Behind the scenes: {content}. It\'s amazing to see {insight}! #behindthescenes #team #process',
      platforms: ['instagram', 'linkedin', 'facebook'],
    },
    {
      id: 'quote',
      name: 'Inspirational Quote',
      template: '"{quote}" - {author}\n\n{personal_thought} #inspiration #motivation #quote',
      platforms: ['instagram', 'linkedin', 'facebook', 'twitter'],
    },
  ];
};

// Hashtag suggestions
export const getHashtagSuggestions = (content, platform) => {
  const hashtags = {
    general: ['#motivation', '#inspiration', '#success', '#growth', '#mindset'],
    business: ['#business', '#entrepreneur', '#startup', '#leadership', '#innovation'],
    tech: ['#technology', '#innovation', '#digital', '#future', '#ai'],
    lifestyle: ['#lifestyle', '#wellness', '#health', '#fitness', '#mindfulness'],
    social: ['#community', '#connection', '#networking', '#collaboration', '#teamwork'],
  };
  
  // Simple keyword matching for hashtag suggestions
  const contentLower = content.toLowerCase();
  const suggestions = [];
  
  Object.entries(hashtags).forEach(([category, tags]) => {
    if (contentLower.includes(category) || contentLower.includes(category.slice(0, -1))) {
      suggestions.push(...tags);
    }
  });
  
  // Add platform-specific hashtags
  if (platform === 'instagram') {
    suggestions.push('#instagood', '#photooftheday', '#instadaily');
  } else if (platform === 'twitter') {
    suggestions.push('#trending', '#viral', '#news');
  } else if (platform === 'linkedin') {
    suggestions.push('#professional', '#career', '#networking');
  }
  
  return [...new Set(suggestions)].slice(0, 10); // Remove duplicates and limit to 10
};
