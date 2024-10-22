import React from 'react';
import { useNavigate } from 'react-router-dom';


// import axios from 'axios';
const HomePage = () => {
    const navigate = useNavigate();
    return (

        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-customPurple-500 to-customPurple-700">
            <div className="flex items-center justify-between w-full max-w-6xl p-4">

                {/* Left side with the image */}
                <div className="w-1/2 flex justify-center h-[100%] w-[800px]">
                    <img
                        src="/images/homeImage.webp"
                        alt="Illustration"
                        className="object-contain w-3/4 h-auto"
                    />
                </div>

                {/* Right side with buttons */}
                <div className="w-1/2 bg-white rounded-lg p-8 shadow-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="bg-customTeal-500 text-white px-4 py-2 rounded-md hover:bg-customTeal-600 transition"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>

                        <button
                            className="bg-customBlack-500 text-white px-4 py-2 rounded-md hover:bg-customTeal-600 transition"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default HomePage;
