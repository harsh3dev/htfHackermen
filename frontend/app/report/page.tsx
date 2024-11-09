import { Card } from "@/components/ui/card";
import { ReportForm } from "@/components/report-form";
import { AlertCircle } from "lucide-react";

export default function ReportPage() {
  return (
    <div className="min-h-screen  text-white mt-20 ">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <AlertCircle className="text-red-400 w-6 h-6" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Report Scam Wallet
            </h1>
            <p className="text-gray-400 mt-2">
              Help protect the community by reporting suspicious wallet activity
            </p>
          </div>
        </div>

        <Card className="bg-black/40 border-violet-900 p-6">
          <ReportForm />
        </Card>
      </div>
    </div>
  );
}