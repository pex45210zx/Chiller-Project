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
  const [selectedChiller, setSelectedChiller] = useState('');
  const [notificationOn, setNotificationOn] = useState(false);
  const sliderTextOnClass = notificationOn ? 'slider-text-on' : '';
  const sliderTextOffClass = notificationOn ? '' : 'slider-text-off';

  useEffect(() => {
    async function fetchData() {
      const { userId } = getProfileData();

      const chillerData = await fetchChillerData();
      console.log(chillerData);
      const filteredChillers = chillerData.filter((chiller) => chiller.userId === userId);

      setChillerOptions(filteredChillers);

      if (filteredChillers.length > 0) {
        setSelectedChiller(filteredChillers[0].chillerName);
      }

      const selectedChillerData = filteredChillers.find(chiller => chiller.chillerName === selectedChiller);
      if (selectedChillerData && selectedChillerData.notificationStatus === 'on') {
        setNotificationOn(true);
      } else {
        setNotificationOn(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchNotificationStatus() {
      const { userId } = getProfileData();

      const selectedChillerObj = chillerOptions.find(
        (chiller) => chiller.chillerName === selectedChiller && chiller.userId === userId
      );

      if (!selectedChillerObj) {
        console.error('Selected chiller object not found.');
        return;
      }

      try {
        const response = await fetch(
          `https://api.sheety.co/313ba156926928db7871fc95577d36d9/projectChillerData/data/${selectedChillerObj.id}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch chiller data');
        }

        const chillerData = await response.json();
        const { notificationStatus } = chillerData.datum;

        setNotificationOn(notificationStatus === 'on');
      } catch (error) {
        console.error('Error fetching chiller data:', error);
        setNotificationOn(false);
      }
    }

    fetchNotificationStatus();
  }, [selectedChiller]);

  const toggleNotification = async () => {
    const { userId } = getProfileData();

    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller && chiller.userId === userId
    );

    if (!selectedChillerObj) {
      console.error('Selected chiller object not found.');
      return;
    }

    try {
      setNotificationOn((prev) => !prev);

      const response = await fetch(
        `https://api.sheety.co/313ba156926928db7871fc95577d36d9/projectChillerData/data/${selectedChillerObj.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            datum: {
              notificationStatus: !notificationOn ? 'on' : 'off',
            },
          }),
        }
      );

      if (response.ok) {
        console.log('Notification status updated successfully.');
      } else {
        console.error('Failed to update notification status in the spreadsheet');
        setNotificationOn((prev) => !prev);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setNotificationOn((prev) => !prev);
    }
  };

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
    } catch (error) {
      console.error('Error fetching updated chiller data:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchUpdatedChillerData, 500);
    return () => clearInterval(interval);
  }, [selectedChiller]);

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogout = () => {
    liff.logout();
    navigate('/');
    console.log('clicked logout');
  };

  const handleChillerChange = (e) => {
    setSelectedChiller(e.target.value);
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
