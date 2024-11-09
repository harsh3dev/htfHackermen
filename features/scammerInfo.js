const axios = require('axios');
const Transaction = require("./model/transaction");
const blacklists = require("./model/blacklist");
const db = require("./utils/db");

require('dotenv').config();
db.connect();




// Function to fetch transaction stats for an address
export async function fetchTransactionStats(address) {
  async function getWalletBalance() {
    const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);
    const balanceInWei = response.data.result;
    return parseFloat(balanceInWei) / 1e18; // Convert to Ether
  }

  async function getTransactions() {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result; 
  }

  const stats = {
    timeDiffFirstLastMins: 0,
    avgValReceived: 0,
    avgMinBetweenReceivedTnx: 0,
    totalEtherSent: 0,
    totalEtherReceived: 0,
    receivedTnx: 0,
    sentTnx: 0,
    avgMinBetweenSentTnx: 0,
    totalEtherBalance: 0,
    avgValSent: 0,
  };

  // Get wallet balance
  stats.totalEtherBalance = await getWalletBalance();

  // Get all transactions
  const transactions = await getTransactions();
  const receivedTxns = transactions.filter(tx => tx.to.toLowerCase() === address.toLowerCase());
  const sentTxns = transactions.filter(tx => tx.from.toLowerCase() === address.toLowerCase());

  stats.receivedTnx = receivedTxns.length;
  stats.sentTnx = sentTxns.length;

  // Calculate total Ether sent and received
  stats.totalEtherSent = sentTxns.reduce((acc, tx) => acc + parseFloat(tx.value) / 1e18, 0);
  stats.totalEtherReceived = receivedTxns.reduce((acc, tx) => acc + parseFloat(tx.value) / 1e18, 0);

  // Time difference between first and last transaction
  if (transactions.length > 1) {
    const firstTxTime = parseInt(transactions[0].timeStamp);
    const lastTxTime = parseInt(transactions[transactions.length - 1].timeStamp);
    stats.timeDiffFirstLastMins = (lastTxTime - firstTxTime) / 60; 
  }

  // Calculate average values
  if (receivedTxns.length > 0) {
    stats.avgValReceived = stats.totalEtherReceived / receivedTxns.length;
  }

  if (sentTxns.length > 0) {
    stats.avgValSent = stats.totalEtherSent / sentTxns.length;
  }

  // Average time between received transactions
  if (receivedTxns.length > 1) {
    const receivedTimes = receivedTxns.map(tx => parseInt(tx.timeStamp));
    const receivedTimeDiffs = [];
    for (let i = 1; i < receivedTimes.length; i++) {
      receivedTimeDiffs.push((receivedTimes[i] - receivedTimes[i - 1]) / 60); // in minutes
    }
    stats.avgMinBetweenReceivedTnx = receivedTimeDiffs.reduce((a, b) => a + b, 0) / receivedTimeDiffs.length;
  }


  if (sentTxns.length > 1) {
    const sentTimes = sentTxns.map(tx => parseInt(tx.timeStamp));
    const sentTimeDiffs = [];
    for (let i = 1; i < sentTimes.length; i++) {
      sentTimeDiffs.push((sentTimes[i] - sentTimes[i - 1]) / 60); 
    }
    stats.avgMinBetweenSentTnx = sentTimeDiffs.reduce((a, b) => a + b, 0) / sentTimeDiffs.length;
  }

  return stats; 
}


async function processBlacklistedAddresses() {
  try {
    const blacklist = await blacklists.find(); 
    const addressList = blacklist.map((entry) => entry.address); 
    for (const address of addressList) {
      console.log(`Fetching stats for address: ${address}`);

      const stats = await fetchTransactionStats(address);

      const transactionStats = new Transaction({
        address: address,
        timeDiffFirstLastMins: stats.timeDiffFirstLastMins,
        avgValReceived: stats.avgValReceived,
        avgMinBetweenReceivedTnx: stats.avgMinBetweenReceivedTnx,
        totalEtherSent: stats.totalEtherSent,
        totalEtherReceived: stats.totalEtherReceived,
        receivedTnx: stats.receivedTnx,
        sentTnx: stats.sentTnx,
        avgMinBetweenSentTnx: stats.avgMinBetweenSentTnx,
        totalEtherBalance: stats.totalEtherBalance,
        avgValSent: stats.avgValSent,
      });

      await transactionStats.save(); 
      console.log(`Saved transaction stats for address: ${address}`);
    }
  } catch (error) {
    console.error('Error processing blacklisted addresses:', error);
  }
}


processBlacklistedAddresses().catch((error) => {
  console.error('Error running the script:', error);
});
