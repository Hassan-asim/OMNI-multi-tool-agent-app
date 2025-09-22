# Vercel Deployment Guide for Omni Universal Assistant

## 🚀 Quick Deployment

### 1. Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub account
- API keys for GLM and GROQ

### 2. Environment Variables
Set these in your Vercel dashboard under Project Settings > Environment Variables:

```bash
# AI Model Configuration
GLM_API_KEY=your_glm_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Firebase Configuration (if using Firebase)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Social Media API Keys (optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

### 3. Deploy to Vercel

#### Option A: Deploy from GitHub
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a React app
6. Add your environment variables
7. Click "Deploy"

#### Option B: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add GLM_API_KEY
vercel env add GROQ_API_KEY
# ... add other variables

# Redeploy with new environment variables
vercel --prod
```

## 📁 Project Structure for Vercel

```
omni-universal-assistant/
├── api/                          # Vercel API routes
│   ├── health.py                 # Health check endpoint
│   ├── chat.py                   # Main chat API
│   ├── intelligent-chat.py       # Intelligent chat API
│   ├── simple_ai_models.py       # Simplified AI models
│   ├── simple_omni_agent.py      # Simplified Omni agent
│   └── requirements.txt          # Python dependencies
├── src/                          # React frontend
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── firebase/                 # Firebase configuration
│   ├── store/                    # State management
│   ├── App.js                    # Main app component
│   └── index.js                  # Entry point
├── public/                       # Static assets
├── package.json                  # Node.js dependencies
├── vercel.json                   # Vercel configuration
├── .vercelignore                 # Files to ignore
└── README.md                     # Documentation
```

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "api/**/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "/api"
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all dependencies are in package.json
   - Ensure all imports are correct
   - Check for TypeScript errors

2. **API Routes Not Working**
   - Verify Python dependencies in api/requirements.txt
   - Check that environment variables are set
   - Ensure proper CORS headers

3. **Environment Variables Not Loading**
   - Make sure variables are set in Vercel dashboard
   - Redeploy after adding new variables
   - Check variable names match exactly

4. **AI Models Not Working**
   - Verify API keys are correct
   - Check API quotas and limits
   - Test API keys independently

### Debug Steps

1. **Check Vercel Function Logs**
   ```bash
   vercel logs
   ```

2. **Test API Endpoints**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

3. **Check Build Logs**
   - Go to Vercel dashboard
   - Click on your project
   - Check "Functions" tab for errors

## 📊 Performance Optimization

### Frontend
- ✅ Code splitting with React.lazy()
- ✅ Optimized bundle size
- ✅ Static asset optimization
- ✅ CDN delivery via Vercel

### Backend
- ✅ Serverless functions for scalability
- ✅ Lightweight Python dependencies
- ✅ Efficient API responses
- ✅ Caching strategies

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit API keys to Git
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **API Security**
   - Implement rate limiting
   - Add authentication if needed
   - Validate all inputs

3. **CORS Configuration**
   - Configure allowed origins
   - Limit to your domain in production

## 📈 Monitoring

### Vercel Analytics
- Built-in performance monitoring
- Real-time error tracking
- Usage analytics

### Custom Monitoring
- Add logging to API functions
- Monitor API response times
- Track error rates

## 🚀 Production Checklist

- [ ] All environment variables set
- [ ] API keys tested and working
- [ ] Build completes successfully
- [ ] All routes accessible
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Monitoring configured

## 📞 Support

If you encounter issues:
1. Check Vercel documentation
2. Review function logs
3. Test locally first
4. Check GitHub issues
5. Contact Vercel support

---

**Note**: This deployment uses Vercel's serverless functions for the backend, which provides excellent scalability and performance for the Omni Universal Assistant.
