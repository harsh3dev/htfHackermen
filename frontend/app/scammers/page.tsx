import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { WalletTable } from "@/components/wallet-table/wallet-table";
// import { scamWallets } from "@/lib/data/mock-wallets";
import { sortedWalletData } from "@/lib/data/mock-wallets";
import { ReportButton } from "@/components/report-button";


export default function page() {
  return (
      <div className="max-w-7xl w-full h-full mt-24 mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Scam Wallet Tracker
            </h1>
            <p className="text-gray-400 mt-2">
              Top 10 identified malicious wallet addresses
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatsCard />
            <ReportButton />
          </div>
        </div>

        <Card className="bg-black/40 border-violet-900">
          <WalletTable wallets={sortedWalletData} />
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Data is updated every 5 minutes. Last update: 2024-03-21 15:30 UTC</p>
        </div>
      </div>
  );
}