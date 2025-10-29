'use client';

import { allUserData, userProfile } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useAllUserData=()=>{
    return useQuery({
        queryKey:['all-users'],
        queryFn: ()=>allUserData(),
        
    })
}


export const useUserProfileData = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: userProfile,
  });
};


export interface IUser {
  _id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  role: 'user' | 'admin' | 'moderator' | string; // extend as needed
  isSuspended: boolean;
  suspendedAt: string | null;
  suspensionReason: string | null;
  tokenVersion: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
