import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import authService from '../services/authService';

const Chat = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const socket = io('http://your-server-url', {
        auth: { token },
      });
      setSocket(socket);

      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const handleSendMessage = () => {
    if (newMessage) {
      socket.emit('message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Enter message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Chat;