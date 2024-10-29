import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import ForgotPass from './components/ForgotPass';
import Home from './components/Home';
import Chat from './components/Chat';
import Notification from './components/Notification';
import "./styles/output.css";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/forgotpass" element={<ForgotPass />} /> 
        <Route path="/dashboard" element={<Home />} />
        <Route path="/next-page" element={<Chat />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </Router>
  );
};

export default App;
