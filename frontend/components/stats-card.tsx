"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function StatsCard() {
  return (
    <Card className="bg-violet-900/20 border-violet-700 p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-red-400" />
        <div>
          <p className="text-sm text-gray-400">Total Scam Value</p>
          <p className="text-xl font-bold text-violet-400">8,940.69 ETH</p>
        </div>
      </div>
    </Card>
  );
}