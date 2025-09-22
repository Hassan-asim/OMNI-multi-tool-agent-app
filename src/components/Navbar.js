import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  WbSunny as SunIcon,
  Nightlight as MoonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { useAuth } from './Auth/AuthProvider';
import { signOutUser } from '../firebase/auth';

const Navbar = ({ onMenuClick, onChatClick }) => {
  const {
    userContext,
    chatHistory,
    theme,
    setTheme,
    toggleChat,
  } = useAppStore();
  
  const { user, userData } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    handleProfileMenuClose();
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      handleProfileMenuClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const unreadMessages = chatHistory.filter(msg => msg.type === 'omni' && !msg.read).length;

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Omni
              </Typography>
              <Chip
                label="Universal Life Connector"
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            </Box>
          </motion.div>
        </Box>

        {/* Center Section - Context Display */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<SunIcon />}
            label={userContext.time_of_day}
            color="primary"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Chip
            label={`Energy: ${userContext.energy_level}`}
            color="secondary"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Chip
            label={`Focus: ${userContext.current_focus}`}
            color="info"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Chat Button */}
          <IconButton
            color="inherit"
            onClick={onChatClick}
            sx={{ position: 'relative' }}
          >
            <Badge badgeContent={unreadMessages} color="error">
              <ChatIcon />
            </Badge>
          </IconButton>

          {/* Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <AccountCircleIcon />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
              },
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <AccountCircleIcon sx={{ mr: 2 }} />
              {userData?.displayName || user?.email || 'Profile'}
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <SettingsIcon sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleThemeToggle}>
              {theme === 'light' ? (
                <>
                  <MoonIcon sx={{ mr: 2 }} />
                  Dark Mode
                </>
              ) : (
                <>
                  <SunIcon sx={{ mr: 2 }} />
                  Light Mode
                </>
              )}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <AccountCircleIcon sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
