import Image from "next/image";
import shieldIcon from "@/app/assets/shieldIcon.svg"

export default function HeroSection() {
    return (
          <div className="h-screen w-full text-white container mx-auto p-28 flex flex-col justify-start items-center ">
            <div className="grid grid-cols-2 gap-36 h-full place-content-start place-items-stretch pt-24 ">
              {/* Left Column */}
              <div className="flex flex-col justify-between items-start h-full gap-4 ">
                <div className="flex flex-col items-start justify-normal gap-0">
                  <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl flex gap-4 ">
                    Secured <Image src={shieldIcon} alt="shield" width={80} height={80} />
                  </h1>
                  <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                    Transactions
                  </h1>
                </div>
                <div className="text-lg text-gray-400 flex items-center gap-2 "> <div className="w-28 h-[3px] rounded-md bg-gray-400 "></div> Designed for <span className="italic">advanced</span> Protection</div>
              </div>
    
              {/* Right Column */}
              <div className="flex flex-col justify-between space-y-8 h-full ">
                <div className="space-y-8">
                  <p className="text-xl leading-relaxed text-gray-300">
                    Protecting Your Transactions Should Be Straightforward. Our App Provides Top-Tier Security Features, Making Web3.0 Protection Simple And Accessible For Everyone.
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-4xl font-bold">4.9L</h3>
                      <p className="text-sm text-gray-400">Active Users</p>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold">20k+</h3>
                      <p className="text-sm text-gray-400">Protected Servers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Features */}
            <div className="w-full h-full font-bold  grid grid-cols-2 gap-36 pt-20 text-sm uppercase tracking-wider text-gray-400">
                  <div>FRAUDULANT DETECTION</div>
                  <div className="text-right">END-TO-END ENCRYPTION</div>
                  <div>PAYMENT INTEGRITY</div>
                  <div className="text-right">REPORT SCAMS</div>
            </div>
          </div>
      )
    }