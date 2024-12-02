import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from '../axios';
import Notification from './Notification';

const ChatHomePage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const currentUser = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    if (activeTab === 'people') {
      const fetchUsers = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
          const response = await axios.get('/users', {
            params: { sender_id: currentUser.user_id },
          });
          setPeople(response.data);
        } catch (err) {
          setErrorMessage('Error fetching users.');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab, currentUser]); // Now no missing dependency
  

  const handleRequestClick = async (recipient) => {
    try {
      const response = await axios.post('/send-request', {
        sender_id: currentUser.user_id,
        recipient_id: recipient.user_id,
      });

      if (response.status === 200) {
        setSuccessMessage(`Request sent to ${recipient.name}`);
        const newStatus = response.data.request_status || 'Request Sent';
        setPeople((prevPeople) =>
          prevPeople.map((person) =>
            person.user_id === recipient.user_id
              ? { ...person, request_status: newStatus }
              : person
          )
        );
      } else if (response.status === 400) {
        setSuccessMessage(`Request already sent to ${recipient.name}`);
      } else {
        setSuccessMessage(`Unexpected response: ${response.data.message}`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Something went wrong!';
      setErrorMessage(errorMsg);
    } finally {
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 2000);
    }
  };

  const handleAcceptClick = async (recipient) => {
    try {
      const response = await axios.post('./accept-request', {
        sender_id: recipient.user_id, // The original sender of the request
        recipient_id: currentUser.user_id, // The current user accepting the request
      });
  
      if (response.status === 200) {
        setSuccessMessage(`Friend request from ${recipient.name} accepted!`);
  
        // Update the UI to reflect the accepted status
        setPeople((prevPeople) =>
          prevPeople.map((person) =>
            person.user_id === recipient.user_id
              ? { ...person, request_status: 'Accepted' }
              : person
          )
        );
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to accept the request.';
      setErrorMessage(errorMsg);
    } finally {
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 2000);
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

  const PeopleList = () => (
    <div className="people-list">
      {loading && <div>Loading...</div>}
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
                  {person.request_status === 'Send Request' && (
                    <button
                      onClick={() => handleRequestClick(person)}
                      className="flex items-center focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-blue-500 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12L3.27 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5"
                        />
                      </svg>
                      <span className="text-gray-500">Send Request</span>
                    </button>
                  )}
                
                  {person.request_status === 'Accept' && (
                    <button
                      onClick={() => handleAcceptClick(person)}
                      className="flex items-center focus:outline-none bg-green-500 text-white px-3 py-1 rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Accept</span>
                    </button>
                  )}
                
                  {person.request_status !== 'Send Request' && person.request_status !== 'Accept' && (
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

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="whatsapp-container flex h-screen">
      <div className="left-container bg-gray-100 w-1/4 p-4">
        <div className="tabs flex justify-around items-center mb-4">
          <button
            className={`tab-button ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} py-2 px-4 rounded-full`}
            onClick={() => setActiveTab('chat')}
          >
            Chats
          </button>
          <button
            className={`tab-button ${activeTab === 'people' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} py-2 px-4 rounded-full`}
            onClick={() => setActiveTab('people')}
          >
            Invite
          </button>
          <Notification showRequests={showRequests} setShowRequests={setShowRequests} />
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
