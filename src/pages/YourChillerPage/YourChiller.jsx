import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './YourChiller.css';
import { getProfileData } from '../../components/localStorageUtils';
import liff from '@line/liff';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi'; // Import your fetchChillerData function

function YourChiller() {
  const [click, setClick] = useState(false);
  const [chillerOptions, setChillerOptions] = useState([]); // State to store chiller options
  const [selectedChiller, setSelectedChiller] = useState(''); // State to store the selected chiller
  const [selectedMode, setSelectedMode] = useState(''); // State to store the selected chiller mode
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

  useEffect(() => {
    async function fetchData() {
      const { userId } = getProfileData(); // Retrieve the userId from localStorage

      // Fetch the chiller data from the spreadsheet
      const chillerData = await fetchChillerData();

      // Filter chiller options where userId matches
      const filteredChillers = chillerData.filter((chiller) => chiller.userId === userId);

      // Set the filtered chiller options in state
      setChillerOptions(filteredChillers);
    }

    fetchData();
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleChillerChange = (e) => {
    setSelectedChiller(e.target.value);
  };

  const handleModeChange = (e) => {
    setSelectedMode(e.target.value);
  };

  const modeOptions = [
    'Freshwater fish',
    'Marine fish',
    'Coral Reef tank',
    'Aquatic plant',
    'Customize',
  ];

  return (
    <div className="header">
      <Header
        click={click}
        handleClick={handleClick}
        profilePicture={profilePicture}
        displayName={displayName}
        handleLogout={handleLogout}
      />
      <div className="bodyChiller">
        <h1>Your Chiller Page</h1>
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
        <div className="mode-dropdown">
          <label htmlFor="mode-select">Select chiller mode:</label>
          <select id="mode-select" value={selectedMode} onChange={handleModeChange}>
            <option value="">Select chiller mode</option>
            {modeOptions.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default YourChiller;
