import Image from "next/image";
import logo1 from "@/app/assets/images.png"
import logo2 from "@/app/assets/binance.png"
import logo3 from "@/app/assets/coinbase.png"
import logo4 from "@/app/assets/ethereum-eth-logo.png"
import logo5 from "@/app/assets/metamask.svg.webp"


export default function Features() {
    return (
      <div id="about" className=" text-white">
        <section className="container mx-auto px-36 py-16 space-y-20">
          {/* Trusted Companies */}
          <div className="space-y-8">
            <h2 className="text-center text-2xl">
              Trusted by thousands of companies worldwide
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {/* insert company logo */}
              <Image src={logo1} alt="logo1" width={50} height={50} />
              <Image src={logo2} alt="logo1" width={50} height={50} />
              <Image src={logo3} alt="logo1" width={50} height={50} />
              <Image src={logo4} alt="logo1" width={50} height={50} />
              <Image src={logo5} alt="logo1" width={50} height={50} />
            </div>              
          </div>
  
          {/* Features Section */}
          <div className="grid md:grid-cols-[1fr,2fr] gap-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                We help you secure your Wallet
              </h2>
              <p className="text-gray-400">
                Our mission is to prevent fraudulent transactions making web3.0 a safe space.
              </p>
            </div>
  
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[#0d0f1d] rounded-xl p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Real-Time Detection</h3>
                <p className="text-gray-400">
                Instantly Assess Wallet Addresses with CryptoSecure’s AI-Powered Scam Detection for Safer Transactions Every Time
                </p>
              </div>
  
              <div className="bg-[#0d0f1d] rounded-xl p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Enhanced Transaction Security</h3>
                <p className="text-gray-400">
                Safeguard Your Assets with Advanced Analytics and Machine Learning, Reducing the Risk of Fraud and Scams
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }