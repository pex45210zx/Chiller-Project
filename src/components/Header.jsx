import React, { useState } from 'react'
import { FiActivity, FiMenu,FiX } from "react-icons/fi";


function Header() {
    const [click, setClick] = useState(false);
    const handleClick =() => setClick(!click);
    const closeMobileMenu =() => setClick(false);
    
  return (
    <div className="header">
      <div className="container">
        <div className="header-con">
          <div className="profile-pic">
            <a href="#">UserPicture <FiActivity/> </a>
          </div>
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

          <div className="mobile-menu"></div>
        </div>
      </div>
      
    </div>
  )
}

export default Header