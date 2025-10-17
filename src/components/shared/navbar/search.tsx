import { Search } from 'lucide-react'
import React from 'react'

const SearchCom = () => {
  return (
    <div className='flex gap-1 border-1  rounded-xl'>
      <input className='w-full outline-none pl-3' /> <Search className='h-full bg-green-400 rounded-xl cursor-pointer px-1 py-1 w-fit' />
    </div>
  )
}

export default SearchCom
