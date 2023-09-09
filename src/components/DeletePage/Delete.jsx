import React, { useState } from 'react';
import { FiActivity, FiMenu, FiX } from 'react-icons/fi';
import '../Header.css';
import { Link } from 'react-router-dom';
import './Delete.css'

function Delete() {
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
              <Link to="/">HOME</Link>
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
                <a>LOG OUT</a>
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
