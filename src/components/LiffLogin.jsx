import liff from '@line/liff';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfileData } from './localStorageUtils';
import './LiffLogin.css';
import logo from '../images/logo2.png';

function LiffLogin() {
    const [profilePicture, setProfilePicture] = useState('');
    const [userId, setUserId] = useState('');
    const [displayName, setDisplayName] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const maxLoginAttempts = 3;

    useEffect(() => {
        const loginWithLiff = async () => {
            try {
                await liff.init({ liffId: '2000665579-jvJl5OyP' });

                if (!liff.isLoggedIn()) {
                    liff.login();
                } else {
                    const profile = await liff.getProfile();
                    setProfilePicture(profile.pictureUrl);
                    setUserId(profile.userId);
                    setDisplayName(profile.displayName);

                    saveProfileData(profile.pictureUrl, profile.displayName, profile.userId);

                    navigate('/home');
                }
            } catch (error) {
                console.log(error);
                setLoginAttempts(prevAttempts => prevAttempts + 1);
                if (loginAttempts >= maxLoginAttempts) {
                    window.location.reload();
                }
            } finally {
                setLoading(false);
            }
        };

        loginWithLiff();
    }, [navigate, loginAttempts]);

    return (
        <div className={`modal ${loading ? 'modal--active' : ''}`}>
            <div className="modal-content1">
                <div className="sea-animation">
                <img src={logo} alt="aqua Logo" className="logoLoading" />
                <img src={logo} alt="aqua Logo" className="logoLoading" />
                <img src={logo} alt="aqua Logo" className="logoLoading" />
                </div>
                <p>Loading...</p>
            </div>
        </div>
    );
}

export default LiffLogin;
