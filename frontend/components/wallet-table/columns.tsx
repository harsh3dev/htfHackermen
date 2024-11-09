"use client";

import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

type ScamWallet = {
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

export const columns = [
  {
    header: "Wallet Address",
    cell: (wallet: ScamWallet) => (
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-violet-400" />
        <span className="font-mono">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </span>
      </div>
    ),
  },
  {
    header: "Balance (ETH)",
    cell: (wallet: ScamWallet) => (
      <span className="font-bold text-blue-400">{wallet.totalEtherBalance.toFixed(4)}</span>
    ),
  },
  {
    header: "Avg. Received (ETH)",
    cell: (wallet: ScamWallet) => (
      <span>{wallet.avgValReceived.toFixed(4)}</span>
    ),
  },
  {
    header: "Avg. Sent (ETH)",
    cell: (wallet: ScamWallet) => (
      <span>{wallet.avgValSent.toFixed(4)}</span>
    ),
  },
  {
    header: "Total Sent (ETH)",
    cell: (wallet: ScamWallet) => (
      <span className="text-gray-500">{wallet.totalEtherSent.toFixed(4)}</span>
    ),
  },
  {
    header: "Total Received (ETH)",
    cell: (wallet: ScamWallet) => (
      <span className="text-gray-500">{wallet.totalEtherReceived.toFixed(4)}</span>
    ),
  },
  {
    header: "Transactions",
    cell: (wallet: ScamWallet) => (
      <Badge variant="outline" className="border-green-600 text-green-400">
        {wallet.receivedTnx} received / {wallet.sentTnx} sent
      </Badge>
    ),
  },
  {
    header: "Avg. Time Between Sends (mins)",
    cell: (wallet: ScamWallet) => (
      <span className="text-gray-400">{wallet.avgMinBetweenSentTnx.toFixed(2)}</span>
    ),
  },
  {
    header: "Avg. Time Between Receives (mins)",
    cell: (wallet: ScamWallet) => (
      <span className="text-gray-400">{wallet.avgMinBetweenReceivedTnx.toFixed(2)}</span>
    ),
  },
  {
    header: "Activity Duration (mins)",
    cell: (wallet: ScamWallet) => (
      <span className="text-gray-400">{wallet.timeDiffFirstLastMins.toFixed(2)}</span>
    ),
  },
];
