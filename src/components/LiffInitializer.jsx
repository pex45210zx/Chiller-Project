import { useEffect } from 'react';
import liff from '@line/liff';

const LiffInitializer = ({ children }) => {
  useEffect(() => {
    async function initializeLiff() {
      try {
        await liff.init({ liffId: '2000665579-jvJl5OyP' });
      } catch (error) {
        console.error('LIFF initialization failed', error);
      }
    }

    initializeLiff();
  }, []);

  return children;
};

export default LiffInitializer;
