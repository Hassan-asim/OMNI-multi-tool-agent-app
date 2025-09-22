import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { signInWithEmail, signInWithGoogle, resetPassword } from '../../firebase/auth';
import { useAuth } from './AuthProvider';

const Login = ({ onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { refreshUserData } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signInWithEmail(formData.email, formData.password);
    
    if (result.success) {
      await refreshUserData();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogle();
    
    if (result.success) {
      await refreshUserData();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    const result = await resetPassword(formData.email);
    
    if (result.success) {
      setResetEmailSent(true);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: '#667eea',
                  }}
                >
                  OMNI
                </Typography>
              </Box>
            </motion.div>
            
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your Omni account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {resetEmailSent && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset email sent! Check your inbox.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                component="button"
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                sx={{ textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {canInstall && (
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={async () => {
                if (!deferredPrompt) return;
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                  setCanInstall(false);
                }
                setDeferredPrompt(null);
              }}
              sx={{ mb: 2 }}
            >
              Install Omni App
            </Button>
          )}

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
          >
            Continue with Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={onSwitchToSignUp}
                sx={{ textDecoration: 'none', fontWeight: 600 }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Landing / Features + Install CTA */}
      <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 5, px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
          Your Universal Life Connector
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Tasks, Communication, Socials, Automations, Calendar — unified and AI-powered.
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          <Card><CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Social Media</Typography>
            <Typography variant="body2" color="text.secondary">Connect your accounts, post instantly, and track results.</Typography>
          </CardContent></Card>
          <Card><CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Smart Automation</Typography>
            <Typography variant="body2" color="text.secondary">Build workflows across apps with time/event triggers.</Typography>
          </CardContent></Card>
          <Card><CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Built-in Calendar</Typography>
            <Typography variant="body2" color="text.secondary">Add events with cross-device notifications.</Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                setDeferredPrompt(null);
                setCanInstall(false);
              } else {
                alert('To install: use your browser menu → Add to Home screen.');
              }
            }}
          >
            Install App
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Login;
