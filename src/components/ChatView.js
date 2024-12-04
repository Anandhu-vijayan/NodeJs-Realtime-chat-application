import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io("http://localhost:3000");

const ChatView = ({ selectedChat, setSelectedChat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const currentUser = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            sender_id: currentUser.user_id,
            recipient_id: selectedChat.user_id,
            text: newMessage,
            timestamp: new Date().toISOString(),
        };

        socket.emit('sendMessage', message);
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage('');
        scrollToBottom();
    };

    useEffect(() => {
        if (currentUser) {
            socket.emit('joinRoom', currentUser.user_id);
        }
    }, [currentUser]);

    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            if (data.recipient_id === currentUser.user_id) {
                setMessages((prevMessages) => [...prevMessages, data]);
                scrollToBottom();
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [currentUser]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                try {
                    const response = await axios.get(`/api/messages`, {
                        params: {
                            sender_id: currentUser.user_id,
                            recipient_id: selectedChat.user_id,
                        },
                    });
                    setMessages(response.data);
                    scrollToBottom();
                } catch (err) {
                    console.error('Error fetching messages:', err);
                }
            }
        };

        fetchMessages();
    }, [selectedChat, currentUser?.user_id]);

    return (
        <div className="chat-view flex-1 bg-customBlack-100 flex flex-col">
            {selectedChat ? (
                <>
                    <header className="flex items-center justify-between border-b p-4 bg-customBlack-100">
                        <div className="flex items-center ">
                            <img
                                src={`http://localhost:3000/uploads/${selectedChat.profile_pic}`}
                                alt={selectedChat.name}
                                className="w-10 h-10 rounded-full object-cover mr-4"
                            />
                            <h2 className="text-lg font-semibold text-white">{selectedChat.name}</h2>
                        </div>
                        <button
                            onClick={() => setSelectedChat(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Close
                        </button>
                    </header>
                    <div className="messages flex flex-col gap-4 p-4 overflow-y-auto h-full ">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words mr-16 ml-16 ${message.sender_id === currentUser.user_id
                                        ? 'bg-chatBot-100 text-white self-end'
                                        : 'bg-chatBot-200 text-gray-800 self-start'
                                    }`}
                            >
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <footer className="border-t p-16 bg-customBlack-100 flex justify-center">
                        <form onSubmit={handleSendMessage} className="flex w-3/4 relative">
                            <input
                                type="text"
                                placeholder="Type a message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 border bg-customBlue-100 border-customBlue-100 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-black-200 pr-10 text-white"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>

                            </button>
                        </form>
                    </footer>
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-600">
                    Select a chat or person to start the conversation
                </div>
            )}
        </div>
    );
};

export default ChatView;
