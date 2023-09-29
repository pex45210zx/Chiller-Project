import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage/Home.jsx';
import RegisterChiller from './pages/RegisterPage/RegisterChiller.jsx';
import YourChiller from './pages/YourChillerPage/YourChiller.jsx';
import Delete from './pages/DeletePage/Delete.jsx'
import LiffLogin from './components/LiffLogin.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LiffLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register-chiller" element={<RegisterChiller />} />
        <Route path="/your-chiller" element={<YourChiller />} />
        <Route path="/delete" element={<Delete />} />
      </Routes>
    </>
  );
}

export default App;
