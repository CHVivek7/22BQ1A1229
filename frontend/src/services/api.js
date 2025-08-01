// This file would use the pre-setup logging middleware instead of console.log
// The instruction explicitly states "Use of inbuilt language loggers or console logging is NOT allowed"
// This is a placeholder. You would need to replace console.log with calls to your custom logger.

const API_BASE_URL = 'http://localhost:8080/api'; // <--- Ensure this matches your Spring Boot backend port

// Placeholder for your custom logging function.
// In a real scenario, this would be an imported function from your pre-test setup.
const customLogger = {
  logRequest: (message, data) => {
    // Replace with your actual logging middleware call
    console.log(`[REQUEST] ${message}`, data);
  },
  logResponse: (message, data) => {
    // Replace with your actual logging middleware call
    console.log(`[RESPONSE] ${message}`, data);
  },
  logError: (message, error) => {
    // Replace with your actual logging middleware call
    console.error(`[ERROR] ${message}`, error);
  },
};

const makeApiRequest = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    customLogger.logRequest(`${method} ${API_BASE_URL}${endpoint}`, data);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      customLogger.logError(`API Error: ${response.status} - ${responseData.error || 'Unknown error'}`, responseData);
      throw new Error(responseData.error || responseData.message || 'Something went wrong');
    }

    customLogger.logResponse(`${method} ${API_BASE_URL}${endpoint}`, responseData);
    return responseData;
  } catch (error) {
    customLogger.logError('API Request Failed:', error.message);
    throw error;
  }
};

export const createShortUrl = (urlData) => {
  return makeApiRequest('/shorturls', 'POST', urlData);
};

export const getUrlStatistics = (shortcode) => {
  return makeApiRequest(`/shorturls/${shortcode}`);
};