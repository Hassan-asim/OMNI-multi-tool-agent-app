// Firestore Service - Handles all Firestore operations
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase/config';

class FirestoreService {
  constructor() {
    this.db = db;
  }

  // Tasks
  async createTask(userId, taskData) {
    try {
      const task = {
        ...taskData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false
      };
      
      const docRef = await addDoc(collection(this.db, 'tasks'), task);
      return { success: true, taskId: docRef.id };
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, error: error.message };
    }
  }

  async updateTask(taskId, updates) {
    try {
      await updateDoc(doc(this.db, 'tasks', taskId), {
        ...updates,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteTask(taskId) {
    try {
      await deleteDoc(doc(this.db, 'tasks', taskId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserTasks(userId) {
    try {
      const q = query(
        collection(this.db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, tasks };
    } catch (error) {
      console.error('Error getting tasks:', error);
      return { success: false, error: error.message };
    }
  }

  // Messages
  async createMessage(userId, messageData) {
    try {
      const message = {
        ...messageData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        unread: true
      };
      
      const docRef = await addDoc(collection(this.db, 'messages'), message);
      return { success: true, messageId: docRef.id };
    } catch (error) {
      console.error('Error creating message:', error);
      return { success: false, error: error.message };
    }
  }

  async updateMessage(messageId, updates) {
    try {
      await updateDoc(doc(this.db, 'messages', messageId), {
        ...updates,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating message:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserMessages(userId) {
    try {
      const q = query(
        collection(this.db, 'messages'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, messages };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time listeners
  subscribeToUserTasks(userId, callback) {
    const q = query(
      collection(this.db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      callback(tasks);
    });
  }

  subscribeToUserMessages(userId, callback) {
    const q = query(
      collection(this.db, 'messages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    });
  }

  // Trip Plans
  async createTripPlan(userId, tripPlan) {
    try {
      const payload = {
        ...tripPlan,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: tripPlan.status || 'proposed'
      };
      const docRef = await addDoc(collection(this.db, 'trip_plans'), payload);
      return { success: true, planId: docRef.id };
    } catch (error) {
      console.error('Error creating trip plan:', error);
      return { success: false, error: error.message };
    }
  }

  // Finance Profiles
  async createFinanceProfile(userId, profile) {
    try {
      const payload = {
        ...profile,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(collection(this.db, 'finance_profiles'), payload);
      return { success: true, profileId: docRef.id };
    } catch (error) {
      console.error('Error creating finance profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Calendar Events
  async createCalendarEvent(userId, event) {
    try {
      const payload = {
        ...event,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(collection(this.db, 'calendar_events'), payload);
      return { success: true, eventId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async listCalendarEvents(userId) {
    try {
      const q = query(
        collection(this.db, 'calendar_events'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const events = [];
      snap.forEach(d => events.push({ id: d.id, ...d.data() }));
      return { success: true, events };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteCalendarEvent(eventId) {
    try {
      await deleteDoc(doc(this.db, 'calendar_events', eventId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

const firestoreService = new FirestoreService();
export default firestoreService;
