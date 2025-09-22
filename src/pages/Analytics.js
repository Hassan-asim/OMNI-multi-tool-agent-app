import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Assignment as TaskIcon,
  Message as MessageIcon,
  Share as SocialIcon,
  AutoAwesome as AutoIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAppStore } from '../store/appStore';

const Analytics = () => {
  const { dashboardData, tasks, messages, socialPosts, automations } = useAppStore();
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for charts
  const productivityData = [
    { name: 'Mon', tasks: 8, completed: 6 },
    { name: 'Tue', tasks: 12, completed: 10 },
    { name: 'Wed', tasks: 6, completed: 5 },
    { name: 'Thu', tasks: 14, completed: 12 },
    { name: 'Fri', tasks: 10, completed: 8 },
    { name: 'Sat', tasks: 4, completed: 4 },
    { name: 'Sun', tasks: 2, completed: 2 },
  ];

  const socialMediaData = [
    { name: 'Facebook', posts: 12, engagement: 85 },
    { name: 'Twitter', posts: 25, engagement: 92 },
    { name: 'LinkedIn', posts: 8, engagement: 78 },
    { name: 'Instagram', posts: 15, engagement: 95 },
  ];

  const lifeBalanceData = [
    { name: 'Health', value: 75, color: '#4caf50' },
    { name: 'Finance', value: 60, color: '#2196f3' },
    { name: 'Learning', value: 45, color: '#ff9800' },
    { name: 'Relationships', value: 80, color: '#e91e63' },
    { name: 'Career', value: 70, color: '#607d8b' },
  ];

  const insights = [
    {
      type: 'success',
      icon: <CheckIcon />,
      title: 'Productivity Peak',
      message: 'You\'re most productive on Tuesdays and Thursdays. Consider scheduling important tasks on these days.',
      impact: 'high',
    },
    {
      type: 'warning',
      icon: <WarningIcon />,
      title: 'Social Media Engagement',
      message: 'Your Instagram posts get 95% engagement but you only post 15 times. Consider posting more frequently.',
      impact: 'medium',
    },
    {
      type: 'info',
      icon: <InfoIcon />,
      title: 'Learning Opportunity',
      message: 'Your learning velocity is at 45%. Try dedicating 30 minutes daily to skill development.',
      impact: 'medium',
    },
  ];

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#9e9e9e';
    }
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
          Analytics & Insights
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Understand your digital life patterns and optimize your productivity
        </Typography>
        
        {/* Quick Stats with Trending Icons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<TrendingIcon />}
            label={`${tasks.length} Total Tasks`}
            color="primary"
            variant="outlined"
            clickable
            onClick={() => console.log('Navigate to tasks')}
          />
          <Chip
            icon={<ScheduleIcon />}
            label={`${automations.length} Automations`}
            color="secondary"
            variant="outlined"
            clickable
            onClick={() => console.log('Navigate to automations')}
          />
          <Chip
            icon={<TrendingIcon />}
            label={`${socialPosts.length} Social Posts`}
            color="info"
            variant="outlined"
            clickable
            onClick={() => console.log('Navigate to social media')}
          />
        </Box>
      </Box>

      {/* Time Range Selector */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Performance Overview</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <TaskIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      87%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Task Completion Rate
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={87}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <MessageIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      2.3h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Response Time
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e91e63', mr: 2 }}>
                    <SocialIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      89%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Social Engagement
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={89}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}>
                    <AutoIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      94%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Automation Success
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={94}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Productivity Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Weekly Productivity
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#2196f3" strokeWidth={2} />
                    <Line type="monotone" dataKey="completed" stroke="#4caf50" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Social Media Performance */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Social Media Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={socialMediaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#e91e63" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Life Balance & Insights */}
      <Grid container spacing={3}>
        {/* Life Balance */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Life Balance Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={lifeBalanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {lifeBalanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {lifeBalanceData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: item.color,
                          borderRadius: '50%',
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* AI Insights */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  AI-Powered Insights
                </Typography>
                <List>
                  {insights.map((insight, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: getInsightColor(insight.type) }}>
                          {insight.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {insight.title}
                            </Typography>
                            <Chip
                              label={insight.impact}
                              size="small"
                              color={insight.impact === 'high' ? 'error' : insight.impact === 'medium' ? 'warning' : 'default'}
                            />
                          </Box>
                        }
                        secondary={insight.message}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
