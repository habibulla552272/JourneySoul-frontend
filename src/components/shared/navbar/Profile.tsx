'use client'
import { userProfile } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const Profile = () => {
    const {data}=useQuery({
        queryKey:['profiless'],
        queryFn: userProfile
    })
    console.log('profile dat',data)
  return (
    <div>
      hello
    </div>
  )
}

export default Profile
