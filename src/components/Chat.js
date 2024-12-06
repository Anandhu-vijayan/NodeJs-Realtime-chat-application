import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from '../axios';
import Notification from './Notification';
import ChatView from './ChatView';
import { io } from 'socket.io-client';
import { FriendRequestContext } from '../context/FriendRequestContext';

const socket = io('http://localhost:3000');

const ChatHomePage = () => {
  const { acceptedRequests } = useContext(FriendRequestContext);
  const [activeTab, setActiveTab] = useState('chat');
  const currentUser = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const [chat, setChat] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

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
    else if (activeTab === 'chat') {
      const fetchChat = async () => {
        if (!currentUser) return;
        setLoading(true); // Set loading to true
        try {
          const response = await axios.get('/chat', {
            params: { sender_id: currentUser.user_id },
          });
          setChat(response.data);
        } catch (err) {
          setErrorMessage('Error fetching users.');
        } finally {
          setLoading(false); // Ensure loading is false after completion
        }
      };
      fetchChat();
    }
  }, [activeTab, currentUser]); // Now no missing dependency

  useEffect(() => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        acceptedRequests.includes(person.user_id)
          ? { ...person, request_status: 'Accepted' }
          : person
      )
    );
  }, [acceptedRequests]);

  useEffect(() => {
    // ...
    socket.on('friendRequestAccepted', (userId) => {
      setPeople((prevPeople) => {
        const updatedPeople = prevPeople.map((person) => {
          if (person.user_id === userId) {
            return { ...person, request_status: 'Accepted' };
          }
          return person;
        });
        return updatedPeople;
      });
    });

    // ...
  });

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
              ? { ...person, request_status: 'accepted' }
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
      {loading ? (
        // Loading spinner
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4zm2 5.292V12H4a8 8 0 008 8v-1.708z"
            ></path>
          </svg>
        </div>
      ) : chat.length > 0 ? (
        // Show chat list if data exists
        <ul className="space-y-4">
          {chat.map((person) => (
            <li
              key={person.user_id}
              onClick={() => setSelectedChat(person)}
              className="cursor-pointer hover:bg-gray-100 p-4 bg-white shadow rounded-lg"
            >
              <div className="flex items-center">
                <img
                  src={`http://localhost:3000/uploads/${person.profile_pic}`}
                  alt={person.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <span>{person.name}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // Only show "No contacts available" when loading is false and no data
        <div>No contacts available.</div>
      )}
    </div>
  );

  const PeopleList = () => (
    <div className="people-list">
      <h2 className="text-gray-800 font-bold mb-4">Connect Peoples</h2>
      {loading && <div>Loading...</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <ul className="space-y-4">
        {people.length > 0 ? (
          people.map((person) => (
            <li
              key={person.user_id}
              className={`people-item p-4 bg-white shadow rounded-lg ${person.request_status === 'accepted' ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
              onClick={() => {
                if (person.request_status === 'accepted') {
                  setSelectedChat(person); // Set the selected chat
                }
              }}
            >
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the list item click from triggering
                          handleRequestClick(person);
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the list item click from triggering
                          handleAcceptClick(person);
                        }}
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Accept</span>
                      </button>
                    )}

                    {person.request_status !== 'Send Request' &&
                      person.request_status !== 'Accept' && (
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
      <div className="left-container bg-customBlue-100 w-1/4 p-4 h-screen overflow-y-auto">
        <div className="tabs flex justify-around items-center mb-4">
          <button
            className={`tab-button ${activeTab === 'chat' ? 'bg-customGreen-100 text-white' : 'bg-white text-gray-800'} py-2 px-4 rounded-full`}
            onClick={() => setActiveTab('chat')}
          >
            Chats
          </button>
          <button
            className={`tab-button ${activeTab === 'people' ? 'bg-customGreen-100 text-white' : 'bg-white text-gray-800'} py-2 px-4 rounded-full`}
            onClick={() => setActiveTab('people')}
          >
            Invite
          </button>
          <Notification
            showRequests={showRequests}
            setShowRequests={setShowRequests}
            setActiveTab={setActiveTab}  // Pass setActiveTab as a prop
          />

        </div>
        {activeTab === 'people' ? <PeopleList /> : <ChatList />}
      </div>
      <ChatView selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

    </div>
  );
};

export default ChatHomePage;
