// src/context/FriendRequestContext.js

import React, { createContext, useContext, useState } from 'react';

const FriendRequestContext = createContext();

export const FriendRequestProvider = ({ children }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [people, setPeople] = useState([]);

  const updatePeopleStatus = (userId, newStatus) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.user_id === userId ? { ...person, request_status: newStatus } : person
      )
    );
  };

  return (
    <FriendRequestContext.Provider
      value={{ friendRequests, setFriendRequests, people, setPeople, updatePeopleStatus }}
    >
      {children}
    </FriendRequestContext.Provider>
  );
};

export const useFriendRequest = () => {
  const context = useContext(FriendRequestContext);
  if (!context) {
    throw new Error('useFriendRequest must be used within a FriendRequestProvider');
  }
  return context;
};
