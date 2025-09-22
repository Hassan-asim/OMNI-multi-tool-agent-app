import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery, ThemeProvider } from '@mui/material';
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
import TripPlanner from './pages/TripPlanner';
import FinancialManager from './pages/FinancialManager';
import MealPlanner from './pages/MealPlanner';
import ExercisePlanner from './pages/ExercisePlanner';
import CalendarPage from './pages/Calendar';
import ChatInterface from './components/ChatInterface';
import AuthModal from './components/Auth/AuthModal';

// Context
import { useAppStore } from './store/appStore';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';

// Import themes
import { lightTheme, darkTheme } from './theme';

function AppContent() {
  const { initializeApp, isInitialized, theme: currentTheme } = useAppStore();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [chatOpen, setChatOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    // On mobile, start with sidebar closed
    // On desktop, start with sidebar open
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

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
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} onChatClick={() => setChatOpen(true)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: theme.transitions.create(['opacity', 'transform'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
            width: '100%',
            pt: '64px', // Account for navbar height
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            // no sidebar push on desktop; drawer overlays content
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
              <Route path="/trip-planner" element={<TripPlanner />} />
              <Route path="/finance" element={<FinancialManager />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/exercise-planner" element={<ExercisePlanner />} />
              <Route path="/calendar" element={<CalendarPage />} />
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
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;