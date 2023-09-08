// Header.jsx
import React, { useState } from 'react';
import { FiActivity, FiMenu, FiX } from 'react-icons/fi';
import './Home.css';

function Header() {
  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click);
  };

  return (
    <div className="header">
      <div className="container">
        <div className="header-con">
          <div className="toggle-menu" onClick={handleClick}>
            {click ? <FiX /> : <FiMenu />}
          </div>
          <div className="user-profile">
            <a href="#">
              <FiActivity />
              UserPicture
            </a>
          </div>
          <div className={`menu-container ${click ? 'active' : ''}`}>
            <ul className="menu">
              <li className="menu-link">
                <a href="#">HOME</a>
              </li>
              <li className="menu-link">
                <a href="#">REGISTER CHILLER</a>
              </li>
              <li className="menu-link">
                <a href="#">YOUR CHILLER</a>
              </li>
              <li className="menu-link">
                <a href="#">DELETE CHILLER</a>
              </li>
              <li className="menu-link">
                <a href="#">LOG OUT</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
