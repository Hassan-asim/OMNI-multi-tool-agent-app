import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Grid,
} from '@mui/material';
import {
  Send as SendIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  VideoCall as VideoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const Communication = () => {
  const { messages, addMessage } = useAppStore();
  const [activeTab, setActiveTab] = useState(0);
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    message: '',
    recipient: '',
    channel: 'auto',
  });
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem('omni_comm_prefs');
      return raw ? JSON.parse(raw) : { senderEmail: '', slackWorkspace: '', slackChannel: '' };
    } catch {
      return { senderEmail: '', slackWorkspace: '', slackChannel: '' };
    }
  });

  const unreadMessages = messages.filter(msg => msg.unread);
  const allMessages = messages;

  const handleSendMessage = () => {
    if (!newMessage.message.trim() || !newMessage.recipient.trim()) return;

    addMessage({ ...newMessage, sender: prefs.senderEmail || 'me@local', service: newMessage.channel });
    setNewMessage({
      message: '',
      recipient: '',
      channel: 'auto',
    });
    setComposeDialogOpen(false);
  };

  const getChannelIcon = (service) => {
    switch (service) {
      case 'gmail': return <EmailIcon />;
      case 'slack': return <ChatIcon />;
      case 'sms': return <SmsIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      case 'teams': return <VideoIcon />;
      default: return <EmailIcon />;
    }
  };

  const getChannelColor = (service) => {
    switch (service) {
      case 'gmail': return '#ea4335';
      case 'slack': return '#4a154b';
      case 'sms': return '#25d366';
      case 'whatsapp': return '#25d366';
      case 'teams': return '#6264a7';
      default: return '#666';
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
          Communication Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all your messages and communications in one place
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`All Messages (${allMessages.length})`} />
          <Tab label={`Unread (${unreadMessages.length})`} />
        </Tabs>
      </Box>

      {/* Message List */}
      <Card>
        <CardContent>
          <List>
            {(activeTab === 0 ? allMessages : unreadMessages).map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: message.unread ? 'primary.light' : 'background.paper',
                    opacity: message.unread ? 1 : 0.8,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getChannelColor(message.service) }}>
                      {getChannelIcon(message.service)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: message.unread ? 600 : 400,
                          }}
                        >
                          {message.subject || message.text?.substring(0, 50) + '...'}
                        </Typography>
                        {message.unread && (
                          <Chip
                            label="New"
                            size="small"
                            color="primary"
                          />
                        )}
                        <Chip
                          label={message.service}
                          size="small"
                          variant="outlined"
                          sx={{ color: getChannelColor(message.service) }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          From: {message.sender}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {message.date && new Date(message.date).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <ReplyIcon />
                    </IconButton>
                    <IconButton size="small">
                      <ForwardIcon />
                    </IconButton>
                    <IconButton size="small">
                      <MarkReadIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </motion.div>
            ))}
          </List>

          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <EmailIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No messages yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Connect your communication accounts to see messages here
              </Typography>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => setComposeDialogOpen(true)}
              >
                Send Message
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Compose Message Dialog */}
      <Dialog
        open={composeDialogOpen}
        onClose={() => setComposeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Compose Message</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Recipient"
              value={newMessage.recipient}
              onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Channel</InputLabel>
              <Select
                value={newMessage.channel}
                onChange={(e) => setNewMessage({ ...newMessage, channel: e.target.value })}
                label="Channel"
              >
                <MenuItem value="auto">Auto (Best Channel)</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="slack">Slack</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="whatsapp">WhatsApp</MenuItem>
                <MenuItem value="teams">Microsoft Teams</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Message"
              value={newMessage.message}
              onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
              placeholder="Type your message here..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.message.trim() || !newMessage.recipient.trim()}
            startIcon={<SendIcon />}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Actions */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<SendIcon />}
          onClick={() => setComposeDialogOpen(true)}
        >
          Compose Message
        </Button>
        <Button
          variant="outlined"
          startIcon={<EmailIcon />}
          onClick={() => {
            // Handle email action
          }}
        >
          Check Email
        </Button>
        <Button
          variant="outlined"
          startIcon={<ChatIcon />}
          onClick={() => {
            // Handle Slack action
          }}
        >
          Open Slack
        </Button>
        <Button
          variant="outlined"
          startIcon={<WhatsAppIcon />}
          onClick={() => {
            // Try to open WhatsApp locally; fallback to web or prompt
            const text = encodeURIComponent('Hello from Omni');
            const url = `whatsapp://send?text=${text}`;
            const webUrl = `https://wa.me/?text=${text}`;
            const w = window.open(url);
            setTimeout(() => {
              if (!w || w.closed || typeof w.closed === 'undefined') {
                window.open(webUrl, '_blank');
              }
            }, 500);
          }}
        >
          WhatsApp
        </Button>
      </Box>

      {/* Account Settings */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Account Preferences</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sender Email (for Email/Slack)"
                value={prefs.senderEmail}
                onChange={(e) => setPrefs({ ...prefs, senderEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Slack Workspace"
                value={prefs.slackWorkspace}
                onChange={(e) => setPrefs({ ...prefs, slackWorkspace: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Slack Channel"
                value={prefs.slackChannel}
                onChange={(e) => setPrefs({ ...prefs, slackChannel: e.target.value })}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                localStorage.setItem('omni_comm_prefs', JSON.stringify(prefs));
              }}
            >
              Save Preferences
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Communication;
