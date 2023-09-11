import liff from '@line/liff';
import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from '../HomePage/Home';
import RegisterChiller from '../RegisterPage/RegisterChiller';
import YourChiller from '../YourChillerPage/YourChiller';
import Delete from '../DeletePage/Delete';


function LiffLogin() {
    const [profilePicture, setProfilePicture] = useState('');
    const [userId, setUserId] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleLogin = async () => {
        try {
            await liff.init({ liffId: '2000665579-jvJl5OyP' });

            if (!liff.isLoggedIn()) {
                liff.login();
            } else {
                const profile = await liff.getProfile();
                setProfilePicture(profile.pictureUrl);
                setUserId(profile.userId);
                setDisplayName(profile.displayName);
            }
        } catch (error) {
            console.log(error);
        };
    }

    return (
        <>
            <div>
                {!profilePicture ? (
                    <button onClick={handleLogin}>Login with LIFF</button>
                ) : (
                    <div>
                        <Routes>
                            <Route path="/home" element={<Home />} />
                            <Route path="/register-chiller" element={<RegisterChiller />} />
                            <Route path="/your-chiller" element={<YourChiller />} />
                            <Route path="/delete" element={<Delete />} />
                        </Routes>
                    </div>
                )}
            </div>
        </>
    )
}

export default LiffLogin;