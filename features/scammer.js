const fs = require('fs');
const csv = require('csv-parser');
const KYCAPPROVED = require("./model/kyc");
const db = require("./utils/db");

require('dotenv').config();
db.connect();

async function importCSV() {
  const filePath = 'kyc.csv';
  const kycaddresses = [];

  // Return a promise that resolves when the CSV file is fully processed
  const processCSV = new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Collect each address into the kycaddresses array
        const address = row.Address;
        kycaddresses.push({ address: address });
      })
      .on('end', () => {
        console.log('CSV file successfully processed.');
        console.log('KYC addresses:', kycaddresses);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      });
  });

  // Wait until the CSV processing is done
  await processCSV;

  // Insert collected addresses into the KYC model
  try {
    if (kycaddresses.length > 0) {
      // Bulk insert operation
      await KYCAPPROVED.insertMany(kycaddresses);
      console.log('Addresses successfully inserted into KYC model.');
    } else {
      console.log('No addresses to insert.');
    }
  } catch (err) {
    console.error('Error inserting addresses into KYC:', err);
  }
}

importCSV();
