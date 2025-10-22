'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Hero = () => {
    const data = [
        {
            url: '/hero/hero.png',
            title: 'Explore the World',
            description: 'Discover amazing places and adventures waiting for you.'
        },
        {
            url: '/hero/hero2.png',
            title: 'Capture Every Moment',
            description: 'Turn your memories into stories worth sharing.'
        },
        {
            url: '/hero/hero3.png',
            title: 'Travel in Style',
            description: 'Experience journeys with comfort and excitement.'
        },
        {
            url: '/hero/hero4.png',
            title: 'Create Your Adventure',
            description: 'Step out, explore, and make every day unforgettable.'
        },
    ]


    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevIndex) =>
                prevIndex === data.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval)
    }, [data.length]);

    return (
        <section className='relative max-w-screen h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden'>
            <div className='relative w-full h-full'>
                <Image
                    className='object-cover transition-all duration-700'
                    src={data[currentImage].url}
                    alt='hero'
                    fill
                    priority
                />
            </div>

            {/* Only show current slide text */}
            <div className='absolute bottom-24 left-[10%] transform -translate-x-[10%] text-start text-white'>
                <h2 className='text-2xl md:text-4xl font-bold'>{data[currentImage].title}</h2>
                <p className='text-lg md:text-xl'>{data[currentImage].description}</p>
            </div>

            <div className='absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3'>
                {data.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-500 ${currentImage === index ? 'bg-white scale-125' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </section>
    )
}

export default Hero