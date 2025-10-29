
import Link from 'next/link'
import React from 'react'
import SearchCom from './search'
import Profile from './Profile'


const Navbar = () => {
  return (
    <nav className=' py-8 absolute text-white top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-sm'>
        <div className='container mx-auto flex justify-between  items-center'>
          <div className='w-[20%]'>
            {/* logo  */}
            <h2 className='text-2xl  font-bold font-serif '>The JourneySoul</h2>
          </div>
          <div className='w-[70%]'>
            {/* content  */}
             <ul className='grid grid-cols-9 items-center'>
                <li className=''> <Link href={'/'}>Home </Link></li>
                <li><Link href='/about'>About</Link></li>
                <li ><Link href='blog'>Blog</Link> </li>
                <li><Link href='/contact'>contact</Link></li>
                <li className=' col-span-2'> <SearchCom />  </li>
                <li className='col-span-3'><Profile /></li>
             </ul>
          </div>

        </div>
    </nav>
  )
}

export default Navbar
