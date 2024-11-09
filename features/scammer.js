const fs = require('fs');
const csv = require('csv-parser');
const kyc = require("./model/kyc");
const db = require("./utils/db");

require('dotenv').config();
db.connect();

async function importCSV() {
  const filePath = 'kyc.csv';
  const kycaddresses = [];

  // Read the CSV file and collect addresses
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      const address = row.Address;
      kycaddresses.push({ address: address });
    })
    .on('end', async () => {
      console.log('CSV file successfully processed.');
      console.log('KYC addresses:', kycaddresses);

      // Insert collected addresses into the KYC model
      try {
        // Bulk insert operation
        await kyc.insertMany(kycaddresses);
        console.log('Addresses successfully inserted into KYC model.');
      } catch (err) {
        console.error('Error inserting addresses into KYC:', err);
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
    });
}

importCSV();




