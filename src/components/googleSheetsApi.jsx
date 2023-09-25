// Function to fetch chiller data from the Sheety API
export async function fetchChillerData() {
    try {
      const response = await fetch('https://api.sheety.co/49d0c21a5626a3a181f1ba24be577500/chillerRegister/data');
  
      if (!response.ok) {
        console.error('Failed to fetch chiller data', response.status, await response.text());
        return null;
      }
  
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error('An error occurred while fetching chiller data:', error);
      return null;
    }
  }