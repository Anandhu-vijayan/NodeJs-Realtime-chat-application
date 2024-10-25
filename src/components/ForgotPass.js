import React, { useState } from 'react';
import axios from '../axios';
import "../styles/output.css"; // Ensure Tailwind is set up correctly
import Modal from './Modal';
const LoginForm = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\s]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters long, contain one uppercase letter, one number, and no spaces.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    setErrorMessage(''); // Clear previous error message

    // Validate email
    if (!validateEmail(emailId)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      return;
    }

    // Check if passwords match
    if (password !== repassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true); // Set loading state

    try {
      const response = await axios.post('/forgot', { emailId, password, repassword });
      console.log('Password reset successful:', response.data);
      setModalMessage(response.data.message);
      setShowModal(true);
      
    } catch (error) {
      console.error('Error resetting password:', error);
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      setErrorMessage(message);
    } 
    finally {
      setLoading(false); // Reset loading state
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    window.location.href = '/login'; // Redirect to login page after modal close
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-customPurple-500 to-customPurple-700">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Reset Password</h2>
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
              if (errorMessage || passwordError) {
                setErrorMessage('');
                setPasswordError(''); // Clear errors on input change
              }
            }}
          />
          <input
            type="password"
            placeholder="Re-Enter Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={repassword}
            onChange={(e) => {
              setRePassword(e.target.value);
              if (errorMessage || passwordError) {
                setErrorMessage('');
                setPasswordError(''); // Clear errors on input change
              }
            }}
          />
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleLogin}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
          {passwordError && (
            <p className="text-red-500 text-center mt-4">{passwordError}</p>
          )}
           {showModal && (
          <Modal message={modalMessage} onClose={handleCloseModal} />
        )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
