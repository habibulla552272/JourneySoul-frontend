'use client';
import { allUserData, singleuser, userDelete, userProfile } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner";

export const useAllUserData=()=>{
    return useQuery({
        queryKey:['users'],
        queryFn: allUserData,
    });
}

export const useSingleUser = (id: string) => {
  return useQuery({
    queryKey: ['singleuser', id],
    queryFn: () => singleuser(id),
    enabled: !!id, // Only run if id exists
  });
}

export const useUserDelete=()=>{
const queryclient=useQueryClient();

  return useMutation({
    mutationKey:['users'],
    mutationFn:(id:string)=>userDelete(id),
    onSuccess:(data)=>{
      toast.success(data.message || 'user delete successfuly')
      queryclient.invalidateQueries({
        queryKey:['users']
      })
    },
    onError:(error)=>{
      toast.error(error.message||' failed to delete User')
    }
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
  role: 'user' | 'admin' | 'moderator' | string; 
  isSuspended: boolean;
  suspendedAt: string | null;
  suspensionReason: string | null;
  tokenVersion: number;
  createdAt: string; 
  updatedAt: string; 
  __v: number;
}


export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator'; 
  profileImageUrl: string;
  isSuspended: boolean;
  suspendedAt: string | null;
  suspensionReason: string | null;
  tokenVersion: number;
  createdAt: string; 
  updatedAt: string; 
  __v: number;
}
