import React, { useState } from 'react';
import { FiActivity, FiMenu, FiX } from 'react-icons/fi';
import '../Header.css';
import { Link , useNavigate} from 'react-router-dom';
import './Home.css'
import liff from '@line/liff'; // Import the Line Liff SDK
import '../LiffLogin';

function Home() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(''); // Store profile picture

  // const handleLogout = async () => {
  //   try {
  //     await liff.logout();
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('Line Liff logout error:', error);
  //   }
  // };

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
        UserProfile <img src={profilePicture} alt="Profile" />
        <FiActivity />
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
               <a href="#">LOG OUT</a>
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
