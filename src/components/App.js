import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import ForgotPassword from './components/ForgotPass';
import "./styles/output.css";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/forgotpass" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
