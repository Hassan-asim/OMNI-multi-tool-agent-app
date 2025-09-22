import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TasksIcon,
  Message as CommunicationIcon,
  TrackChanges as LifeTrackerIcon,
  Share as SocialMediaIcon,
  AutoAwesome as AutomationsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  WbSunny as SunIcon,
  Nightlight as MoonIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
    color: '#667eea',
  },
  {
    text: 'Tasks',
    icon: <TasksIcon />,
    path: '/tasks',
    color: '#48bb78',
  },
  {
    text: 'Communication',
    icon: <CommunicationIcon />,
    path: '/communication',
    color: '#4299e1',
  },
  {
    text: 'Life Tracker',
    icon: <LifeTrackerIcon />,
    path: '/life-tracker',
    color: '#ed8936',
  },
  {
    text: 'Social Media',
    icon: <SocialMediaIcon />,
    path: '/social-media',
    color: '#e91e63',
  },
  {
    text: 'Automations',
    icon: <AutomationsIcon />,
    path: '/automations',
    color: '#9f7aea',
  },
  {
    text: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/analytics',
    color: '#f56565',
  },
  {
    text: 'Trip Planner',
    icon: <ScheduleIcon />,
    path: '/trip-planner',
    color: '#3182ce',
  },
  {
    text: 'Finance',
    icon: <AnalyticsIcon />,
    path: '/finance',
    color: '#2f855a',
  },
  {
    text: 'Meal Planner',
    icon: <CheckCircleIcon />,
    path: '/meal-planner',
    color: '#dd6b20',
  },
  {
    text: 'Exercise Planner',
    icon: <ScheduleIcon />,
    path: '/exercise-planner',
    color: '#38a169',
  },
  {
    text: 'Calendar',
    icon: <ScheduleIcon />,
    path: '/calendar',
    color: '#3182ce',
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    color: '#4a5568',
  },
];

const Sidebar = ({ open, onClose, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { userContext: userContextRaw, tasks, messages, automations } = useAppStore();
  const userContext = userContextRaw || { energy_level: 'medium' };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const getQuickStats = () => {
    const taskList = tasks || [];
    const messageList = messages || [];
    const automationList = automations || [];
    
    return {
      pendingTasks: taskList.filter(task => !task.completed).length,
      unreadMessages: messageList.filter(msg => msg.unread).length,
      activeAutomations: automationList.filter(auto => auto.enabled).length,
    };
  };

  const stats = getQuickStats();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Omni Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Universal Life Connector
          </Typography>
        </motion.div>
        
        {/* Collapse Button for Desktop */}
        {!isMobile && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Context Status */}
      <Box sx={{ p: 2 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                background: userContext.energy_level === 'high' 
                  ? 'linear-gradient(135deg, #48bb78, #38a169)'
                  : userContext.energy_level === 'medium'
                  ? 'linear-gradient(135deg, #ed8936, #dd6b20)'
                  : 'linear-gradient(135deg, #f56565, #e53e3e)',
              }}
            >
              {userContext.energy_level === 'high' ? <SunIcon /> : <MoonIcon />}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Energy: {userContext.energy_level}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${stats.pendingTasks} tasks`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`${stats.unreadMessages} messages`}
              size="small"
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`${stats.activeAutomations} automations`}
              size="small"
              color="info"
              variant="outlined"
            />
          </Box>
        </motion.div>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    backgroundColor: isActive ? `${item.color}15` : 'transparent',
                    border: isActive ? `1px solid ${item.color}30` : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: `${item.color}10`,
                      border: `1px solid ${item.color}20`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? item.color : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? item.color : 'text.primary',
                      },
                    }}
                  />
                  {isActive && (
                    <CheckCircleIcon
                      sx={{
                        color: item.color,
                        fontSize: 16,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Powered by AI • Always learning
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={'temporary'}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%',
          borderRight: '1px solid',
          borderColor: 'divider',
          zIndex: 1300,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
