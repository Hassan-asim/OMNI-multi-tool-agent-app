import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, useTheme, useMediaQuery, ThemeProvider, createTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Communication from './pages/Communication';
import LifeTracker from './pages/LifeTracker';
import SocialMedia from './pages/SocialMedia';
import Automations from './pages/Automations';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ChatInterface from './components/ChatInterface';
import AuthModal from './components/Auth/AuthModal';

// Context
import { useAppStore } from './store/appStore';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function AppContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [chatOpen, setChatOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { initializeApp, isInitialized } = useAppStore();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  if (authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: '3rem', marginBottom: '1rem' }}
            >
              🌐
            </motion.div>
            <h2>Loading Omni...</h2>
            <p>Connecting to your digital universe</p>
          </Box>
        </motion.div>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 6,
              textAlign: 'center',
              color: 'white',
              maxWidth: 400,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: '4rem', marginBottom: '1rem' }}
            >
              🌐
            </motion.div>
            <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Welcome to Omni</h1>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>
              Your Universal Life Connector
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Get Started
            </button>
          </Box>
        </motion.div>

        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </Box>
    );
  }

  if (!isInitialized) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: '3rem', marginBottom: '1rem' }}
            >
              🌐
            </motion.div>
            <h2>Initializing Omni...</h2>
            <p>Connecting to your digital universe</p>
          </Box>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} onChatClick={() => setChatOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: sidebarOpen && !isMobile ? '280px' : '0px',
          pt: '64px', // Account for navbar height
        }}
      >
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/life-tracker" element={<LifeTracker />} />
            <Route path="/social-media" element={<SocialMedia />} />
            <Route path="/automations" element={<Automations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AnimatePresence>
      </Box>

      {/* Chat Interface */}
      <ChatInterface
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;