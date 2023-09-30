// Header.jsx
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import './Header.css';
import { Link } from 'react-router-dom';
import logo from '../images/logo2.png'

function Header({ click, handleClick, profilePicture, displayName, handleLogout }) {
  return (
    <div className="container">
      <div className="header-con">
        <div className="toggle-menu" onClick={handleClick}>
          {click ? <FiX /> : <FiMenu />}
        </div>
        <div className="user-profile">
          <img src={profilePicture} alt="User Profile" />
          <span>{displayName}</span>
        </div>
        <div className="flex-container">
          <img src={logo} alt="aquatic Logo" className="logo" />
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
                <Link to="/delete">DELETE CHILLER</Link>
              </li>
            <li className="menu-link-logout">
              <a onClick={handleLogout}>LOG OUT</a>
            </li>
          </ul>
        </div>
      </div >
    </div >
  );
}

export default Header;
