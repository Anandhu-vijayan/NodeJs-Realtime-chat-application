import React, { useState, useEffect } from 'react';
import axios from '../axios';

const SignUpForm = () => {
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpInputDisabled, setIsOtpInputDisabled] = useState(false); // State to control OTP input field
    const [timer, setTimer] = useState(0);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for loading animation

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

    useEffect(() => {
        let interval = null;
        if (isOtpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && isOtpSent) {
            clearInterval(interval);
            setIsResendEnabled(true);
            setIsOtpInputDisabled(true);  // Disable OTP input after the timer reaches 0
        }
        return () => clearInterval(interval);
    }, [isOtpSent, timer]);

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
        setIsLoading(true);

        try {
            const response = await axios.post('/signup', { emailId });
            if (response.data.message === 'Email Already Exists') {
                setEmailError('Email already exists. Please log in.');
            } else {
                setSuccessMessage('OTP sent successfully to email');
                setIsOtpSent(true);
                setTimer(30);  // Start the 30-second timer
                setIsResendEnabled(false);
                setIsOtpInputDisabled(false);  // Enable OTP input after sending OTP

                // Clear the success message after 5 seconds
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error sending OTP:', error.response ? error.response.data : error.message);
            setErrorMessage('Failed to send OTP. Please try again.');

            // Clear the error message after 5 seconds
            setTimeout(() => setErrorMessage(''), 5000);
        }
        finally {
            setIsLoading(false); // Hide loader
        }
    };

    const handleResendOtp = async () => {
        try {
          const response = await axios.post('/resend_otp', { emailId });
          console.log('Response from server:', response.data);
          setSuccessMessage('OTP sent successfully to email');
          setTimer(30); // Restart the 30-second timer
          setIsResendEnabled(false);
          setIsOtpInputDisabled(false);
      
          setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
          console.error('Error resending OTP:', error.response ? error.response.data : error.message);
          setErrorMessage(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
      
          setTimeout(() => setErrorMessage(''), 5000);
        }
      };
      

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('/verify-otp', { emailId, otp, password });
            console.log('OTP verified successfully:', response.data);
            sessionStorage.setItem('token', response.data.token);
            setIsModalVisible(true);
            // window.location.href = '/login';
        } catch (error) {
            console.log('Received request to verify OTP:', emailId, otp);
            console.error('Error verifying OTP:', error);
            setErrorMessage('Invalid OTP. Please try again.');

            setTimeout(() => setErrorMessage(''), 5000);
        }
    };
    const closeModal = () => {
        setIsModalVisible(false);
        window.location.href = '/login'; // Redirect to login after closing the modal
    };
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-customPurple-500 to-customPurple-700">
            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <input
                    type="text"
                    placeholder="Email"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${emailError ? 'border-red-500' : ''}`}
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                // disabled={isOtpSent}
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                <div className="mb-5"></div>
                <input
                    type="password"
                    placeholder="Password"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordError ? 'border-red-500' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                // disabled={isOtpSent}
                />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                <div className="mb-5"></div>
                <button
                    className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md flex justify-center items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        }`}
                    onClick={handleSignup}
                    disabled={isOtpSent || isLoading}  // Disable button after OTP is sent
                >
                    {isLoading ? (
                        <div className="loader"></div> // Add the class for your loading spinner
                    ) : (
                        isOtpSent ? 'OTP Sent' : 'Send OTP'
                    )}
                </button>
                <div className="mb-5"></div>

                {isOtpSent && (
                    <>
                        <input
                            type="text"
                            placeholder="OTP"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={isOtpInputDisabled}  // Disable OTP input based on timer
                        />
                        <div className="mb-5"></div>

                        <button
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={handleVerifyOtp}
                            disabled={isOtpInputDisabled}  // Disable verification when input is disabled
                        >
                            Verify OTP
                        </button>
                        <div className="mt-6 text-center">
                            <p className='flex justify-center'><a href='/login' >🙅‍♂️Have an Account? Login</a></p>
                        </div>

                        {isResendEnabled && (
                            <button
                                className="w-full text-blue-500 px-4 py-2 rounded-md hover:underline"
                                onClick={handleResendOtp}
                            >
                                Resend OTP
                            </button>
                        )}
                    </>
                )}

                <div className="mb-5"></div>
                <p className="text-red-500">{errorMessage}</p>
                <p className="text-green-500">{successMessage}</p>

                {isOtpSent && <p className="text-gray-500">Time left: {timer}s</p>}
            </div>
            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
                        <p className="text-gray-700 mb-6">You have been successfully registered. Please log in to continue.</p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={closeModal}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default SignUpForm;
