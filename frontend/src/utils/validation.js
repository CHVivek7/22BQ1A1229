export const isValidUrl = (url) => {
  try {
    new URL(url);
    // Basic check for http/https protocol for real web URLs
    return (url.startsWith('http://') || url.startsWith('https://'));
  } catch (e) {
    return false;
  }
};

export const isValidValidity = (validity) => {
  const num = parseInt(validity, 10);
  return !isNaN(num) && num > 0; // Must be a positive integer
};

export const isValidShortcode = (shortcode) => {
  // Regex: alphanumeric, underscore, hyphen, dollar sign (as per shortid spec if used, or custom).
  // Length: 3 to 20 characters as a reasonable length constraint for custom codes.
  return /^[a-zA-Z0-9_$-]{3,20}$/.test(shortcode);
};