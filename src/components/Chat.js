import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from '../axios';

const ChatHomePage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const currentUser = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState([]);

  if (!currentUser) return <div>Loading...</div>;

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleNotificationClick = () => setShowRequests(!showRequests);
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get('/friend-requests', {
        params: { userId: currentUser.user_id },
      });
      setFriendRequests(response.data);
    } catch (error) {
      setErrorMessage('Errors fetching friend requests.');
    }
  };
  const ChatList = () => (
    <div className="chat-list">
      <h2 className="text-gray-800 font-bold mb-4">Your Chats</h2>
      <ul className="space-y-4">
        <li className="chat-item p-4 bg-white shadow rounded-lg">Chat 1</li>
        <li className="chat-item p-4 bg-white shadow rounded-lg">Chat 2</li>
        <li className="chat-item p-4 bg-white shadow rounded-lg">Chat 3</li>
      </ul>
    </div>
  );

  const PeopleList = () => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users', {
          params: { sender_id: currentUser.user_id }
        });
        setPeople(response.data);
      } catch (err) {
        setErrorMessage('Error fetching users.');
      }
    };

    

    // Friend requests fetches only once when the component mounts
    useEffect(() => {
      fetchUsers();
      fetchFriendRequests(); // Fetch requests only on the first render
      setLoading(false);
    }, []); // Empty dependency array ensures it only runs on mount


    const handleRequestClick = async (recipient) => {
      try {
        const response = await axios.post('/send-request', {
          sender_id: currentUser.user_id,
          recipient_id: recipient.user_id,
        });

        if (response.status === 200) {
          setSuccessMessage(`Request sent to ${recipient.name}`);
        } else if (response.status === 400) {
          setSuccessMessage(`Request already sent to ${recipient.name}`);
        } else {
          setSuccessMessage(`Unexpected response: ${response.data.message}`);
        }
        setTimeout(() => setSuccessMessage(''), 2000);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Something went wrong!';
        setErrorMessage(errorMsg);
        setTimeout(() => setErrorMessage(''), 2000);
      }
    };

    if (loading) return <div>Loading...</div>;
    if (errorMessage) return <div>{errorMessage}</div>;

    return (
      <div className="people-list">
        <h2 className="text-gray-800 font-bold mb-4">Your Contacts</h2>
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <ul className="space-y-4">
          {people.length > 0 ? (
            people.map((person) => (
              <li key={person.user_id} className="people-item p-4 bg-white shadow rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={`http://localhost:3000/uploads/${person.profile_pic}`}
                      alt={person.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <span>{person.name}</span>
                  </div>
                  {person.user_id !== currentUser.user_id && (
                    <div className="flex items-center">
                      {person.request_status === null ? (
                        <button onClick={() => handleRequestClick(person)} className="flex items-center focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.27 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
                          </svg>
                          <span className="text-gray-500">Send Request</span>
                        </button>
                      ) : (
                        <span className="text-gray-500">{person.request_status}</span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li>No contacts available.</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="whatsapp-container flex h-screen">
      <div className="left-container bg-gray-100 w-1/4 p-4">
        <div className="tabs flex justify-around items-center mb-4">
          <button
            className={`tab-button ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} py-2 px-4 rounded-full`}
            onClick={() => handleTabChange('chat')}
          >
            Chats
          </button>
          <button
            className={`tab-button ${activeTab === 'people' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} py-2 px-4 rounded-full`}
            onClick={() => handleTabChange('people')}
          >
            Invite
          </button>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-800 cursor-pointer"
              onClick={handleNotificationClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22c1.104 0 2-.896 2-2H10c0 1.104.896 2 2 2zm6-6V10a6 6 0 10-12 0v6l-2 2v1h16v-1l-2-2z"
              />
            </svg>

            {friendRequests.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}

            {showRequests && (
              <div className="absolute bg-white border border-gray-300 rounded-lg p-8 left-20 mt-2 w-96 shadow-lg">
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
                      <li key={person.user_id} className="people-item p-4 bg-white shadow rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={`http://localhost:3000/uploads/${person.profile_pic}`}
                              alt={person.name}
                              className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                            <span>{person.name}</span>
                            
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
        </div>
        {activeTab === 'chat' ? <ChatList /> : <PeopleList />}
      </div>
      <div className="right-container flex-1 bg-white p-8">
        <h2 className="text-gray-600">Select a chat or person to start the conversation</h2>
      </div>
    </div>
  );
};

export default ChatHomePage;
