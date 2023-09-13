import { GoogleSpreadsheet } from 'google-spreadsheet';
import credentials from './My_credentials.json';

// Create a function to load data from the Google Spreadsheet
export async function loadSpreadsheetData() {
  const doc = new GoogleSpreadsheet('1-lUJYqyQ5xjHY34HE139LZHVfJMfKRM4ZCuLwEV09jk');
  
  // Authenticate with service account credentials
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  try {
    await doc.loadInfo(); // Load the spreadsheet information

    // Assuming your data is in the first sheet (index 0)
    const sheet = doc.sheetsByIndex[0];

    // Get all rows from column A (assuming your data is in column A)
    const rows = await sheet.getRows();

    // Extract values from rows and return them as an array
    const values = rows.map((row) => row.ChillerID);

    return values;
  } catch (error) {
    console.error('Error loading data from Google Sheets:', error);
    throw error;
  }
}

export async function saveDataToGoogleSheet(updatedData) {
  const doc = new GoogleSpreadsheet('1-lUJYqyQ5xjHY34HE139LZHVfJMfKRM4ZCuLwEV09jk');

  // Authenticate with service account credentials
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  try {
    await doc.loadInfo(); // Load the spreadsheet information

    // Assuming your data is in the first sheet (index 0)
    const sheet = doc.sheetsByIndex[0];

    // Clear existing data in the sheet (optional)
    await sheet.clear();

    // Add headers if needed
    await sheet.setHeaderRow(['ChillerID', 'ChillerName', 'UserID']);

    // Add the updated data to the sheet
    await sheet.addRows(updatedData);

    console.log('Data saved to Google Sheets successfully.');
  } catch (error) {
    console.error('Error saving data to Google Sheets:', error);
    throw error;
  }
}
