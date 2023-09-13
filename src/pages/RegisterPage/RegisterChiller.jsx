import React, { useState, useEffect } from 'react';
import '../Header.css';
import { useNavigate } from 'react-router-dom';
import './RegisterChiller.css';
import liff from '@line/liff';
import { getProfileData } from '../localStorageUtils';
import Header from '../header';

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
  
    // Check if chillerId and chillerName are not empty
    if (!chillerId || !chillerName) {
      alert("Chiller ID and Chiller Name are required");
      return;
    }
  
    try {
      // Fetch data from the Sheety API
      const response = await fetch('https://api.sheety.co/313ba156926928db7871fc95577d36d9/chillerRegister/data');
      if (!response.ok) {
        throw new Error('Failed to fetch data from Sheety API');
      }
      const data = await response.json();
  
      // Find the row with the matching chillerId
      const chillerRow = data.find((row) => row.chillerId === chillerId);
  
      if (chillerRow) {
        // Update the chillerName in column C
        chillerRow.chillerName = chillerName;
  
        // Prepare the data to be sent back to the Google Sheet
        const updatedData = {
          data: data,
        };
  
        // Update the data in the Google Sheet
        const updateResponse = await fetch('https://api.sheety.co/313ba156926928db7871fc95577d36d9/chillerRegister/data', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
  
        if (updateResponse.ok) {
          alert(`Chiller Name updated successfully for Chiller ID: ${chillerId}`);
        } else {
          throw new Error('Failed to update Chiller Name');
        }
      } else {
        alert(`Chiller ID ${chillerId} not found in the spreadsheet`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while processing your request');
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
