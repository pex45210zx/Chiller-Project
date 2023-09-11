// In a separate file, e.g., auth.js
export function checkAndSaveLoginStatus() {
    const isLoggedIn = liff.isLoggedIn();
    if (isLoggedIn) {
      const profile = liff.getProfile();
      const userId = profile.userId;
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
    }
  }
  
  export function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  
  export function getUserId() {
    return localStorage.getItem('userId');
  }
  