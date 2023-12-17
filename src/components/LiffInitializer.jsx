import { useEffect } from 'react';
import liff from '@line/liff'; // Import LIFF from the package

const LiffInitializer = ({ children }) => {
  useEffect(() => {
    async function initializeLiff() {
      try {
        await liff.init({ liffId: '2000665579-jvJl5OyP' });
        // Optionally, check if the user is logged in here or perform other actions after initialization
      } catch (error) {
        console.error('LIFF initialization failed', error);
      }
    }

    initializeLiff();
  }, []);

  return children;
};

export default LiffInitializer;
