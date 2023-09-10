import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import '../Header.css';
import { Link } from 'react-router-dom';
import './Home.css'
import LiffLogin from '../LiffLogin';
import liff from '@line/liff'; // Import the LIFF SDK

function Home() {
  const [click, setClick] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogin = async () => {
    if (liff.isLoggedIn()) {
      const user = await liff.getProfile();
      setUserProfile(user);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    if (liff.isLoggedIn()) {
      await liff.logout(); // Log out the Line user
      setIsLoggedIn(false); // Update login status
    }
  };


  return (
    <div className="header">
      <div className="container">
        <div className="header-con">
          <div className="toggle-menu" onClick={handleClick}>
            {click ? <FiX /> : <FiMenu />}
          </div>
          <div className="user-profile">
            {userProfile ? (
              <>
                <img src={userProfile.pictureUrl} alt="User Profile" />
                <span>{userProfile.displayName}</span>
              </>
            ) : (
              <LiffLogin onLogin={handleLogin} />
            )}
          </div>
          <div className={`menu-container ${click ? 'active' : ''}`}>
            <ul className="menu">
              <li className="menu-link">
                <Link to="/">HOME</Link>
              </li>
              <li className="menu-link">
                <Link to="/register-chiller">REGISTER CHILLER</Link>
              </li>
              <li className="menu-link">
                <Link to="/your-chiller">YOUR CHILLER</Link>
              </li>
              <li className="menu-link">
                <Link to="/delete">DELETE CHILLER</Link>
              </li>
              <li className="menu-link">
                <Link to="/" onClick={handleLogout}>LOG OUT</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bodyHome">
        <h1>Homepage</h1>
      </div>
    </div>
  );
}

export default Home;
