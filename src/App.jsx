import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import Home from './components/Home.jsx';
import RegisterChiller from './components/RegisterChiller.jsx';

function App() {
  return (
    <Router>
      <>
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/" element={<Home />} />
          <Route path="/register-chiller" element={<RegisterChiller />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
