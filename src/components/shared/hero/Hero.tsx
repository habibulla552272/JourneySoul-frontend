'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'

const Hero = () => {
    const data = [
        { url: '/hero/hero.png' },
        { url: '/hero/hero2.png' },
        { url: '/hero/hero3.png' },
        { url: '/hero/hero4.png' },
    ]

    const [currentimage, setcurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setcurrentImage((prevIndex) =>
                prevIndex === data.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval)
    }, [data.length]);
    return (
        <section className='relative max-w-screen h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden'>
        
            <div className='relative w-full h-full'>
                <Image className=' object-cover  transition-all  duration-700' src={data[currentimage].url} alt='hero'  fill priority />
            </div>
            <div className=' absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3'>
                {
                    data.map((_, index) => (
                        <div key={index} className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-500 ${currentimage === index ? 'bg-white scale-125 ' : 'bg-gray-300'} `}>

                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default Hero
