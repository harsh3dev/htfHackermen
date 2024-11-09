export interface ScamWallet {
    id: number;
    address: string;
    balance: string;
    exchange: string;
    trustScore: number;
    lastActive: string;
    reportCount: number;
  }
  
  export const scamWallets: ScamWallet[] = [
    {
      id: 1,
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      balance: "1,234.56 ETH",
      exchange: "Binance",
      trustScore: 12,
      lastActive: "2024-03-20",
      reportCount: 156,
    },
    {
      id: 2,
      address: "0x123f681646d4a755815f9cb19e1acc8565a0c2ac",
      balance: "892.34 ETH",
      exchange: "Kraken",
      trustScore: 8,
      lastActive: "2024-03-19",
      reportCount: 243,
    },
    {
      id: 3,
      address: "0x9876543210abcdef0123456789abcdef01234567",
      balance: "2,456.78 ETH",
      exchange: "Coinbase",
      trustScore: 15,
      lastActive: "2024-03-21",
      reportCount: 89,
    },
    {
      id: 4,
      address: "0xabcdef0123456789abcdef0123456789abcdef01",
      balance: "567.89 ETH",
      exchange: "Huobi",
      trustScore: 5,
      reportCount: 312,
      lastActive: "2024-03-18",
    },
    {
      id: 5,
      address: "0x0123456789abcdef0123456789abcdef01234567",
      balance: "3,789.12 ETH",
      exchange: "OKX",
      trustScore: 20,
      reportCount: 67,
      lastActive: "2024-03-20",
    },
  ];


import fs from 'fs';

export type WalletData = {
    address: string;
    timeDiffFirstLastMins: number;
    avgValReceived: number;
    avgMinBetweenReceivedTnx: number;
    totalEtherSent: number;
    totalEtherReceived: number;
    receivedTnx: number;
    sentTnx: number;
    avgMinBetweenSentTnx: number;
    totalEtherBalance: number;
    avgValSent: number;
};

function sortDataByEtherBalance(filePath: string): WalletData[] {
    // Read and parse the JSON file
    const data: WalletData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Sort data by totalEtherBalance in decreasing order
    const sortedData = data.sort((a, b) => b.totalEtherBalance - a.totalEtherBalance);

    return sortedData;
}

// Example usage
export const sortedWalletData = sortDataByEtherBalance('./lib/data/blacklist.json');
// console.log(sortedWalletData);
