import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:5000/api'; // Change this to your backend URL

// Function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'An error occurred');
  }
};


export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data; // Assuming the response contains { success: true, token, etc. }
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'An error occurred');
  }
};

export const uploadIdentityFiles = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/verify-identity`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  };
  