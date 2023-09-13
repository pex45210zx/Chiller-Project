import credentials from './My_credentials.json';
import { GoogleSpreadsheet } from 'google-spreadsheet';


// Create a function to load data from the Google Spreadsheet
export async function loadSpreadsheetData() {

  const doc = new GoogleSpreadsheet('1-lUJYqyQ5xjHY34HE139LZHVfJMfKRM4ZCuLwEV09jk');

  // Use service account credentials
  await doc.useServiceAccountAuth(credentials);

  try {
    await doc.loadInfo(); // Load the spreadsheet information

    // Assuming your data is in the first sheet (index 0)
    const sheet = doc.sheetsByIndex[0];

    // Get all rows from column A (assuming your data is in column A)
    const rows = await sheet.getRows();

    // Extract values from rows and return them as an array
    const values = rows.map((row) => row._rawData[0]);

    return values;
  } catch (error) {
    console.error('Error loading data from Google Sheets:', error);
    throw error;
  }
}
