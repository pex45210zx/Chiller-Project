import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './YourChiller.css';
import { getProfileData } from '../../components/localStorageUtils';
import liff from '@line/liff';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';

function YourChiller() {
  const [click, setClick] = useState(false);
  const [chillerOptions, setChillerOptions] = useState([]);
  const [selectedChiller, setSelectedChiller] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [chillerHighTemp, setHighTemp] = useState('');
  const [chillerLowTemp, setLowTemp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = () => {
    setClick(!click);
  };

  const handleChillerHighTemp = (e) => {
    setHighTemp(e.target.value);
  };

  const handleChillerLowTemp = (e) => {
    setLowTemp(e.target.value);
  };

  const handleLogout = () => {
    liff.logout();
    navigate('/');
    console.log('clicked logout');
  };

  useEffect(() => {
    async function fetchData() {
      const { userId } = getProfileData();

      const chillerData = await fetchChillerData();

      const filteredChillers = chillerData.filter((chiller) => chiller.userId === userId);

      setChillerOptions(filteredChillers);
    }

    fetchData();
  }, []);

  const handleChillerChange = (e) => {
    setSelectedChiller(e.target.value);
    // Reset temperature values when the chiller is changed
    setHighTemp('');
    setLowTemp('');
  };

  const handleModeChange = (e) => {
    setSelectedMode(e.target.value);
    // Set default temperature values based on the selected mode
    switch (e.target.value) {
      case 'Freshwater fish':
        setHighTemp('30');
        setLowTemp('28');
        break;
      case 'Marine fish':
        // Set default values for other modes
        // Add cases for other modes if needed
        break;
      // Add cases for other modes if needed
      default:
        setHighTemp('');
        setLowTemp('');
    }
  };

  const modeOptions = [
    'Freshwater fish',
    'Marine fish',
    'Coral Reef tank',
    'Aquatic plant',
    'Customize',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the selected mode is 'Customize' and validate temperature inputs
    if (selectedMode === 'Customize' && (!chillerHighTemp || !chillerLowTemp)) {
      setErrorMessage('Please enter both high and low temperatures.');
      return;
    }

    // Add a check to ensure high temperature is not less than low temperature
    if (parseInt(chillerHighTemp) < parseInt(chillerLowTemp)) {
      setErrorMessage('High temperature must be greater than low temperature.');
      return;
    }

    const { userId } = getProfileData();

    // Find the chiller object based on selectedChiller and userId
    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller && chiller.userId === userId
    );

    if (!selectedChillerObj) {
      setErrorMessage('Chiller not found for the selected user.');
      return;
    }

    // Update the chiller data in the spreadsheet
    try {
      const response = await fetch(
        `https://api.sheety.co/49d0c21a5626a3a181f1ba24be577500/chillerRegister/data/${selectedChillerObj.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            datum: {
              chillerMode: selectedMode,
              highTemp: chillerHighTemp,
              lowTemp: chillerLowTemp,
            },
          }),
        }
      );

      if (response.ok) {
        console.log('Chiller data updated successfully');
        setErrorMessage('Chiller data updated successfully.');
      } else {
        console.error('Failed to update chiller data', response.status, await response.text());
        setErrorMessage('Failed to update chiller data.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An error occurred while updating chiller data.');
    }
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
      <div className="bodyChiller">
        <div className="body-con">
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Set high temperature"
                value={chillerHighTemp}
                onChange={handleChillerHighTemp}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Set low temperature"
                value={chillerLowTemp}
                onChange={handleChillerLowTemp}
              />
            </div>
            <button type="submit">Submit Setting</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default YourChiller;
