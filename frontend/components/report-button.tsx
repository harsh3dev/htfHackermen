"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ReportButton() {
  return (
    <Link href="/report">
      <Button className="bg-red-500 hover:bg-red-600">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Report Scam
      </Button>
    </Link>
  );
}