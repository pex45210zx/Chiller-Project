// Header.jsx
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaHome, FaPenSquare, FaTrashAlt, FaSignOutAlt, FaSlidersH } from 'react-icons/fa';
import './Header.css';
import { Link } from 'react-router-dom';
import logo from '../images/logo2.png';
import liff from '@line/liff';
import { useNavigate } from 'react-router-dom';

function Header({ click, handleClick, profilePicture, displayName, }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear session or authentication tokens
      // You may need to adapt this to your specific authentication mechanism
      // Example: Clearing local storage or session storage
      localStorage.removeItem('profileData'); // Assuming you store profile data in localStorage

      // Log out using Line API
      await liff.logout();

      // Redirect to the login page
      navigate('/liffLogout');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  
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
        {/* <div className="flex-container">
          <img src={logo} alt="aquatic Logo" className="logo1" />
        </div> */}
        <div className={`menu-container ${click ? 'active' : ''}`}>
          <ul className="menu">
            <div className="logo1-area">
              <div className="flex-container">
                <img src={logo} alt="aqua Logo" className="logo1" />
                <div className="brand-name">Aquatic Chiller</div>
              </div>
            </div>
            <li className="menu-link">
              <Link className="menu-button" to="/home">
                <div className="icon"><FaHome /></div>HOME</Link>
            </li>
            <li className="menu-link">
              <Link className="menu-button" to="/register-chiller">
                <div className="icon"><FaPenSquare /></div>REGISTER CHILLER</Link>
            </li>
            <li className="menu-link">
              <Link className="menu-button" to="/your-chiller">
                <div className="icon"><FaSlidersH /></div>YOUR CHILLER</Link>
            </li>
            <li className="menu-link">
              <Link className="menu-button" to="/delete">
                <div className="icon"><FaTrashAlt /></div>DELETE CHILLER</Link>
            </li>
            <li className="menu-link-logout">
              <a className="logout-link" onClick={handleLogout}>
                <div className="icon"><FaSignOutAlt /></div>LOG OUT</a>
            </li>
          </ul>

        </div>
      </div >
    </div >
  );
}

export default Header;
