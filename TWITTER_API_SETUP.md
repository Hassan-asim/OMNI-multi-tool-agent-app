# Twitter API Setup Guide

## 🔑 How to Get Twitter API Keys

### Step 1: Create a Twitter Developer Account

1. **Go to Twitter Developer Portal**
   - Visit [developer.twitter.com](https://developer.twitter.com)
   - Click "Sign in" and log in with your Twitter account

2. **Apply for Developer Access**
   - Click "Apply for a developer account"
   - Choose "Making a bot" or "Academic research" (most common)
   - Fill out the application form:
     - **Use case**: "Building a personal assistant app for digital life management"
     - **App description**: "Omni Universal Assistant - A tool to help users manage their digital life by posting to multiple social media platforms and managing tasks"
     - **Will you make Twitter content available**: "No"
     - **Will you use Twitter data for surveillance**: "No"

3. **Wait for Approval**
   - Usually takes 1-3 business days
   - You'll receive an email when approved

### Step 2: Create a Twitter App

1. **Access Developer Dashboard**
   - Go to [developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
   - Click "Create App"

2. **Fill in App Details**
   - **App Name**: `Omni Universal Assistant`
   - **App Description**: `Universal personal assistant for digital life management and social media posting`
   - **Website URL**: `http://localhost:3000` (for development)
   - **Callback URL**: `http://localhost:3000/auth/twitter/callback`
   - **Organization**: Your name or company
   - **Organization Website**: Your website (optional)

3. **Configure App Settings**
   - Go to your app's "Settings" tab
   - Enable "Read and Write" permissions
   - Add callback URLs if needed

### Step 3: Generate API Keys

1. **Go to Keys and Tokens Tab**
   - In your app dashboard, click "Keys and Tokens"

2. **Generate API Key and Secret**
   - Click "Generate" under "Consumer Keys"
   - Copy the **API Key** and **API Secret**

3. **Generate Access Token and Secret**
   - Scroll down to "Access Token and Secret"
   - Click "Generate"
   - Copy the **Access Token** and **Access Token Secret**

### Step 4: Add Keys to Your App

1. **Update Environment File**
   ```bash
   # Add to backend/.env
   TWITTER_API_KEY=your_api_key_here
   TWITTER_API_SECRET=your_api_secret_here
   TWITTER_ACCESS_TOKEN=your_access_token_here
   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here
   ```

2. **Update Frontend Environment**
   ```bash
   # Add to src/.env
   REACT_APP_TWITTER_API_KEY=your_api_key_here
   ```

### Step 5: Test Your Integration

1. **Run the Test Script**
   ```bash
   python test_ai_models.py
   ```

2. **Test Social Media Posting**
   - Start your app: `python start_dev.py`
   - Go to Social Media page
   - Try posting to Twitter

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Double-check your API keys are correct
   - Ensure you've enabled "Read and Write" permissions

2. **"Callback URL Mismatch" Error**
   - Add `http://localhost:3000` to your app's callback URLs
   - For production, add your actual domain

3. **"App Not Authorized" Error**
   - Make sure your app has the correct permissions
   - Check that you're using the right environment (development vs production)

### Rate Limits

- **Tweet Creation**: 300 tweets per 15-minute window
- **User Lookup**: 75 requests per 15-minute window
- **Timeline**: 75 requests per 15-minute window

## 📱 Production Deployment

### For Production Use

1. **Update Callback URLs**
   - Change from `localhost:3000` to your actual domain
   - Example: `https://yourdomain.com/auth/twitter/callback`

2. **Environment Variables**
   - Use your production environment variables
   - Never commit API keys to version control

3. **App Permissions**
   - Review and update app permissions as needed
   - Consider requesting elevated access for higher rate limits

## 🔒 Security Best Practices

1. **Never Commit Keys**
   - Add `.env` files to `.gitignore`
   - Use environment variables in production

2. **Rotate Keys Regularly**
   - Regenerate API keys periodically
   - Update your app with new keys

3. **Monitor Usage**
   - Check your app's usage in the Twitter Developer Dashboard
   - Set up alerts for unusual activity

## 📚 Additional Resources

- [Twitter API Documentation](https://developer.twitter.com/en/docs)
- [Twitter API v2 Guide](https://developer.twitter.com/en/docs/twitter-api)
- [Rate Limits Reference](https://developer.twitter.com/en/docs/twitter-api/rate-limits)
- [Authentication Guide](https://developer.twitter.com/en/docs/authentication/overview)

## 🆘 Need Help?

If you encounter issues:

1. Check the [Twitter Developer Forums](https://twittercommunity.com/)
2. Review the [API Status Page](https://api.twitterstat.us/)
3. Contact Twitter Developer Support through your dashboard

---

**Note**: Twitter API access is free for basic usage. For high-volume applications, you may need to apply for elevated access or consider Twitter's paid tiers.
