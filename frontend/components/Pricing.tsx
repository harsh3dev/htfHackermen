'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Basic',
      price: isYearly ? 180 : 20,
      description: 'For individual users',
      features: [
        'Real-Time Scam Detection',
        'Basic Address Risk Assessment',
        'Transaction Alerts',
        'Analysis for up to 50 Transactions',
        'Email Support',
      ],
    },
    {
      name: 'Premium',
      price: isYearly ? 350 : 40,
      description: 'For professionals and crypto enthusiasts',
      popular: true,
      features: [
        'Real-Time Scam Detection',
        'Enhanced Address Risk Assessment',
        'Detailed Transaction Reports',
        'Analysis for up to 200 Transactions',
        'Priority Email Support',
      ],
    },
    {
      name: 'Enterprise',
      price: isYearly ? 750 : 100,
      description: 'For businesses and exchanges',
      features: [
        'Real-Time Scam Detection',
        'Advanced Address Risk Assessment',
        'Custom Transaction Reports',
        'Unlimited Transaction Analysis',
        'Dedicated Account Manager',
        '24/7 Support',
      ],
    },
  ]

  return (
    <div id='pricing' className="w-full py-16 px-36">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">Choose A Plan</h2>
          <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed">
            Designed to Simplify Your Experience and Maximize the Benefits of CloudPeaks Innovative Features
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-sm text-gray-400">Yearly</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3 md:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="relative flex flex-col p-6 bg-[#0E0F1C] border-gray-800 rounded-xl"
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 px-3 py-1 text-xs bg-[#00FF85] text-black rounded-full">
                  Popular
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline text-white">
                  <span className="text-4xl font-bold">$</span>
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="ml-2 text-sm text-gray-400">per person, per month</span>
                </div>
              </div>
              <ul className="flex-1 mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-400">
                    <Check className="w-4 h-4 mr-3 text-[#00FF85]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}