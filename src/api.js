import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:10789';

// Create an axios instance with the base URL and credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

/**
 * Registers a new user with the given user data.
 * @param {Object} userData - The data of the user.
 * @returns {Object} The response data from the registration endpoint.
 * @throws {Error} If registration fails.
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/user/register', userData);
    return response.data;  
  } catch (error) {
    console.error('Error registering user:', error.response);
    throw error;
  }
};

/**
 * Logs in a user with the given credentials.
 * @param {Object} credentials - The login credentials (username and password).
 * @returns {Object} The response data from the login endpoint.
 * @throws {Error} If login fails.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/user/login', credentials);
    return response.data;  
  } catch (error) {
    console.error('Error logging in:', error.response);
    throw error;
  }
};
