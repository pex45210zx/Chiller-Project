import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/HomePage/Home.jsx';
import RegisterChiller from './components/RegisterPage/RegisterChiller.jsx';
import YourChiller from './components/YourChillerPage/YourChiller.jsx';
import Delete from './components/DeletePage/Delete.jsx';
import LiffLogin from './components/LiffLogin.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home user={{ profilePicture: '' }} />} // Pass an empty profilePicture initially
        />
        <Route path="/register-chiller" element={<RegisterChiller />} />
        <Route path="/your-chiller" element={<YourChiller />} />
        <Route path="/delete" element={<Delete />} />
      </Routes>
    </>
  );
}

export default App;
