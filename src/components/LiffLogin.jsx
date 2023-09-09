import liff from '@line/liff';

export const initializeLIFF = async () => {
  try {
    await liff.init({ liffId: '2000665579-jvJl5OyP' });
    return true; // LIFF is initialized successfully
  } catch (error) {
    console.error('LIFF initialization failed', error);
    return false; // LIFF initialization failed
  }
};

export const fetchUserProfile = async () => {
  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();
    return profile;
  }
  return null;
};
