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
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleClick = () => {
    setClick(!click);
  };

  const handleChillerHighTemp = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 20 && value <= 35) {
      setHighTemp(value);
      setIsHighTempFilled(true);
    } else {
      setHighTemp('');
      setIsHighTempFilled(false);
    }
  };

  const handleChillerLowTemp = (e) => {
    const value = parseFloat(e.target.value);
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
    setChillerSelected(!!selectedChiller);
  }, [selectedChiller]);

  useEffect(() => {
    setModeSelected(!!selectedMode);
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
    setHighTemp('');
    setLowTemp('');
  };

  const handleModeChange = (e) => {
    setSelectedMode(e.target.value);
    switch (e.target.value) {
      case 'Freshwater fish':
        setHighTemp('30');
        setLowTemp('28');
        setIsHighTempFilled(true);
        setIsLowTempFilled(true);
        break;
      case 'Marine fish':
        setHighTemp('28');
        setLowTemp('27');
        setIsHighTempFilled(true);
        setIsLowTempFilled(true);
        break;
      case 'Coral Reef tank':
        setHighTemp('26');
        setLowTemp('25');
        setIsHighTempFilled(true);
        setIsLowTempFilled(true);
        break;
      case 'Aquatic plant':
        setHighTemp('26');
        setLowTemp('25');
        setIsHighTempFilled(true);
        setIsLowTempFilled(true);
        break;
      default:
        setHighTemp('');
        setLowTemp('');
        setIsHighTempFilled(false);
        setIsLowTempFilled(false);
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
      setModalMessage('Please select a chiller.');
      setIsModalOpen(true);
      return;
    }

    if (!modeSelected) {
      setModalMessage('Please select a chiller mode.');
      setIsModalOpen(true);
      return;
    }

    if (!isHighTempFilled || !isLowTempFilled) {
      setModalMessage('Please enter both high and low temperatures.');
      setIsModalOpen(true);
      return;
    }

    if (parseInt(chillerHighTemp) < parseInt(chillerLowTemp)) {
      setModalMessage('High temperature must be greater than low temperature.');
      setIsModalOpen(true);
      return;
    }

    const { userId } = getProfileData();

    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller && chiller.userId === userId
    );

    if (!selectedChillerObj) {
      setModalMessage('Chiller not found for the selected user.');
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch(
        `https://api.sheety.co/313ba156926928db7871fc95577d36d9/projectChillerData/data/${selectedChillerObj.id}`,
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
    setIsModalOpen(false);
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
          <div className="chiller-dropdown1">
            <label htmlFor="chiller-select">Select your chiller:</label>
            <div className="selection-area-ch">
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
            <div className="selection-area-ch">
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
          <div className="description-ch">Enter your high and low temp to control temperature
            when temperature = high temp chiller will stop and when  temperature = low temp chiller will start work</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-container">
                <input
                  className='textfield'
                  type="number"
                  placeholder="Set high temperature"
                  value={chillerHighTemp.toString()}
                  onChange={handleChillerHighTemp}
                  step="0.1"
                  min="20"
                  max="35"
                />
                <div className="side-text">High temp</div>
              </div>
            </div>
            <div className="form-group">
              <div className="input-container">
                <input
                  className='textfield'
                  type="number" 
                  placeholder="Set low temperature"
                  value={chillerLowTemp.toString()}
                  onChange={handleChillerLowTemp}
                  step="0.1" 
                  min="20"
                  max="35" 
                />
                <div className="side-text">Low temp</div>
              </div>
            </div>
            <div className="button-area">
              <button className='button-submit' type="submit">Submit Setting</button>
            </div>
          </form>
        </div>
      </div>
      <ModalPopUp isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
}

export default YourChiller;
