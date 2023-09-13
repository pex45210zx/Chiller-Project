// localStorageUtils.js
export const saveProfileData = (profilePicture, displayName,userId) => {
    localStorage.setItem('profilePicture', profilePicture);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('userId', userId);
  };
  
  export const getProfileData = () => {
    const profilePicture = localStorage.getItem('profilePicture');
    const displayName = localStorage.getItem('displayName');
    const userId = localStorage.getItem('userId');
    return { profilePicture, displayName, userId };
  };
  