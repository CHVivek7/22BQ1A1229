import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Grid, IconButton, Snackbar } from '@mui/material';
import { createShortUrl } from '../services/api';
import { isValidUrl, isValidValidity, isValidShortcode } from '../utils/validation';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

const ShortenerPage = () => {
  // State to manage up to 5 URL input fields
  const [urls, setUrls] = useState([{ originalUrl: '', validity: '', shortcode: '', result: null, error: null }]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    // Clear previous error and result when input changes
    newUrls[index].error = null;
    newUrls[index].result = null;
    setUrls(newUrls);
  };

  const addUrlInput = () => {
    if (urls.length < 5) {
      setUrls([...urls, { originalUrl: '', validity: '', shortcode: '', result: null, error: null }]);
    }
  };

  const removeUrlInput = (indexToRemove) => {
    if (urls.length > 1) { // Always keep at least one input field
      setUrls(urls.filter((_, index) => index !== indexToRemove));
    }
  };

  const shortenUrl = async (index) => {
    const urlData = urls[index];
    const { originalUrl, validity, shortcode } = urlData;

    if (!isValidUrl(originalUrl)) {
      handleInputChange(index, 'error', 'Invalid original URL format. Must start with http:// or https://');
      return;
    }
    if (validity && !isValidValidity(validity)) {
      handleInputChange(index, 'error', 'Validity must be a positive integer (minutes).');
      return;
    }
    if (shortcode && !isValidShortcode(shortcode)) {
      handleInputChange(index, 'error', 'Shortcode must be 3-20 alphanumeric characters, including _,-,$');
      return;
    }

    handleInputChange(index, 'error', null); // Clear previous error
    handleInputChange(index, 'result', null); // Clear previous result

    try {
      const payload = { url: originalUrl };
      if (validity) {
        payload.validity = parseInt(validity, 10);
      }
      if (shortcode) {
        payload.shortcode = shortcode;
      }

      const response = await createShortUrl(payload);
      handleInputChange(index, 'result', response);
    } catch (error) {
      handleInputChange(index, 'error', error.message || 'Failed to shorten URL.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage('Copied to clipboard!');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const snackbarAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        <LinkIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
        URL Shortener
      </Typography>

      {urls.map((url, index) => (
        <Box
          key={index}
          sx={{
            mb: 4,
            p: 3,
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: 1,
            position: 'relative' // For absolute positioning of remove button
          }}
        >
          {urls.length > 1 && (
            <IconButton
              aria-label="remove"
              onClick={() => removeUrlInput(index)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              color="error"
            >
              <CloseIcon />
            </IconButton>
          )}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Original URL"
                variant="outlined"
                value={url.originalUrl}
                onChange={(e) => handleInputChange(index, 'originalUrl', e.target.value)}
                error={!!url.error} // Check if any error exists for this input
                helperText={url.error}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Validity (minutes, optional)"
                variant="outlined"
                type="number"
                value={url.validity}
                onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                error={!!url.error && url.error.includes('Validity')}
                helperText={url.error && url.error.includes('Validity') ? url.error : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Preferred Shortcode (optional)"
                variant="outlined"
                value={url.shortcode}
                onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
                error={!!url.error && url.error.includes('Shortcode')}
                helperText={url.error && url.error.includes('Shortcode') ? url.error : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => shortenUrl(index)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Shorten URL
              </Button>
            </Grid>
            {url.result && (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    Short Link: <a href={url.result.shortlink} target="_blank" rel="noopener noreferrer">{url.result.shortlink}</a>
                  </Typography>
                  <Typography variant="body2">
                    Expires: {new Date(url.result.expiry).toLocaleString()}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => copyToClipboard(url.result.shortlink)}
                    sx={{ mt: 1 }}
                  >
                    Copy
                  </Button>
                </Alert>
              </Grid>
            )}
            {/* Error message is already handled by TextField's helperText for specific validations.
                This alert is for generic API errors. */}
            {url.error && !url.error.includes('URL') && !url.error.includes('Validity') && !url.error.includes('Shortcode') && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {url.error}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      ))}

      {urls.length < 5 && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button variant="outlined" onClick={addUrlInput}>
            Add another URL
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={snackbarAction}
      />
    </Container>
  );
};

export default ShortenerPage;