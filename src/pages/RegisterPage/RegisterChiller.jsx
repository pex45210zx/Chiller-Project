import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './RegisterChiller.css';
import liff from '@line/liff';
import { getProfileData } from '../../components/localStorageUtils';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';

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
  
    const { userId } = getProfileData(); // Retrieve the userId from localStorage

    if (!chillerName.trim()) {
      console.error('Chiller name cannot be empty');
      return;
    }
  
    try {
      // Fetch the data from the Sheety API using the function
      const chillerData = await fetchChillerData();
  
      if (chillerData === null) {
        return; // Exit the function if there was an error
      }
  
      // Check if the chillerId exists in the spreadsheet
      const matchingChiller = chillerData.find((row) => row.chillerId === chillerId);
  
      if (matchingChiller) {
        // Check if the provided userId matches the one registered with the chillerId
        if (!matchingChiller.userId || matchingChiller.userId === userId || matchingChiller.userId === 'null' || matchingChiller.userId === '') {
          // Check if the chillerName is already used by the current userId
          const isNameUsedByCurrentUser = chillerData.some((row) => row.userId === userId && row.chillerName === chillerName);
  
          if (isNameUsedByCurrentUser) {
            console.error('This Chiller name is already used by you');
            return; // Exit the function to prevent submission
          }
  
          // Proceed with the data insertion/update
        } else {
          console.error('This Chiller is already registered with a different userId');
          return; // Exit the function to prevent submission
        }
  
        // Update the chillerName and userId in the corresponding row
        matchingChiller.chillerName = chillerName;
        matchingChiller.userId = userId; // Add this line
  
        // Send a PUT request to update the row in the Sheety API
        try {
          const response = await fetch(`https://api.sheety.co/49d0c21a5626a3a181f1ba24be577500/chillerRegister/data/${matchingChiller.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ datum: matchingChiller }), // Use the correct property name 'datum'
          });
  
          if (response.ok) {
            // Data was successfully updated
            console.log('Chiller data updated successfully');
          } else {
            // Handle the error and log the response content
            console.error('Failed to update chiller data', response.status, await response.text());
          }
        } catch (error) {
          // Handle any network or other errors
          console.error('An error occurred:', error);
        }
      } else {
        console.error('Chiller ID not found in the spreadsheet');
      }
  
      // Optionally, you can clear the input fields after a successful update or when chiller ID is not found
      setChillerId('');
      setChillerName('');
    } catch (error) {
      // Handle any network or other errors
      console.error('An error occurred:', error);
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
        <h1>Register Your Chiller here7</h1>
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
