import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Favorite as HealthIcon,
  AccountBalance as FinanceIcon,
  School as LearningIcon,
  Psychology as HabitsIcon,
  Favorite as RelationshipIcon,
  Work as CareerIcon,
  SelfImprovement as GrowthIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const LifeTracker = () => {
  const { dashboardData } = useAppStore();
  const lifeMetrics = (dashboardData && dashboardData.life_metrics) ? dashboardData.life_metrics : {};
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const overallScore = lifeMetrics.overall_score || 0;

  const categories = [
    {
      id: 'health',
      name: 'Health',
      icon: <HealthIcon />,
      color: '#4caf50',
      metrics: lifeMetrics.health || {},
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: <FinanceIcon />,
      color: '#2196f3',
      metrics: lifeMetrics.finance || {},
    },
    {
      id: 'learning',
      name: 'Learning',
      icon: <LearningIcon />,
      color: '#ff9800',
      metrics: lifeMetrics.learning || {},
    },
    {
      id: 'habits',
      name: 'Habits',
      icon: <HabitsIcon />,
      color: '#9c27b0',
      metrics: lifeMetrics.habits || {},
    },
    {
      id: 'relationships',
      name: 'Relationships',
      icon: <RelationshipIcon />,
      color: '#e91e63',
      metrics: lifeMetrics.relationships || {},
    },
    {
      id: 'career',
      name: 'Career',
      icon: <CareerIcon />,
      color: '#607d8b',
      metrics: lifeMetrics.career || {},
    },
    {
      id: 'personal_growth',
      name: 'Personal Growth',
      icon: <GrowthIcon />,
      color: '#795548',
      metrics: lifeMetrics.personal_growth || {},
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#4caf50';
    if (score >= 0.6) return '#ff9800';
    return '#f44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Needs Improvement';
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
          Life Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and improve all aspects of your life
        </Typography>
        
        {/* Quick Action Chips */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<AddIcon />}
            label="Add New Metric"
            color="primary"
            variant="outlined"
            clickable
            onClick={() => setEditDialogOpen(true)}
          />
          <Chip
            label="Export Data"
            color="secondary"
            variant="outlined"
            clickable
            onClick={() => {
              const data = JSON.stringify(dashboardData.life_metrics, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'life-metrics.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          />
          <Chip
            label="Set Goals"
            color="info"
            variant="outlined"
            clickable
            onClick={() => console.log('Open goals dialog')}
          />
        </Box>
      </Box>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Overall Life Balance Score
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: getScoreColor(overallScore),
                    fontSize: '2rem',
                  }}
                >
                  {Math.round(overallScore * 100)}%
                </Avatar>
              </Box>
              <Typography variant="h6" sx={{ color: getScoreColor(overallScore) }}>
                {getScoreLabel(overallScore)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Based on your current metrics across all life areas
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Life Categories */}
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} md={6} lg={4} key={category.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setEditDialogOpen(true);
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: category.color, mr: 2 }}>
                      {category.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Object.keys(category.metrics).length} metrics tracked
                      </Typography>
                    </Box>
                  </Box>

                  {/* Key Metrics */}
                  <Box sx={{ mb: 2 }}>
                    {Object.entries(category.metrics).slice(0, 3).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {key.replace('_', ' ')}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {typeof value === 'number' ? Math.round(value * 100) + '%' : value}
                          </Typography>
                        </Box>
                        {typeof value === 'number' && (
                          <LinearProgress
                            variant="determinate"
                            value={value * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: category.color,
                              },
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>

                  {/* Action Button */}
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{ color: category.color }}
                  >
                    Update Metrics
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Recent Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Insights
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Health Score Improving"
                  secondary="Your sleep and exercise habits have improved this week"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <TrendingIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Learning Velocity Down"
                  secondary="Consider adjusting your study schedule for better retention"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <TrendingIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Financial Health Stable"
                  secondary="Your savings rate is consistent. Great job!"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Metrics Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update {categories.find(c => c.id === selectedCategory)?.name} Metrics
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Update your metrics to keep your life tracking accurate and helpful.
            </Typography>
            {/* This would contain form fields for updating metrics */}
            <TextField
              fullWidth
              label="Sleep Hours"
              type="number"
              defaultValue={7.5}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Exercise Minutes"
              type="number"
              defaultValue={30}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Water Intake (glasses)"
              type="number"
              defaultValue={8}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LifeTracker;
