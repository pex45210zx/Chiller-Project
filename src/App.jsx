import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/HomePage/Home.jsx';
import RegisterChiller from './components/RegisterPage/RegisterChiller.jsx';
import YourChiller from './components/YourChillerPage/YourChiller.jsx';
import Delete from './components/DeletePage/Delete.jsx';

function App() {
  return (
    <Router>
      <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-chiller" element={<RegisterChiller />} />
        <Route path="/your-chiller" element={<YourChiller />} />
        <Route path="/delete" element={<Delete />} />
      </Routes>
      </>
    </Router>
  );
}

export default App;
