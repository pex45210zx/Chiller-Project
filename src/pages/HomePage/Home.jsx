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
  
    // Check if a chiller was selected
    if (!selectedChillerName) {
      // You may want to clear or reset your Chiller Details here
      return;
    }
  
    try {
      const chillerData = await fetchChillerData();
  
      if (chillerData === null) {
        return; // Handle the error or exit if necessary
      }
  
      // Find the selected chiller by its name
      const selectedChiller = chillerData.find((chiller) => chiller.chillerName === selectedChillerName);
  
      if (selectedChiller) {
        // Now you can access the data from columns C, D, E, F, G
        const chillerDetails = {
          chillerName: selectedChiller.chillerName,
          chillerMode: selectedChiller.chillerMode,
          highTemp: selectedChiller.highTemp,
          lowTemp: selectedChiller.lowTemp,
          currentTemp: selectedChiller.currentTemp,
        };
  
        // You can do something with the chillerDetails data here, such as displaying it in your component
        console.log(chillerDetails);
  
        // Ensure that the state is updated when a chiller is selected
        setSelectedChiller(chillerDetails);
      } else {
        console.error('Selected chiller not found in the spreadsheet');
      }
    } catch (error) {
      // Handle any network or other errors
      console.error('An error occurred:', error);
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
        <div className="chiller-details">
          {selectedChiller && (
            <div>
              <h2>Chiller Details</h2>
              <p><strong>Chiller Name:</strong> {selectedChiller.chillerName}</p>
              <p><strong>Chiller Mode:</strong> {selectedChiller.chillerMode}</p>
              <p><strong>High Temperature:</strong> {selectedChiller.highTemp}</p>
              <p><strong>Low Temperature:</strong> {selectedChiller.lowTemp}</p>
              <p><strong>Current Temperature:</strong> {selectedChiller.currentTemp}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;