import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import liff from '@line/liff';
import { getProfileData } from '../../components/localStorageUtils';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';


function Home() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [chillerOptions, setChillerOptions] = useState([]);
  const [selectedChiller, setSelectedChiller] = useState('');

  useEffect(() => {
    async function fetchData() {
      const { userId } = getProfileData();

      const chillerData = await fetchChillerData();
      console.log(chillerData);

      const filteredChillers = chillerData.filter((chiller) => chiller.userId === userId);

      setChillerOptions(filteredChillers);
    }

    fetchData();
  }, []);

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogout = () => {
    liff.logout();
    navigate('/');
    console.log('clicked logout');
  };

  const handleChillerChange = async (e) => {
    const selectedChillerName = e.target.value;
    setSelectedChiller(selectedChillerName);
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
      <div className="bodyHome">
        <h1>Homepage</h1>
        <div className="chiller-dropdown">
          <label htmlFor="chiller-select">Select your chiller:</label>
          <select id="chiller-select" value={selectedChiller} onChange={handleChillerChange}>
            <option value="">Select a chiller</option>
            {chillerOptions.map((chiller) => (
              <option key={chiller.id} value={chiller.chillerName}>
                {chiller.chillerName}
              </option>
            ))}
          </select>
        </div>
        <div className="chiller-status">

        </div>
      </div>
    </div>
  );
}

export default Home;