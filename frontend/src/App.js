import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ShortenerPage from './pages/ShortenerPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button color="inherit" component={RouterLink} to="/">
              Shorten URL
            </Button>
            <Button color="inherit" component={RouterLink} to="/statistics">
              Statistics
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        {/* The redirection logic is handled by the backend. No need for a frontend redirect route here for the core functionality. */}
      </Routes>
    </Router>
  );
}

export default App;