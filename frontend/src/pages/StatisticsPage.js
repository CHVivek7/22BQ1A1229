import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getUrlStatistics } from '../services/api';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const StatisticsPage = () => {
  const [shortcode, setShortcode] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    if (!shortcode.trim()) {
      setError('Please enter a shortcode.');
      setStats(null); // Clear previous stats if input is empty
      return;
    }
    setLoading(true);
    setError(null);
    setStats(null); // Clear previous stats
    try {
      const data = await getUrlStatistics(shortcode.trim());
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics. Short link might not exist or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        <AnalyticsIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
        URL Shortener Statistics
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Enter Shortcode"
          variant="outlined"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          onKeyPress={(e) => { // Allow pressing Enter to fetch
            if (e.key === 'Enter') {
              fetchStatistics();
            }
          }}
          error={!!error && error.includes('shortcode')} // Apply error state to text field
          helperText={error && error.includes('shortcode') ? error : ''}
        />
        <Button
          variant="contained"
          onClick={fetchStatistics}
          disabled={loading || !shortcode.trim()} // Disable button if loading or shortcode is empty
          sx={{ height: '56px' }} // Match TextField height
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Statistics'}
        </Button>
      </Box>

      {/* Display generic errors not tied to a specific input field */}
      {error && !error.includes('shortcode') && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {stats && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Statistics for "{shortcode}"
          </Typography>
          <Typography variant="body1">
            <strong>Original URL:</strong> <a href={stats.originalUrlInfo.originalUrl} target="_blank" rel="noopener noreferrer">{stats.originalUrlInfo.originalUrl}</a>
          </Typography>
          <Typography variant="body1">
            <strong>Creation Date:</strong> {new Date(stats.originalUrlInfo.creationDate).toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <strong>Expiry Date:</strong> {new Date(stats.originalUrlInfo.expiryDate).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Total Clicks:</strong> {stats.totalClicks}
          </Typography>

          {stats.detailedClicks && stats.detailedClicks.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Detailed Clicks:</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.detailedClicks.map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{click.source || 'Direct'}</TableCell>
                        <TableCell>
                          {click.geoLocation.city ? `${click.geoLocation.city}, ` : ''}
                          {click.geoLocation.country || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              No detailed click data available yet.
            </Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default StatisticsPage;