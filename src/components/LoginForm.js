import React, { useState } from 'react';
import axios from '../axios';
import "../styles/output.css"; // Ensure Tailwind is set up correctly
import { Link } from 'react-router-dom';


const LoginForm = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrorMessage(''); // Clear previous error message
    if (!validateEmail(emailId)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true); // Set loading state

    try {
      // Send a request to your backend API for login
      const response = await axios.post('/login', { emailId, password });
      console.log('Login successful:', response.data);
      const token = response.data.token; // Assuming the token is in response.data.token
      const joinFlag=response.data.jFlag;
      localStorage.setItem('token', token);
      if(joinFlag === 1)
      {
      window.location.href = '/next-page';

      }else{
      window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error logging in:', error);
      const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
      setErrorMessage(message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-customPurple-500 to-customPurple-700">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorMessage ? 'border-red-500' : ''}`}
            value={emailId}
            onChange={(e) => {
              setEmailId(e.target.value);
              if (errorMessage) setErrorMessage(''); // Clear error on input change
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage(''); // Clear error on input change
            }}
          />
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleLogin}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="mb-5"></div>
          <p className='flex justify-center'><a href='/signup'>🙅‍♂️Don't Have an Account? SignUp</a></p>
          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </div>
        <div className="mt-6 text-center">
        <Link to='/forgotpass' className="text-blue-500 hover:underline">🔑Forgot Password❓</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
