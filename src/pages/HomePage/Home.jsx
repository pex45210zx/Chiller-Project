import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import liff from '@line/liff';
import { getProfileData } from '../../components/localStorageUtils';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';
import LineChart from '../../components/LineChart';

function Home() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [chillerOptions, setChillerOptions] = useState([]);
  const [selectedChiller, setSelectedChiller] = useState('');
  const [chillerId, setChillerId] = useState(''); // Track selected chillerId
  const [chartData, setChartData] = useState({ labels: [], datasets: [] }); // Data for the chart

  useEffect(() => {
    async function fetchData() {
      const { userId } = getProfileData();

      const chillerData = await fetchChillerData();

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

  const handleChillerChange = (e) => {
    const selectedChillerName = e.target.value;
    setSelectedChiller(selectedChillerName);

    // Find the chillerId based on the selected chiller name
    const selectedChillerData = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChillerName
    );

    if (selectedChillerData) {
      const chillerId = selectedChillerData.chillerId;
      setChillerId(chillerId);

      // Fetch data for the selected chillerId from Google Sheets API
      fetchChillerDataFromGoogleSheets(chillerId);
    } else {
      // Reset chart data if no chiller is selected
      setChartData({ labels: [], datasets: [] });
    }
  };

  // Function to fetch chiller data from Google Sheets API based on chillerId
  const fetchChillerDataFromGoogleSheets = async (chillerId) => {
    try {
      // Make a request to your Google Sheets API endpoint with chillerId
      // Replace 'YOUR_API_ENDPOINT' with the actual endpoint
      const response = await fetch(`https://api.sheety.co/313ba156926928db7871fc95577d36d9/chillerRegister/data?chillerId=${chillerId}`);

      if (!response.ok) {
        console.error('Failed to fetch chiller data', response.status, await response.text());
        return;
      }

      const responseData = await response.json();
      // Parse the response data and prepare it for the line chart
      const parsedData = parseChillerData(responseData);
      setChartData(parsedData);
    } catch (error) {
      console.error('An error occurred while fetching chiller data:', error);
    }
  };

  // Function to parse chiller data and prepare it for the line chart
  const parseChillerData = (data) => {
    // Implement parsing logic here based on your data structure
    // Create an object with 'labels' and 'datasets' properties
    // 'labels' should contain an array of timestamps, and 'datasets' should contain temperature data
    // Format your data according to the format expected by the LineChart component

    const labels = []; // Array of timestamps
    const temperatureData = []; // Array of temperature values

    // Implement the logic to extract data from 'data' and populate 'labels' and 'temperatureData' arrays

    return {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatureData,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 2,
          fill: false,
        },
      ],
    };
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
      </div>
      <div className="line-chart">
        <LineChart chartData={chartData} />
      </div>
    </div>
  );
}

export default Home;
