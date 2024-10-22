import React, { useState } from 'react';
import axios from '../axios';
import "../styles/output.css"; // Ensure Tailwind is set up correctly

const ForgotPassword = () => {
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format.');
            return false;
        }
        setEmailError('');
        return true;
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

    const handleSignup = async () => {
        setEmailError('');
        setPasswordError('');
        setErrorMessage('');
        setSuccessMessage('');

        const isEmailValid = validateEmail(emailId);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        try {
            const response = await axios.post('/signup', { emailId, password });
            if (response.data.message === 'Email Already Exists') {
                setEmailError('Email already exists. Please log in.');
            } else {
                setSuccessMessage('OTP sent successfully to email');
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error sending OTP:', error.response ? error.response.data : error.message);
            setErrorMessage('Failed to send OTP. Please try again.');
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-customPurple-500 to-customPurple-700">
            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
                <input
                    type="text"
                    placeholder="Email"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${emailError ? 'border-red-500' : ''}`}
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                <div className="mb-5"></div>
                <input
                    type="password"
                    placeholder="New Password"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordError ? 'border-red-500' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={handleSignup}
                >
                    Submit
                </button>
                <div className="mb-5"></div>
                <p className="text-red-500">{errorMessage}</p>
                <p className="text-green-500">{successMessage}</p>
            </div>
        </div>
    );
};

export default ForgotPassword;
