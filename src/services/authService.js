import {jwtDecode} from 'jwt-decode';

const authService = {
  isAuthenticated: () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp > Date.now() / 1000;
    }
    return false;
  },

  getToken: () => {
    return sessionStorage.getItem('token');
  },

  // ... other authentication methods (e.g., login, register)
};

export default authService;