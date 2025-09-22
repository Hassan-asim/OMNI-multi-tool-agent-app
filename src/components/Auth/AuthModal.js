import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Login from './Login';
import SignUp from './SignUp';

const AuthModal = ({ open, onClose, initialTab = 0 }) => {
  const [currentTab, setCurrentTab] = useState(initialTab);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleClose = () => {
    setCurrentTab(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        },
      }}
    >
      <DialogTitle sx={{ p: 0, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 120,
              },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
          
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: currentTab === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTab === 0 ? (
            <Login onSwitchToSignUp={() => setCurrentTab(1)} />
          ) : (
            <SignUp onSwitchToLogin={() => setCurrentTab(0)} />
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
