import { useEffect, useState } from 'react';
import {jwtDecode}  from 'jwt-decode'; // Import the default export

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Ensure the token is in localStorage
    // console.log('Token found:', token);

    if (token) {
      try {
        const decoded = jwtDecode (token); // Decode using the correct method
        // console.log('Decoded token:', decoded);

        setCurrentUser({
          user_id: decoded.id,
          email: decoded.email,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token'); // Remove invalid token
        window.location.href = '/login'; // Redirect to login if token is invalid
      }
    } else {
      window.location.href = '/login'; // Redirect if no token found
    }
  }, []);

  return currentUser;
}
