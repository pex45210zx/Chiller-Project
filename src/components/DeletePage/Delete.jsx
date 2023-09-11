import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import '../Header.css';
import { Link, useNavigate } from 'react-router-dom';
import './Delete.css'
import { getProfileData } from '../localStorageUtils';
import liff from '@line/liff';


function Delete() {
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
      <div className="container">
        <div className="header-con">
          <div className="toggle-menu" onClick={handleClick}>
            {click ? <FiX /> : <FiMenu />}
          </div>
          <div className="user-profile">
            <img src={profilePicture} alt="User Profile" />
            <span>{displayName}</span>
          </div>
          <div className={`menu-container ${click ? 'active' : ''}`}>
            <ul className="menu">
              <li className="menu-link">
                <Link to="/home">HOME</Link>
              </li>
              <li className="menu-link">
                <Link to="/register-chiller">REGISTER CHILLER</Link>
              </li>
              <li className="menu-link">
                <Link to="/your-chiller">YOUR CHILLER</Link>
              </li>
              <li className="menu-link">
                <Link>DELETE CHILLER</Link>
              </li>
              <li className="menu-link">
                <a onClick={handleLogout}>LOG OUT</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bodydelete">
        <h1>Deletepage</h1>
      </div>
    </div>
  );
}

export default Delete;
