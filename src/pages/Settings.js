import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../components/Auth/AuthProvider';
import { useAppStore } from '../store/appStore';

const Settings = () => {
  const { user, userData, refreshUserData } = useAuth();
  const { theme, setTheme, connectedServices } = useAppStore();
  const [activeTab, setActiveTab] = useState(0);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: userData?.bio || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    social: true,
    tasks: true,
    messages: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    dataSharing: true,
    analytics: true,
    locationTracking: false,
  });

  const handleSaveProfile = async () => {
    // Save profile changes
    setEditProfileOpen(false);
  };

  const handleDeleteAccount = async () => {
    // Delete account logic
    setDeleteAccountOpen(false);
  };

  const getServiceIcon = (service) => {
    const icons = {
      gmail: '📧',
      slack: '💬',
      todoist: '📝',
      google_tasks: '📋',
      facebook: '📘',
      twitter: '🐦',
      instagram: '📷',
      linkedin: '💼',
    };
    return icons[service] || '🔗';
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
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account and preferences
        </Typography>
        
        {/* Quick Settings Icons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<PersonIcon />}
            label="Profile"
            color="primary"
            variant="outlined"
            clickable
            onClick={() => setEditProfileOpen(true)}
          />
          <Chip
            icon={<NotificationsIcon />}
            label="Notifications"
            color="secondary"
            variant="outlined"
            clickable
            onClick={() => setActiveTab(1)}
          />
          <Chip
            icon={<SecurityIcon />}
            label="Security"
            color="warning"
            variant="outlined"
            clickable
            onClick={() => setActiveTab(2)}
          />
          <Chip
            icon={<PaletteIcon />}
            label="Theme"
            color="info"
            variant="outlined"
            clickable
            onClick={() => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
            }}
          />
          <Chip
            icon={<LanguageIcon />}
            label="Language"
            color="success"
            variant="outlined"
            clickable
            onClick={() => console.log('Language settings')}
          />
          <Chip
            icon={<StorageIcon />}
            label="Storage"
            color="default"
            variant="outlined"
            clickable
            onClick={() => console.log('Storage settings')}
          />
        </Box>
      </Box>

      {/* Warning Section */}
      <Alert 
        severity="warning" 
        icon={<WarningIcon />}
        sx={{ mb: 3 }}
      >
        <Typography variant="body2">
          Some settings require a page refresh to take effect. Make sure to save your work before making changes.
        </Typography>
      </Alert>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Profile" />
          <Tab label="Notifications" />
          <Tab label="Privacy" />
          <Tab label="Connected Services" />
          <Tab label="Advanced" />
        </Tabs>
      </Box>

      {/* Profile Tab */}
      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {user?.displayName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user?.displayName || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setEditProfileOpen(true)}
                    sx={{ mt: 1 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Account Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email Address"
                      secondary={user?.email}
                    />
                    <ListItemSecondaryAction>
                      <Button size="small">Change</Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Password"
                      secondary="Last changed 30 days ago"
                    />
                    <ListItemSecondaryAction>
                      <Button size="small">Change</Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Not enabled"
                    />
                    <ListItemSecondaryAction>
                      <Button size="small">Enable</Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Notification Preferences
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Communication
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.push}
                      onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    />
                  }
                  label="SMS Notifications"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Activity
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.social}
                      onChange={(e) => setNotifications({ ...notifications, social: e.target.checked })}
                    />
                  }
                  label="Social Media Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.tasks}
                      onChange={(e) => setNotifications({ ...notifications, tasks: e.target.checked })}
                    />
                  }
                  label="Task Reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.messages}
                      onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })}
                    />
                  }
                  label="Message Alerts"
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Privacy Tab */}
      {activeTab === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Privacy & Security
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Profile Visibility
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.profileVisibility === 'public'}
                      onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.checked ? 'public' : 'private' })}
                    />
                  }
                  label="Make profile public"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Data Usage
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.dataSharing}
                      onChange={(e) => setPrivacy({ ...privacy, dataSharing: e.target.checked })}
                    />
                  }
                  label="Allow data sharing for improvements"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.analytics}
                      onChange={(e) => setPrivacy({ ...privacy, analytics: e.target.checked })}
                    />
                  }
                  label="Enable analytics tracking"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.locationTracking}
                      onChange={(e) => setPrivacy({ ...privacy, locationTracking: e.target.checked })}
                    />
                  }
                  label="Location tracking"
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Connected Services Tab */}
      {activeTab === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Connected Services
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Connect Service
                </Button>
              </Box>

              <List>
                {Object.keys(userData?.socialMediaAccounts || {}).map((service) => (
                  <ListItem key={service} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">
                            {getServiceIcon(service)}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                            {service.replace('_', ' ')}
                          </Typography>
                          <Chip
                            label="Connected"
                            size="small"
                            color="success"
                            icon={<CheckIcon />}
                          />
                        </Box>
                      }
                      secondary={userData.socialMediaAccounts[service]?.username || 'Connected'}
                    />
                    <ListItemSecondaryAction>
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {Object.keys(userData?.socialMediaAccounts || {}).length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No services connected yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                  >
                    Connect Your First Service
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Advanced Tab */}
      {activeTab === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Advanced Settings
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Theme
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={theme === 'dark'}
                      onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    />
                  }
                  label="Dark Mode"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Data Management
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ mr: 2 }}
                >
                  Export Data
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteAccountOpen(true)}
                >
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Edit Profile Dialog */}
      <Dialog
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Display Name"
              value={profileData.displayName}
              onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete your account? This will remove all your data, 
            connected services, and cannot be reversed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
