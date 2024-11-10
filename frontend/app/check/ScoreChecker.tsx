'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import axios from 'axios'

export default function ScoreChecker() {
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [trustScore, setTrustScore] = useState(0)

  const checkTrustScore = async () => {
    try {
        setIsLoading(true);
        const res = await axios.post("http://127.0.0.1:8000/process_eth_address", {
          address: address, 
        });
        console.log("response",res)
        setTrustScore(parseFloat(res.data.score.toFixed(2)));
        setIsLoading(false);
        setShowResult(true);
    } catch (error) {
      console.error("Error fetching trust score:", error);
      setIsLoading(false);
    }
  };
  

  const getScoreColor = (score: number) => {
    if (score <= 50) return 'text-red-400'
    if (score <= 75) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getScoreBackground = (score: number) => {
    if (score <= 50) return 'bg-red-900/20'
    if (score <= 75) return 'bg-yellow-900/20'
    return 'bg-green-900/20'
  }

  const getScoreMessage = (score: number) => {
    if (score <= 50) return 'High Risk'
    if (score <= 75) return 'Moderate Risk'
    return 'Safe'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center text-violet-200">CryptoSecure Trust Score Checker</h1>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter blockchain wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full text-lg py-6 px-4 bg-gray-800 text-violet-100 border-violet-500 placeholder-violet-400"
          />

          <button 
            onClick={checkTrustScore}
            disabled={isLoading || address.trim() === ''}
            className="w-full checkButton cursor-pointer "
          >
            <span className=' flex justify-center items-center '>
            {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Score'
              )}
            </span>
          </button>
            
        </div>

        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="bg-gray-800 text-violet-100">
            <DialogHeader>
              <DialogTitle className="text-violet-200">Trust Score Result</DialogTitle>
              <DialogDescription className="text-violet-300">
                The projected trust score for the wallet address:
              </DialogDescription>
            </DialogHeader>
            <div className={`flex flex-col items-center justify-center p-6 rounded-lg ${getScoreBackground(trustScore)}`}>
              <div className={`text-7xl font-bold ${getScoreColor(trustScore)}`}>{trustScore}</div>
              <div className={`mt-2 text-xl font-semibold ${getScoreColor(trustScore)}`}>
                {getScoreMessage(trustScore)}
              </div>
            </div>
            <div className="text-center text-sm text-violet-400 mt-4">
              Score range: 0-50 (High Risk), 51-75 (Moderate Risk), 76-100 (Safe)
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}