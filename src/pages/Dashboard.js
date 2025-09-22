import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Message as MessageIcon,
  Share as SocialIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const Dashboard = () => {
  const { 
    tasks, 
    completedTasks, 
    messages, 
    socialPosts, 
    lifeMetrics, 
    unreadCount
  } = useAppStore();

  const recentTasks = tasks.slice(0, 5);
  const recentMessages = messages.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getProductivityScore = () => {
    const totalTasks = tasks.length + completedTasks.length;
    const completed = completedTasks.length;
    return totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
  };

  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {getGreeting()}! 👋
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <TaskIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Tasks</Typography>
                    <Typography variant="h4" color="primary">
                      {tasks.length}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {completedTasks.length} completed today
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getProductivityScore()}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <MessageIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Messages</Typography>
                    <Typography variant="h4" color="secondary">
                      {messages.length}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {unreadCount} unread
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <SocialIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Social Posts</Typography>
                    <Typography variant="h4" color="success.main">
                      {socialPosts.length}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  This week
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <TrendingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Productivity</Typography>
                    <Typography variant="h4" color="warning.main">
                      {getProductivityScore()}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Overall score
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Tasks
                </Typography>
                <List>
                  {recentTasks.length > 0 ? (
                    recentTasks.map((task, index) => (
                      <ListItem key={task.id} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            <TaskIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={task.title || 'Untitled Task'}
                          secondary={task.priority || 'Medium priority'}
                        />
                        <Chip
                          label={task.priority || 'Medium'}
                          size="small"
                          color={task.priority === 'high' ? 'error' : 'default'}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No tasks yet"
                        secondary="Create your first task to get started"
                      />
                    </ListItem>
                  )}
                </List>
                <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => window.location.assign('/tasks')}>
                  View All Tasks
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Messages */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Messages
                </Typography>
                <List>
                  {recentMessages.length > 0 ? (
                    recentMessages.map((message, index) => (
                      <ListItem key={message.id} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.light' }}>
                            <MessageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={message.sender || 'Unknown'}
                          secondary={message.content || 'No content'}
                        />
                        {!message.read && (
                          <Chip label="New" size="small" color="primary" />
                        )}
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No messages yet"
                        secondary="Your messages will appear here"
                      />
                    </ListItem>
                  )}
                </List>
                <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => window.location.assign('/communication')}>
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Life Metrics */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Life Metrics
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(lifeMetrics).map(([key, metric]) => (
                    <Grid item xs={12} sm={6} md={3} key={key}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                          {metric.score}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={metric.score}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
      
      {/* Attribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Box sx={{ mt: 4, textAlign: 'center', py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            © 2025 SUFI HASSAN ASIM - FOUNDER AND CEO OF "DEVise solutions" • All rights reserved
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Dashboard;