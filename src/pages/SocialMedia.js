import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  PostAdd as PostAddIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  VideoLibrary as TikTokIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Link as LinkIcon,
  EmojiEmotions as EmojiIcon,
  TrendingUp as TrendingIcon,
  AutoAwesome as AutoAwesomeIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../components/Auth/AuthProvider';
import socialMediaService from '../services/socialMediaService';
// Removed unused legacy firebase imports that caused runtime errors

const SocialMedia = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [connectAccountOpen, setConnectAccountOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [credentials, setCredentials] = useState({
    platform: '',
    username: '',
    password: '',
  });
  const [postContent, setPostContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [postType, setPostType] = useState('text');

  const platforms = socialMediaService.getSupportedPlatforms();
  const templates = socialMediaService.getPostTemplates();
  const [connectedAccounts, setConnectedAccounts] = useState({});
  const [posts, setPosts] = useState([]);

  // Loaders defined before effects to avoid TDZ issues
  const loadConnectedAccounts = useCallback(async () => {
    if (!user) return;
    const result = await socialMediaService.getConnectedAccounts(user.uid);
    if (result.success) {
      setConnectedAccounts(result.accounts);
    }
  }, [user]);

  const loadPosts = useCallback(async () => {
    if (!user) return;
    const result = await socialMediaService.getUserPosts(user.uid);
    if (result.success) {
      setPosts(result.posts);
    }
  }, [user]);

  useEffect(() => {
    loadConnectedAccounts();
    loadPosts();
  }, [user, loadConnectedAccounts, loadPosts]);

  useEffect(() => {
    if (postContent) {
      const suggestions = socialMediaService.getHashtagSuggestions(postContent);
      setHashtagSuggestions(suggestions);
    }
  }, [postContent]);

  // (moved loaders above)

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      setError('Please enter post content');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postData = {
        content: postContent,
        platforms: selectedPlatforms,
        scheduledAt: scheduledTime ? new Date(scheduledTime) : null,
        template: selectedTemplate,
        status: scheduledTime ? 'scheduled' : 'draft',
      };

      const result = await socialMediaService.createPost(user.uid, postData);
      
      if (result.success) {
        setSuccess('Post created successfully!');
        setPostContent('');
        setSelectedPlatforms([]);
        setScheduledTime('');
        setSelectedTemplate('');
        setCreatePostOpen(false);
        
        // Reload posts
        // Optionally publish immediately if no schedule
        if (!postData.scheduledAt) {
          try {
            const pub = await socialMediaService.publishPost(result.postId || result.data?.postId, selectedPlatforms);
            if (!pub.success) {
              console.warn('Publish failed', pub.error);
            }
          } catch (e) {
            console.warn('Publish error', e);
          }
        }
        await loadPosts();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create post');
    }

    setLoading(false);
  };

  const handleConnectAccount = async (platform) => {
    setLoading(true);
    
    try {
      const accountData = {
        username: credentials.username,
        password: credentials.password,
      };

      const result = await socialMediaService.connectAccount(user.uid, platform, accountData);
      
      if (result.success) {
        setSuccess(`Connected to ${platform} successfully!`);
        setConnectAccountOpen(false);
        setCredentials({ platform: '', username: '', password: '' });
        await loadConnectedAccounts();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to connect account');
    }

    setLoading(false);
  };

  const handleDisconnectAccount = async (platform) => {
    setLoading(true);
    
    try {
      const account = connectedAccounts[platform];
      if (account) {
        const result = await socialMediaService.disconnectAccount(account.id);
        
        if (result.success) {
          setSuccess(`Disconnected from ${platform} successfully!`);
          await loadConnectedAccounts();
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('Failed to disconnect account');
    }

    setLoading(false);
  };

  const handleGenerateContent = async () => {
    if (!postContent.trim()) {
      setError('Please enter a prompt for content generation');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await socialMediaService.generatePostContent(
        postContent, 
        selectedPlatforms[0] || 'facebook',
        'professional'
      );
      
      if (result.success) {
        setPostContent(result.content);
        setSuccess('Content generated successfully!');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to generate content');
    }

    setLoading(false);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length !== files.length) {
      setError('Please select only image or video files');
      return;
    }

    setSelectedFiles(validFiles);
    
    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const getPlatformIcon = (platformId) => {
    const icons = {
      facebook: <FacebookIcon />,
      twitter: <TwitterIcon />,
      instagram: <InstagramIcon />,
      linkedin: <LinkedInIcon />,
      tiktok: <TikTokIcon />,
    };
    return icons[platformId] || <PostAddIcon />;
  };

  const getPlatformColor = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.color || '#666';
  };

  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Social Media Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all your social media accounts from one place
        </Typography>
        
        {/* Quick Action Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<VideoIcon />}
              label="Create Video Post"
              color="primary"
              variant="outlined"
              clickable
              onClick={() => {
                setPostType('video');
                setActiveTab(0);
              }}
            />
            <Chip
              icon={<LinkIcon />}
              label="Share Link"
              color="secondary"
              variant="outlined"
              clickable
              onClick={() => {
                setPostType('link');
                setActiveTab(0);
              }}
            />
            <Chip
              icon={<TrendingIcon />}
              label="View Analytics"
              color="info"
              variant="outlined"
              clickable
              onClick={() => setActiveTab(2)}
            />
            <Chip
              icon={<AnalyticsIcon />}
              label="Performance"
              color="success"
              variant="outlined"
              clickable
              onClick={() => setActiveTab(2)}
            />
          </Box>
        </motion.div>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Create Post" />
          <Tab label="Scheduled Posts" />
          <Tab label="Analytics" />
          <Tab label="Account Settings" />
        </Tabs>
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Create Post Card */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Create New Post
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PostAddIcon />}
                    onClick={() => setCreatePostOpen(true)}
                  >
                    Create Post
                  </Button>
                </Box>

                {/* Quick Post Form */}
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="What's on your mind? Share it with your audience..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                {/* AI Content Generation */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={handleGenerateContent}
                    disabled={loading || !postContent.trim()}
                    size="small"
                  >
                    Generate with AI
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<EmojiIcon />}
                    onClick={() => setPostContent(postContent + ' 😊')}
                    size="small"
                  >
                    Add Emoji
                  </Button>
                </Box>

                {/* File Upload */}
                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    id="file-upload"
                    multiple
                    type="file"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<ImageIcon />}
                      size="small"
                    >
                      Add Photos/Videos
                    </Button>
                  </label>
                  
                  {/* File Previews */}
                  {previewUrls.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {previewUrls.map((url, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          {selectedFiles[index].type.startsWith('image/') ? (
                            <img
                              src={url}
                              alt={`Preview ${index}`}
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '1px solid #ddd'
                              }}
                            />
                          ) : (
                            <video
                              src={url}
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '1px solid #ddd'
                              }}
                              controls
                            />
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFile(index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: 'error.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'error.dark',
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Platform Selection */}
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Select Platforms
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {platforms.map((platform) => (
                    <Chip
                      key={platform.id}
                      icon={getPlatformIcon(platform.id)}
                      label={platform.name}
                      onClick={() => {
                        if (selectedPlatforms.includes(platform.id)) {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                        } else {
                          setSelectedPlatforms([...selectedPlatforms, platform.id]);
                        }
                      }}
                      variant={selectedPlatforms.includes(platform.id) ? 'filled' : 'outlined'}
                      sx={{
                        backgroundColor: selectedPlatforms.includes(platform.id) ? `${platform.color}20` : 'transparent',
                        borderColor: platform.color,
                        color: selectedPlatforms.includes(platform.id) ? platform.color : 'text.primary',
                      }}
                    />
                  ))}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleCreatePost}
                    disabled={loading || !postContent.trim() || selectedPlatforms.length === 0}
                    startIcon={loading ? <CircularProgress size={20} /> : <PostAddIcon />}
                  >
                    {loading ? 'Creating...' : 'Post Now'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ScheduleIcon />}
                    onClick={() => setScheduledTime(new Date(Date.now() + 3600000).toISOString().slice(0, 16))}
                  >
                    Schedule
                  </Button>
                  <Typography variant="caption" color="text.secondary">Type: {postType}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Connected Accounts */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Connected Accounts
                </Typography>
                <List>
                  {Object.entries(connectedAccounts).map(([platform, account]) => (
                    <ListItem key={platform} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: getPlatformColor(platform), width: 32, height: 32 }}>
                          {getPlatformIcon(platform)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={platforms.find(p => p.id === platform)?.name || platform}
                        secondary={account.username}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDisconnectAccount(platform)}
                          disabled={loading}
                        >
                          <SettingsIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                
                {Object.keys(connectedAccounts).length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No accounts connected yet
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setConnectAccountOpen(true)}
                    >
                      Connect Account
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Posts */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent Posts
                </Typography>
                <List>
                  {posts.slice(0, 5).map((post) => (
                    <ListItem key={post.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <PostAddIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={post.content.substring(0, 50) + (post.content.length > 50 ? '...' : '')}
                        secondary={`${post.status} • ${new Date(post.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                  {posts.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No posts yet"
                        secondary="Create your first post to get started"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Create Post Dialog */}
      <Dialog
        open={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Template Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Post Template</InputLabel>
              <Select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                label="Post Template"
              >
                <MenuItem value="">No Template</MenuItem>
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Post Content */}
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Post Content"
              placeholder="Write your post content here..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Hashtag Suggestions */}
            {hashtagSuggestions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Suggested Hashtags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {hashtagSuggestions.map((hashtag, index) => (
                    <Chip
                      key={index}
                      label={hashtag}
                      size="small"
                      onClick={() => setPostContent(postContent + ' ' + hashtag)}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Platform Selection */}
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Select Platforms
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {platforms.map((platform) => (
                <FormControlLabel
                  key={platform.id}
                  control={
                    <Checkbox
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlatforms([...selectedPlatforms, platform.id]);
                        } else {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPlatformIcon(platform.id)}
                      {platform.name}
                    </Box>
                  }
                />
              ))}
            </Box>

            {/* Schedule Time */}
            <TextField
              fullWidth
              type="datetime-local"
              label="Schedule Post (Optional)"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatePostOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreatePost}
            disabled={loading || !postContent.trim() || selectedPlatforms.length === 0}
          >
            {loading ? <CircularProgress size={20} /> : 'Create Post'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Connect Account Dialog */}
      <Dialog
        open={connectAccountOpen}
        onClose={() => setConnectAccountOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Connect Social Media Account</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Connect your social media accounts to start managing them from Omni
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    value={credentials.platform}
                    onChange={(e)=>setCredentials({ ...credentials, platform: e.target.value })}
                    label="Platform"
                  >
                    {platforms.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Account Email/Username" fullWidth value={credentials.username} onChange={(e)=>setCredentials({...credentials, username: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Password" type="password" fullWidth value={credentials.password} onChange={(e)=>setCredentials({...credentials, password: e.target.value })} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectAccountOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => handleConnectAccount(credentials.platform)} disabled={!user || !credentials.platform}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialMedia;
