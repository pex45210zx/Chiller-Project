import React from 'react';
import ReactDOM from 'react-dom'; // Use the regular react-dom import
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/Chiller-Project'>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
