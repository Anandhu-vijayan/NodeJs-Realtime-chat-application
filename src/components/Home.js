import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // assuming axios instance is properly set up

const WelcomePage = () => {
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Retrieve the token from sessionStorage
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const validateToken = async (token) => {
        try {
          // Make API call to verify token
          const response = await axios.post('/verify-token', { token });
          console.log('Token verification response:', response.data); // Debugging log
          if (response.data.valid) {
            setName(response.data.user.name); // assuming the API returns user details
            setProfilePic(response.data.user.profilePic); // Set user data like name or profile picture
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          console.error('Token validation error:', error); // Log the error
          setAuthError('Invalid or expired session, please login again.');
          sessionStorage.removeItem('token');
          navigate('/login');
        } finally {
          setLoading(false);
        }
      };
      validateToken(storedToken);
    } else {
      // Redirect to login if token is missing
      navigate('/login');
    }
  }, [navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
      setProfilePic(file);
    }
  };

  const handleNext = async () => {
    if (!name || !profilePic) {
      alert('Please enter your name and upload a profile picture before proceeding.');
      return; // Exit the function if validation fails
    }

    try {
      const formData = new FormData();
      formData.append('name', name); // Append name to formData
      formData.append('profileImage', profilePic); // Append the profile picture file to formData

      // Debugging log to check the formData entries
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Make an API call to save the name and image
      const response = await axios.post('/save-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Pass the token for authorization
        },
      });

      console.log('Profile saved successfully:', response.data);
      // Navigate to the next page or show success message
      navigate('/next-page'); // Replace with the actual path for the next page
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving your profile. Please try again.');
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (authError) {
    return <div>{authError}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-white-500 to-white-700">
      {token ? (
        <div className="flex-1 flex justify-center items-center">
          <img
            src="/images/chat.gif" // Replace with your image URL
            alt="Welcome"
            className="rounded-lg w-3/4 max-w-md"
          />
        </div>
      ) : (
        <p>Authentication Failed</p>
      )}

      <div className="flex-1 flex flex-col justify-center items-center bg-cyan-800 rounded-l-lg p-8 shadow-lg ">
        <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-black-600 mb-4">Hey there! 👋</h2>

          <div className="w-full space-y-4">
            {/* Name Input */}
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Profile Picture Upload */}
            <h6 className="text-1sm font-bold text-center text-black-600 mb-4">Upload Profile Pic</h6>
            <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
              <img
                src={avatarImage || profilePic || "/images/avatarjpeg.jpeg"}
                alt=""
                className="w-full h-full object-cover"
              />
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-700 text-white rounded-full px-3 py-2"
                onClick={() => document.getElementById('avatar-input').click()}
              >
                +
              </button>
            </div>

            {/* Next Button */}
            <button
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
              onClick={handleNext}
            >
              Next ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
