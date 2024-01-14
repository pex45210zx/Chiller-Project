import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import liff from '@line/liff';
import { getProfileData } from '../../components/localStorageUtils';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';
import { FaBell } from "react-icons/fa";


function Home() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [chillerOptions, setChillerOptions] = useState([]);
  const [selectedChiller, setSelectedChiller] = useState(''); // State to track selected chiller
  const [notificationOn, setNotificationOn] = useState(false);
  const sliderTextOnClass = notificationOn ? 'slider-text-on' : '';
  const sliderTextOffClass = notificationOn ? '' : 'slider-text-off';

  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { userId } = getProfileData();

      const chillerData = await fetchChillerData();
      console.log(chillerData);

      // Filter chillers for the current user
      const filteredChillers = chillerData.filter((chiller) => chiller.userId === userId);

      // Set all user's chillers in chillerOptions
      setChillerOptions(filteredChillers);

      // If there are any chillers, select the first one by default
      if (filteredChillers.length > 0) {
        setSelectedChiller(filteredChillers[0].chillerName);
      }
    }

    fetchData();
  }, []);

  // Function to fetch updated chiller data and update temperature
  const fetchUpdatedChillerData = async () => {
    try {
      const { userId } = getProfileData();
      const updatedChillerData = await fetchChillerData();
  
      const filteredChillers = updatedChillerData.filter(chiller => chiller.userId === userId);
      setChillerOptions(filteredChillers);
  
      const chillerStillExists = filteredChillers.some(chiller => chiller.chillerName === selectedChiller);
      if (!chillerStillExists && filteredChillers.length > 0) {
        setSelectedChiller(filteredChillers[0].chillerName);
      }
  
      // Check if the selected chiller's notificationStatus is 'on' or not and set notificationOn state
      const selectedChillerData = filteredChillers.find(chiller => chiller.chillerName === selectedChiller);
      if (selectedChillerData && selectedChillerData.notificationStatus === 'on') {
        setNotificationOn(true);
      } else {
        setNotificationOn(false);
      }
    } catch (error) {
      console.error('Error fetching updated chiller data:', error);
    }
  };  

  // Function to periodically fetch updated data (adjust the interval as needed)
  useEffect(() => {
    const interval = setInterval(fetchUpdatedChillerData, 1000); // Fetch data every minute
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [selectedChiller]); // Add selectedChiller to the dependencies to update when it changes

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogout = () => {
    liff.logout();
    navigate('/');
    console.log('clicked logout');
  };

  // Function to handle chiller selection from the dropdown
  const handleChillerChange = (e) => {
    setSelectedChiller(e.target.value);
  };

  const toggleNotification = async () => {
    setNotificationOn((prev) => !prev);
    const { userId } = getProfileData();
  
    // Find the chiller object based on selectedChiller and userId
    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller && chiller.userId === userId
    );
  
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
              notificationStatus: notificationOn ? 'on' : 'off',
            },
          }),
        }
      );
  
      if (!response.ok) {
        console.error('Failed to update notification status in the spreadsheet');
      }
    } catch (error) {
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
        <div className="body-con">
          <div className="homepage-title">
            Homepage
          </div>
          <div className="description-home">Please select your chiller to monitor its status</div>
          <div className="chiller-dropdown">
            <label className="chiller-select">Select your chiller</label>
            <div className="selection-area">
              <select id="chiller-select" value={selectedChiller} onChange={handleChillerChange}>
                {chillerOptions.map((chiller) => (
                  <option key={chiller.id} value={chiller.chillerName}>
                    {chiller.chillerName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="chiller-details">
            <div className="notification-toggle">
              <label className="switch">
                <div className="noti-area">
                  <div className="emoji-noti">
                    <FaBell className='FaBell-icon' />
                  </div>
                  <input type="checkbox" onChange={toggleNotification} checked={notificationOn} />
                  <span className="slider">
                    <span className={`slider-text-on ${sliderTextOnClass}`}>On</span>
                    <span className={`slider-text-off ${sliderTextOffClass}`}>Off</span>
                  </span>
                </div>
              </label>
            </div>
            <div className="chiller-con">
              {chillerOptions.map((chiller) => (
                <div key={chiller.id} style={{ display: chiller.chillerName === selectedChiller ? 'block' : 'none', width: '100%' }}>
                  <div className="details-con">
                    <div className="chiller-name-con">
                      <div className="chiller-name">{chiller.chillerName}</div>
                    </div>
                    <div className="temperature-container">
                      <div className="temperature-column">
                        <p>
                          <strong className='status-current'>Current Temperature</strong>
                          {chiller.currentTemp ? (
                            <div className="current-output">{chiller.currentTemp}°</div>
                          ) : (
                            <div className="current-output"></div>
                          )}
                        </p>
                      </div>
                      <div className="temperature-side-display">
                        <div className="temperature-mode">
                          <p>
                            <strong className='status-mode'>Using mode :
                              {chiller.chillerMode ? (
                                <div className="mode-output">{chiller.chillerMode}</div>
                              ) : (
                                <div className="mode-output"></div>
                              )}
                            </strong>
                          </p>
                        </div>
                        <div className="temperature-set">
                          <p>
                            <strong className='topic-status'>High Temperature</strong>
                            {chiller.highTemp ? (
                              <div className="status-output">{chiller.highTemp}°</div>
                            ) : (
                              <div className="status-output"></div>
                            )}
                          </p>
                          <p>
                            <strong className='topic-status'>Low Temperature</strong>
                            {chiller.lowTemp ? (
                              <div className="status-output">{chiller.lowTemp}°</div>
                            ) : (
                              <div className="status-output"></div>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
