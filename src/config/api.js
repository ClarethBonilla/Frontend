// API Configuration
// Auto-detect if running on mobile/network or localhost
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // If accessed via IP address or network hostname, use that IP for API
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:5000`;
  }
  
  // Otherwise use localhost (dev environment)
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();

export default API_BASE_URL;
