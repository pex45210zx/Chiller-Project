import React, { useState } from 'react';
import '../Header.css';
import { useNavigate } from 'react-router-dom';
import './YourChiller.css'
import { getProfileData } from '../localStorageUtils';
import liff from '@line/liff';
import Header from '../header';

function YourChiller() {
  const [click, setClick] = useState(false);
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

  return (
    <div className="header">
      <Header
        click={click}
        handleClick={handleClick}
        profilePicture={profilePicture}
        displayName={displayName}
        handleLogout={handleLogout}
      />
      <div className="bodyChiller">
        <h1>YourChillerpage</h1>
      </div>
    </div>
  );
}

export default YourChiller
  ;
