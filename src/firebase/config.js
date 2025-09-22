import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBnVu5BDJqxIlpKtQxqRI4RCQ5VFiJxX9k",
  authDomain: "multi-tool-agent-7208a.firebaseapp.com",
  projectId: "multi-tool-agent-7208a",
  storageBucket: "multi-tool-agent-7208a.firebasestorage.app",
  messagingSenderId: "680606737140",
  appId: "1:680606737140:web:0f429a2e2837a3f257b4a1",
  measurementId: "G-YP67VWBZT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);


export default app;
