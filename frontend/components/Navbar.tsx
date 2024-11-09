'use client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const navItems = [
    {
        'name': 'Home',
        'href': '/'
    },
    {
        'name': 'About',
        'href': '/#about'
    },
    {
        'name': 'Pricing',
        'href': '/#pricing'
    },
    {
        'name': 'Scammers',
        'href': '/scammers'
    }
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset

      setVisible((prevScrollPos > currentScrollPos && currentScrollPos > 0) || currentScrollPos < 10)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos, visible])

  return (
    <nav className={`fixed w-full transition-all duration-300 z-10 mt-8 ${visible ? 'top-0' : '-top-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={'/'} className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">CryptoSecure</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn("text-[#fafafaa1] hover:text-white px-3 py-2 text-sm ", pathname === item.href ? ' text-white' : '')}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
          <Link className=" text-lg font-bold rounded-full p-2 px-4 text-white" style={{background: "linear-gradient(90deg, rgba(250, 250, 250, 0.70) -22.53%, #4674A5 100%)"}} href={'/check'} >
          
              Check Score
            </Link>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </Button>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}