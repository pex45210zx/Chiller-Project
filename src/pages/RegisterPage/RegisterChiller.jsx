import React, { useState } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './RegisterChiller.css';
import liff from '@line/liff';
import { getProfileData } from '../../components/localStorageUtils';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';
import ModalPopUp from '../../components/modalPopUp';

function RegisterChiller() {
  const [click, setClick] = useState(false);
  const [chillerId, setChillerId] = useState('');
  const [chillerName, setChillerName] = useState('');
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogout = () => {
    liff.logout();
    navigate('/');
    console.log('clicked logout');
  };

  const handleChillerIdChange = (e) => {
    setChillerId(e.target.value);
  };

  const handleChillerNameChange = (e) => {
    setChillerName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userId } = getProfileData();

    if (!chillerId.trim()) {
      setModalMessage('Chiller ID cannot be empty');
      setIsModalOpen(true);
      return;
    }

    if (!chillerName.trim()) {
      setModalMessage('Chiller name cannot be empty');
      setIsModalOpen(true);
      return;
    }

    try {
      const chillerData = await fetchChillerData();

      if (chillerData === null) {
        return;
      }

      const matchingChiller = chillerData.find((row) => row.chillerId === chillerId);

      if (matchingChiller) {
        if (!matchingChiller.userId || matchingChiller.userId === userId || matchingChiller.userId === 'null' || matchingChiller.userId === '') {
          const isNameUsedByCurrentUser = chillerData.some((row) => row.userId === userId && row.chillerName === chillerName);

          if (isNameUsedByCurrentUser) {
            setModalMessage('This Chiller name is already used by you');
            setIsModalOpen(true);
            return;
          }

        } else {
          setModalMessage('This Chiller is already registered with a different userId');
          setIsModalOpen(true);
          return;
        }

        matchingChiller.chillerName = chillerName;
        matchingChiller.userId = userId;

        try {
          const response = await fetch(`https://api.sheety.co/313ba156926928db7871fc95577d36d9/projectChillerData/data/${matchingChiller.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ datum: matchingChiller }),
          });

          if (response.ok) {
            setModalMessage('Chiller data updated successfully');
            setIsModalOpen(true);
          } else {
            console.error('Failed to update chiller data', response.status, await response.text());
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      } else {
        setModalMessage('Wrong chiller ID');
        setIsModalOpen(true);
      }
      setChillerId('');
      setChillerName('');
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
      <div className="bodyregisterCL">
        <div className="body-con">
          <div className='register-title'>Registration Your Chiller</div>
          <div className="des-area">
            <div className="description">Please enter your chiller ID and create name of it to add it to Your Chiller in menu</div>
          </div>
          <form className='form-input' onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className='textfield'
                type="text"
                placeholder="Enter your chiller ID"
                value={chillerId}
                onChange={handleChillerIdChange}
              />
            </div>
            <div className="form-group">
              <input
                className='textfield'
                type="text"
                placeholder="Enter your chiller name"
                value={chillerName}
                onChange={handleChillerNameChange}
              />
            </div>
            <button className='button-register' type="submit">Register Chiller</button>
          </form>
        </div>
      </div>
      <ModalPopUp isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
}

export default RegisterChiller;
