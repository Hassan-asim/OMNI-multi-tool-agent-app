// GLM primary with GROQ fallback
import axios from 'axios';

const GLM_API_URL = process.env.REACT_APP_GLM_API_URL;
const GLM_API_KEY = process.env.REACT_APP_GLM_API_KEY;
const GROQ_API_URL = process.env.REACT_APP_GROQ_API_URL;
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

async function callGLM(prompt) {
  if (!GLM_API_URL || !GLM_API_KEY) throw new Error('GLM not configured');
  const res = await axios.post(GLM_API_URL, { prompt }, { headers: { Authorization: `Bearer ${GLM_API_KEY}` } });
  return res.data;
}

async function callGROQ(prompt) {
  if (!GROQ_API_URL || !GROQ_API_KEY) throw new Error('GROQ not configured');
  const res = await axios.post(GROQ_API_URL, { prompt }, { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } });
  return res.data;
}

export async function generateText(prompt) {
  try {
    return await callGLM(prompt);
  } catch (e) {
    try {
      return await callGROQ(prompt);
    } catch (e2) {
      return { error: 'All AI providers failed' };
    }
  }
}


