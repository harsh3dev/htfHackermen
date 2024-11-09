import Image from "next/image"
import Link from "next/link"
import { BsTwitterX } from "react-icons/bs"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import logo from "@/app/assets/logo.png"


export default function Footer() {
  return (
    <footer className="w-full  text-white px-20 py-5 ">
      <div className="container px-4 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          {/* Logo and Tagline */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              {/* Logo Icon */}
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Image src={logo} width={32} height={32} alt="Logo" className="rounded-full" />
              </div>
              {/* Company Name */}
              <span className="text-xl font-semibold">CryptoSecure</span>
            </div>
            {/* Tagline */}
            <div className="hidden md:block w-px h-6 bg-gray-600 mx-4" />
            <p className="text-gray-300 max-w-md">
              Make your wallet secure with CryptoSecure.
            </p>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-8">
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Integration
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Reviews
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          {/* Copyright */}
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            Made with ❤️ by Hackermen in HackThisFall Virtual 2024
          </p>
          
          {/* Social Links */}
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaGithub className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <BsTwitterX className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaLinkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}