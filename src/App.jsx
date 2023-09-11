import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LiffLogin from './components/LineLIFFPage/LiffLogin.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LiffLogin />} />
      </Routes>
    </>
  );
}

export default App;
