import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  AutoAwesome as AutoAwesomeIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const ChatInterface = ({ open, onClose }) => {
  const { chatHistory, isTyping, sendChatMessage } = useAppStore();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const messageText = message.trim();
    setMessage('');
    setLoading(true);

    try {
      // Use intelligent chat endpoint for better natural language understanding
      await sendIntelligentMessage(messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendIntelligentMessage = async (messageText) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/intelligent-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: 'default',
          context: {}
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (data.success) {
        // Add user message
        const userMessage = {
          id: Date.now(),
          type: 'user',
          content: messageText,
          timestamp: new Date().toISOString(),
        };

        // Add AI response
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.response,
          timestamp: new Date().toISOString(),
          intent: data.intent,
          entities: data.entities,
          actions_taken: data.actions_taken,
          suggestions: data.suggestions,
        };

        // Update chat history
        useAppStore.getState().addChatMessage(userMessage);
        useAppStore.getState().addChatMessage(aiMessage);
      }
    } catch (error) {
      console.error('Error with intelligent chat:', error);
      // Fallback to regular chat
      await sendChatMessage(messageText);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'omni':
        return <BotIcon />;
      case 'user':
        return <PersonIcon />;
      case 'error':
        return <CloseIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'omni':
        return 'primary';
      case 'user':
        return 'secondary';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Omni Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Your universal life connector
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <AnimatePresence>
            {chatHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Welcome to Omni!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    I'm here to help you manage your digital life. Ask me anything!
                  </Typography>
                  
                  {/* Quick Actions */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {[
                      'Show my tasks',
                      'Check my messages',
                      'Create a post',
                      'Schedule a meeting',
                    ].map((suggestion) => (
                      <Chip
                        key={suggestion}
                        label={suggestion}
                        size="small"
                        onClick={() => setMessage(suggestion)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </motion.div>
              </Box>
            ) : (
              chatHistory.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        backgroundColor: msg.type === 'user' ? 'primary.main' : 'background.paper',
                        color: msg.type === 'user' ? 'primary.contrastText' : 'text.primary',
                        borderRadius: 2,
                        boxShadow: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: getMessageColor(msg.type) + '.main',
                          }}
                        >
                          {getMessageIcon(msg.type)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {msg.content}
                          </Typography>
                          
                          {/* Show intent and entities for AI messages */}
                          {msg.type === 'ai' && msg.intent && (
                            <Box sx={{ mb: 1 }}>
                              <Chip
                                label={`Intent: ${msg.intent.primary_intent || 'Unknown'}`}
                                size="small"
                                color="primary"
                                sx={{ mr: 1, mb: 1 }}
                              />
                              {msg.intent.confidence && (
                                <Chip
                                  label={`Confidence: ${msg.intent.confidence}%`}
                                  size="small"
                                  color="secondary"
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              )}
                              {msg.intent.category && (
                                <Chip
                                  label={`Category: ${msg.intent.category}`}
                                  size="small"
                                  color="info"
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              )}
                            </Box>
                          )}
                          
                          {/* Show actions taken */}
                          {msg.actions_taken && msg.actions_taken.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                                Actions Taken:
                              </Typography>
                              {msg.actions_taken.map((action, idx) => (
                                <Chip
                                  key={idx}
                                  label={action.action || action.tool || 'Action'}
                                  size="small"
                                  color="success"
                                  icon={<CheckCircleIcon />}
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              ))}
                            </Box>
                          )}
                          
                          {/* Show suggestions */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Suggestions:
                              </Typography>
                              {msg.suggestions.map((suggestion, idx) => (
                                <Chip
                                  key={idx}
                                  label={suggestion}
                                  size="small"
                                  variant="outlined"
                                  onClick={() => setMessage(suggestion)}
                                  sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
                                />
                              ))}
                            </Box>
                          )}
                          
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.7,
                              display: 'block',
                            }}
                          >
                            {formatTime(msg.timestamp)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Actions taken */}
                      {msg.actions && msg.actions.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                            Actions taken:
                          </Typography>
                          <List dense sx={{ py: 0 }}>
                            {msg.actions.map((action, actionIndex) => (
                              <ListItem key={actionIndex} sx={{ py: 0, px: 0 }}>
                                <ListItemAvatar sx={{ minWidth: 24 }}>
                                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={action.tool}
                                  secondary={action.result}
                                  primaryTypographyProps={{ variant: 'caption' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {/* Suggestions */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                            Suggestions:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {msg.suggestions.map((suggestion, suggestionIndex) => (
                              <Chip
                                key={suggestionIndex}
                                label={suggestion}
                                size="small"
                                onClick={() => setMessage(suggestion)}
                                sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <BotIcon />
                    </Avatar>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Omni is thinking...
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ask Omni anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              multiline
              maxRows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!message.trim() || loading}
              sx={{
                minWidth: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatInterface;
