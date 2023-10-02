import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './YourChiller.css';
import { getProfileData } from '../../components/localStorageUtils';
import liff from '@line/liff';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';
import ModalPopUp from '../../components/modalPopUp';

function YourChiller() {
  const [click, setClick] = useState(false);
  const [chillerOptions, setChillerOptions] = useState([]);
  const [selectedChiller, setSelectedChiller] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [chillerHighTemp, setHighTemp] = useState('');
  const [chillerLowTemp, setLowTemp] = useState('');
  const [isHighTempFilled, setIsHighTempFilled] = useState(false);
  const [isLowTempFilled, setIsLowTempFilled] = useState(false);
  const [modeSelected, setModeSelected] = useState(false);
  const [chillerSelected, setChillerSelected] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal




  const handleClick = () => {
    setClick(!click);
  };

  const handleChillerHighTemp = (e) => {
    const value = parseInt(e.target.value, 10); // Parse input as an integer
    if (!isNaN(value) && value >= 20 && value <= 35) {
      setHighTemp(value);
      setIsHighTempFilled(true);
    } else {
      setHighTemp('');
      setIsHighTempFilled(false);
    }
  };

  const handleChillerLowTemp = (e) => {
    const value = parseInt(e.target.value, 10); // Parse input as an integer
    if (!isNaN(value) && value >= 20 && value <= 35) {
      setLowTemp(value);
      setIsLowTempFilled(true);
    } else {
      setLowTemp('');
      setIsLowTempFilled(false);
    }
  };


  const handleLogout = () => {
    liff.logout();
    navigate('/');
    console.log('clicked logout');
  };

  useEffect(() => {
    setChillerSelected(!!selectedChiller); // Set chillerSelected to true if selectedChiller is not empty
  }, [selectedChiller]);

  useEffect(() => {
    setModeSelected(!!selectedMode); // Set modeSelected to true if selectedMode is not empty
  }, [selectedMode]);

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

    if (!chillerSelected) {
      setModalMessage('Please select a chiller.'); // Show an error message for chiller selection
      setIsModalOpen(true);
      return;
    }

    if (!modeSelected) {
      setModalMessage('Please select a chiller mode.'); // Show an error message
      setIsModalOpen(true);
      return;
    }

    if (!isHighTempFilled || !isLowTempFilled) {
      setModalMessage('Please enter both high and low temperatures.');
      setIsModalOpen(true);
      return;
    }

    // Add a check to ensure high temperature is not less than low temperature
    if (parseInt(chillerHighTemp) < parseInt(chillerLowTemp)) {
      setModalMessage('High temperature must be greater than low temperature.');
      setIsModalOpen(true);
      return;
    }

    const { userId } = getProfileData();

    // Find the chiller object based on selectedChiller and userId
    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller && chiller.userId === userId
    );

    if (!selectedChillerObj) {
      setModalMessage('Chiller not found for the selected user.');
      setIsModalOpen(true);
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
        setModalMessage('Chiller data updated successfully.');
        setIsModalOpen(true);
      } else {
        console.error('Failed to update chiller data', response.status, await response.text());
        setModalMessage('Failed to update chiller data.');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
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
          <div className="yourChiller-title">Your Chiller Page</div>
          <div className="chiller-dropdown">
            <label htmlFor="chiller-select">Select your chiller:</label>
            <div className="selection-area">
              <select id="chiller-select" value={selectedChiller} onChange={handleChillerChange}>
                <option value="">Select a chiller</option>
                {chillerOptions.map((chiller) => (
                  <option key={chiller.id} value={chiller.chillerName}>
                    {chiller.chillerName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mode-dropdown">
            <label htmlFor="mode-select">Select chiller mode:</label>
            <div className="selection-area">
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className='textfield'
                type="number" // Set the input type to number
                placeholder="Set high temperature"
                value={chillerHighTemp}
                onChange={handleChillerHighTemp}
                min="20" // Set the minimum value
                max="35" // Set the maximum value
              />
            </div>
            <div className="form-group">
              <input
                className='textfield'
                type="number" // Set the input type to number
                placeholder="Set low temperature"
                value={chillerLowTemp}
                onChange={handleChillerLowTemp}
                min="20" // Set the minimum value
                max="35" // Set the maximum value
              />
            </div>
            <button className='button-submit' type="submit">Submit Setting</button>
          </form>
        </div>
      </div>
      {/* Render the custom modal */}
      <ModalPopUp isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
}

export default YourChiller;
