import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './Delete.css';
import { getProfileData } from '../../components/localStorageUtils';
import liff from '@line/liff';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';
import { FaExclamationTriangle } from 'react-icons/fa';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);


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
  };

  const handleChillerDelete = async (e) => {
    setChillerDelete(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller
    );

    if (!selectedChiller) {
      setModalMessage('Please select your chiller first.');
      setIsModalOpen(true);
      return;
    }

    if (!chillerDelete) {
      setModalMessage('Chiller ID is required.');
      setIsModalOpen(true);
      return;
    }

    if (chillerDelete !== selectedChillerObj.chillerId) {
      setModalMessage('Wrong chiller ID, please try another.');
      setIsModalOpen(true);
      return;
    }

    console.log('Opening confirmation dialog');
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {

    const selectedChillerObj = chillerOptions.find(
      (chiller) => chiller.chillerName === selectedChiller
    );

    const updatedData = {
      userId: '',      
      chillerName: '', 
      chillerMode: '', 
      highTemp: '',    
      lowTemp: '',  
    };
 
    try {
      const chillerIdToUpdate = selectedChillerObj.id;
      const updateResponse = await fetch(
        `https://api.sheety.co/313ba156926928db7871fc95577d36d9/projectChillerData/data/${chillerIdToUpdate}`,
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

      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/home'); 
      }, 2000);
    } catch (error) {
      console.error('An error occurred:', error);
    }

    console.log('Closing confirmation dialog');
    setIsConfirmationOpen(false);
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
      <div className="bodydelete">
        <div className="body-con-de">
          <div className='delete-title'>Delete page</div>
          <div className="des-area">
            <div className="description-de">
              <div className="emoji"><FaExclamationTriangle className="exclamation-icon" />
              </div>Please be aware this step will delete your chiller,
              if you delete it, all previously saved settings and temperature data of it  will be deleted.
            </div>
          </div>
          <div className="chiller-dropdown-de">
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
          <form className='form-input' onSubmit={handleDelete}>
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
      <ModalPopUp isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
      <ModalDelete
        isOpenD={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Delete;
