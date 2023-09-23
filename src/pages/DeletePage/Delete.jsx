import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './Delete.css';
import { getProfileData } from '../../components/localStorageUtils';
import liff from '@line/liff';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';

function Delete() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [chillerOptions, setChillerOptions] = useState([]);
  const [selectedChiller, setSelectedChiller] = useState('');
  const [chillerDelete, setChillerDelete] = useState('');
  const [chillerIdMismatch, setChillerIdMismatch] = useState(false);

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
    setSelectedChiller(e.target.value);
    // Reset temperature values when the chiller is changed
  };

  const handleChillerDelete = async (e) => {
    setChillerDelete(e.target.value);
    setChillerIdMismatch(false); // Reset chiller ID mismatch error when input changes
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    // Ensure chillerDelete is not empty
    if (!chillerDelete) {
      console.log('Chiller ID is required.');
      return;
    }

    // Find the selected chiller by name
    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller
    );

    if (!selectedChillerObj) {
      console.log('Chiller not found.');
      return;
    }

    // Check if the entered chillerDelete matches the chillerId of the selected chiller
    if (chillerDelete !== selectedChillerObj.chillerId) {
      setChillerIdMismatch(true); // Set chiller ID mismatch error
      return;
    }

    // Define the data to be updated (set columns B to F to empty)
    const updatedData = {
      userId: '',      // Update this to the empty value you want for userId (B)
      chillerName: '', // Update this to the empty value you want for chillerName (C)
      chillerMode: '', // Update this to the empty value you want for chillerMode (D)
      highTemp: '',    // Update this to the empty value you want for highTemp (E)
      lowTemp: '',     // Update this to the empty value you want for lowTemp (F)
    };


    try {
      const chillerIdToUpdate = selectedChillerObj.id; // Use the ID field here

      // Update data using the Sheety API with a PUT request
      const updateResponse = await fetch(
        `https://api.sheety.co/313ba156926928db7871fc95577d36d9/chillerRegister/data/${chillerIdToUpdate}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ datum: updatedData }),
        }
      );

      if (!updateResponse.ok) {
        console.error('Failed to update chiller data', updateResponse.status, await updateResponse.text());
        return;
      }

      console.log(`Updated data for chillerId: ${chillerIdToUpdate}`);

      // Optionally, you can reload the chiller data after updating
      // to reflect the updated state.
      // await fetchData();
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
      <div className="bodydelete">
        <h1>Deletepage</h1>
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
        <form onSubmit={handleDelete}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your chiller ID to delete"
              value={chillerDelete}
              onChange={handleChillerDelete}
            />
            {chillerIdMismatch && <p style={{ color: 'red' }}>Wrong chiller ID, please try another.</p>}
          </div>
          <button type="submit">Delete</button>
        </form>
      </div>
    </div>
  );
}

export default Delete;
