import {jwtDecode} from 'jwt-decode';

const authService = {
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp > Date.now() / 1000;
    }
    return false;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  // ... other authentication methods (e.g., login, register)
};

export default authService;