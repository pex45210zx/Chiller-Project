import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './Delete.css';
import { getProfileData } from '../../components/localStorageUtils';
import liff from '@line/liff';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';
import { FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
import ModalPopUp from '../../components/modalPopUp';
import ModalDelete from '../../components/modalDelete';


function Delete() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [chillerOptions, setChillerOptions] = useState([]);
  const [selectedChiller, setSelectedChiller] = useState('');
  const [chillerDelete, setChillerDelete] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // State to control the confirmation dialog


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
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    // Find the selected chiller by name
    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller
    );

    if (!selectedChiller) {
      setModalMessage('Please select your chiller first.');
      setIsModalOpen(true);
      return;
    }

    // Ensure chillerDelete is not empty
    if (!chillerDelete) {
      setModalMessage('Chiller ID is required.');
      setIsModalOpen(true);
      return;
    }

    // Check if the entered chillerDelete matches the chillerId of the selected chiller
    if (chillerDelete !== selectedChillerObj.chillerId) {
      setModalMessage('Wrong chiller ID, please try another.');
      setIsModalOpen(true);
      return;
    }

    console.log('Opening confirmation dialog'); // Debugging statement
    // Show the confirmation dialog
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {

    // Find the selected chiller by name
    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller
    );

    // Define the data to be updated (set columns B to F to empty)
    const updatedData = {
      userId: '',      // Update this to the empty value you want for userId (B)
      chillerName: '', // Update this to the empty value you want for chillerName (C)
      chillerMode: '', // Update this to the empty value you want for chillerMode (D)
      highTemp: '',    // Update this to the empty value you want for highTemp (E)
      lowTemp: '',     // Update this to the empty value you want for lowTemp (F)
    };
    // Add your delete logic here
    try {
      const chillerIdToUpdate = selectedChillerObj.id;
      // Update data using the Sheety API with a PUT request
      const updateResponse = await fetch(
        `https://api.sheety.co/49d0c21a5626a3a181f1ba24be577500/chillerRegister/data/${chillerIdToUpdate}`,
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

      setModalMessage(`Deleted chiller success!!`);
      setIsModalOpen(true);

      // After displaying the success message, navigate to /home
      setTimeout(() => {
        setIsModalOpen(false); // Close the modal
        navigate('/home'); // Navigate to /home
      }, 2000); // Delay for 2 seconds (adjust the delay as needed)
    } catch (error) {
      console.error('An error occurred:', error);
    }

    console.log('Closing confirmation dialog'); // Debugging statement
    // Close the confirmation dialog
    setIsConfirmationOpen(false);
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
      <div className="bodydelete">
        <div className="body-con">
          <div className='delete-title'>Delete page</div>
          <div className="description"> <div className="emoji"><FaExclamationTriangle className="exclamation-icon" /></div>Please be aware this step will delete your chiller,
            if you delete it, all previously saved settings and temperature data of it  will be deleted.</div>
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
          <form onSubmit={handleDelete}>
            <div className="form-group">
              <input
                className='textfield'
                type="text"
                placeholder="Enter your chiller ID to delete"
                value={chillerDelete}
                onChange={handleChillerDelete}
              />
            </div>
            <button className='button-delete' type="submit">Delete</button>
          </form>
        </div>
      </div>
      {/* Render the custom modal */}
      <ModalPopUp isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
      {/* Render the confirmation dialog */}
      <ModalDelete
        isOpenD={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Delete;
