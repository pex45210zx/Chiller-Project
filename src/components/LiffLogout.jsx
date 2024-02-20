import liff from '@line/liff';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiffLogin.css';
import logo from '../images/logo2.png';

function LiffLogout() {
    const [loading, setLoading] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const maxLoginAttempts = 3;
    const navigate = useNavigate();

    useEffect(() => {
        const loginWithLiff = async () => {
            try {
                await liff.init({ liffId: '2000665579-jvJl5OyP' });

                if (!liff.isLoggedIn()) {
                    liff.logout();
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
    }, [loginAttempts]);

    const handleNavigateToWebsite = () => {
        navigate('/');
    };

    return (
        <div className={`modal ${loading ? 'modal--active' : ''}`}>
            <div className="modal-content1">
                <div className="sea-animation">
                    <img src={logo} alt="aqua Logo" className="logoLoading" />
                    <img src={logo} alt="aqua Logo" className="logoLoading" />
                    <img src={logo} alt="aqua Logo" className="logoLoading" />
                </div>
                <button className="gtwbutt" onClick={handleNavigateToWebsite}>Go to website</button>
            </div>
        </div>
    );
}

export default LiffLogout;