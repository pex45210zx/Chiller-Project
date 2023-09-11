// localStorageUtils.js
export const saveProfileData = (profilePicture, displayName) => {
    localStorage.setItem('profilePicture', profilePicture);
    localStorage.setItem('displayName', displayName);
  };
  
  export const getProfileData = () => {
    const profilePicture = localStorage.getItem('profilePicture');
    const displayName = localStorage.getItem('displayName');
    return { profilePicture, displayName };
  };
  