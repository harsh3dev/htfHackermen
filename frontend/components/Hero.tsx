import React from 'react'
import HeroSection from './HeroSection'

function Hero() {
  return (
    <div className='w-full h-screen flex flex-col justify-start items-start gap-4 bgimg '>
        <div className='bggrad '></div>
      
      <HeroSection />
    </div>
  )
}

export default Hero
