import React, { useState, useEffect } from 'react';
import '../Header.css';
import { useNavigate } from 'react-router-dom';
import './RegisterChiller.css';
import liff from '@line/liff';
import { getProfileData } from '../localStorageUtils';
import Header from '../header';
import { loadSpreadsheetData, saveDataToGoogleSheet } from '../googleSheetsAPI.jsx';

function RegisterChiller() {
  const [click, setClick] = useState(false);
  const [chillerId, setChillerId] = useState('');
  const [chillerName, setChillerName] = useState('');
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogout = () => {
    liff.logout();
    navigate('/');
    console.log('clicked logout');
  };

  const handleChillerIdChange = (e) => {
    setChillerId(e.target.value);
  };

  const handleChillerNameChange = (e) => {
    setChillerName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userId } = getProfileData();

    try {
      // Load data from Google Spreadsheet
      const spreadsheetData = await loadSpreadsheetData();

      // Find a match for the entered Chiller ID
      const match = spreadsheetData.find((row) => row.ChillerID === chillerId);

      if (match) {
        // If a match is found, update the Chiller Name and User ID in the spreadsheet
        const updatedData = spreadsheetData.map((row) => {
          if (row.ChillerID === chillerId) {
            row.ChillerName = chillerName; // Update Chiller Name
            row.UserID = userId; // Replace 'userId' with the actual user ID
          }
          return row;
        });

        // Save the updated data back to the Google Spreadsheet
        await saveDataToGoogleSheet(updatedData);

        // Optionally, navigate to another page or show a success message
        console.log('Chiller ID is correct. Registration successful.');
        navigate('/register-chiller');
      } else {
        // If no match is found, display an error message
        console.log('Chiller ID is incorrect. Please check and try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="header">
      <Header
        click={click}
        handleClick={handleClick}
        profilePicture={profilePicture}
        displayName={displayName}
        handleLogout={handleLogout}
      />
      <div className="bodyregisterCL">
        <h1>Register Chiller</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your chiller ID"
              value={chillerId}
              onChange={handleChillerIdChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your chiller name"
              value={chillerName}
              onChange={handleChillerNameChange}
            />
          </div>
          <button type="submit">Register Chiller</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterChiller;
