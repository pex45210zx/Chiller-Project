import React, { useEffect, useState } from 'react';
import liff from '@line/liff';

function LiffLogin({ onLogin }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeLineLiff() {
      try {
        await liff.init({ liffId: '2000665579-jvJl5OyP' }); // Replace with your LIFF ID

        if (liff.isLoggedIn()) {
          onLogin(); // Notify the parent component that the user is logged in
        } else {
          liff.login();
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    initializeLineLiff();
  }, [onLogin]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Login with Line</p>
      )}
    </div>
  );
}

export default LiffLogin;
