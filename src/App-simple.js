import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            🌐 Omni Universal Assistant
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Your Universal Life Connector
          </Typography>
          <Typography variant="body1" paragraph>
            Transform chaotic digital life into unified, intelligent harmony.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ mt: 2 }}
            onClick={() => alert('Welcome to Omni!')}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
