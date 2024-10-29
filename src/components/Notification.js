// Notification.js
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../hooks/useAuth';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to your Socket.IO server

const Notification = ({ showRequests, setShowRequests }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const currentUser = useAuth();

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get('/friend-requests', {
                params: { userId: currentUser.user_id },
            });
            setFriendRequests(response.data);
        } catch (error) {
            console.error("Error fetching friend requests:", error);
            setErrorMessage('Errors fetching friend requests.');
        }
    };

    const acceptRequestClick = async (recipient) => {
        // Accept request logic here...
    };

    useEffect(() => {
        // Fetch friend requests on component mount and when currentUser changes
        if (currentUser && currentUser.user_id) {
            fetchFriendRequests();
        }

        // Listen for incoming notifications about friend requests
        socket.on('notificationReceived', (newRequest) => {
            setFriendRequests((prevRequests) => [...prevRequests, newRequest]);
        });

        return () => {
            // Clean up the event listener on component unmount
            socket.off('notificationReceived');
        };
    }, );

    return (
        <div className="relative">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-800 cursor-pointer"
                onClick={() => setShowRequests(!showRequests)}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c1.104 0 2-.896 2-2H10c0 1.104.896 2 2 2zm6-6V10a6 6 0 10-12 0v6l-2 2v1h16v-1l-2-2z" />
            </svg>

            {friendRequests.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {friendRequests.length}
                </span>
            )}

            {showRequests && (
                <div className="absolute bg-white border border-gray-300 rounded-lg p-8 left-20 mt-4 w-96 shadow-lg">
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-700">Friend Requests</h4>
                        <button onClick={() => setShowRequests(false)} className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {friendRequests.length > 0 ? (
                        <ul className="space-y-4">
                            {friendRequests.map((person) => (
                                <li key={person.user_id} className="people-item p-4 bg-white shadow rounded-lg w-150">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img src={`http://localhost:3000/uploads/${person.profile_pic}`} alt={person.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                                            <span>{person.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <button onClick={() => acceptRequestClick(person)} className="flex items-center focus:outline-none bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg ml-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2 h-2 mr-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No new friend requests</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
