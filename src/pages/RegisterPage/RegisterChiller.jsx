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
