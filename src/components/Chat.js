import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from '../axios';

const ChatHomePage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const currentUser = useAuth(); // Get current user from the hook
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // console.log("Current User:", currentUser);

  if (!currentUser) return <div>Loading...</div>; // Wait for user data

  const handleTabChange = (tab) => setActiveTab(tab);

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
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('/users');
          setPeople(response.data);
          setLoading(false);
        } catch (err) {
          setError('Error fetching users.');
          setLoading(false);
        }
      };
      fetchUsers();
    }, []);

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
    
        // Clear success message after 2 seconds
        setTimeout(() => setSuccessMessage(''), 2000);
    
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Something went wrong!';
        setErrorMessage(errorMsg);
    
        // Clear error message after 2 seconds
        setTimeout(() => setErrorMessage(''), 2000);
        console.error('Failed to send request:', errorMsg);
      }
    };
    


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
      <div className="people-list">
        <h2 className="text-gray-800 font-bold mb-4">Your Contacts</h2>
        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div> // Display success message
        )}
        {errorMessage && (
          <div className="text-green-500 mb-4">{errorMessage}</div> // Display success message
        )}
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
                      <button onClick={() => handleRequestClick(person)} className="flex items-center focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.27 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
                        </svg>
                        <span className="text-gray-500">Request Sent</span>
                      </button>
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
