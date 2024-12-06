// FriendRequestContext.js
import React, { createContext, useState } from 'react';

export const FriendRequestContext = createContext();

export const FriendRequestProvider = ({ children }) => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  const addAcceptedRequest = (userId) => {
    setAcceptedRequests((prev) => [...prev, userId]);
  };

  return (
    <FriendRequestContext.Provider value={{ acceptedRequests, addAcceptedRequest }}>
      {children}
    </FriendRequestContext.Provider>
  );
};
