"use client";

import { Badge } from "@/components/ui/badge";
import { Shield, Wallet } from "lucide-react";
import { type ScamWallet } from "@/lib/data/mock-wallets";

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
    header: "Balance",
    cell: (wallet: ScamWallet) => (
      <span className="font-bold text-blue-400">{wallet.balance}</span>
    ),
  },
  {
    header: "Exchange",
    cell: (wallet: ScamWallet) => (
      <Badge variant="outline" className="border-violet-600 text-violet-400">
        {wallet.exchange}
      </Badge>
    ),
  },
  {
    header: "Trust Score",
    cell: (wallet: ScamWallet) => (
      <div className="flex items-center gap-2">
        <Shield
          className={`w-4 h-4 ${
            wallet.trustScore < 10
              ? "text-red-500"
              : wallet.trustScore < 20
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        />
        <span
          className={`${
            wallet.trustScore < 10
              ? "text-red-400"
              : wallet.trustScore < 20
              ? "text-yellow-400"
              : "text-green-400"
          }`}
        >
          {wallet.trustScore}%
        </span>
      </div>
    ),
  },
  {
    header: "Last Active",
    cell: (wallet: ScamWallet) => (
      <span className="text-gray-400">{wallet.lastActive}</span>
    ),
  },
  {
    header: "Reports",
    cell: (wallet: ScamWallet) => (
      <Badge variant="destructive">{wallet.reportCount} reports</Badge>
    ),
  },
];