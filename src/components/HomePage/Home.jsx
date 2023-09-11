import React, { useState } from 'react';
import { FiActivity, FiMenu, FiX } from 'react-icons/fi';
import '../Header.css';
import { Link , useNavigate  } from 'react-router-dom';
import './Home.css'
import liff from '@line/liff';


function Home() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogout = () => {
    try {
      liff.logout();
      localStorage.removeItem('isLoggedIn'); // Clear the login status from local storage
      navigate('/');
      console.log('clicked logout'); // Navigate to the login page or any other desired page
    } catch (error) {
      console.log(error);
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
    
                UserProfile
                <FiActivity />
           
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
              <li className="menu-link">
                <a onClick={handleLogout}>LOG OUT</a>
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
