"use client";

import React from "react";
import { useUserProfileData } from "@/hooks/dashboard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useUserProfileData();
  const user = data?.data?.user;

  if (isLoading) {
    return <div className="text-sm text-gray-500 text-center">Loading...</div>;
  }

  if (isError || !user) {
    return (
      <div className="text-sm text-red-500 text-center">
        Failed to load profile.
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    const first = words[0]?.[0] || "";
    const last = words.length > 1 ? words[words.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl  w-fit mx-auto">
      {user.profileImageUrl ? (
        <div className="w-14 h-14 relative">
          <Image
            src={user.profileImageUrl}
            alt={user.name}
            fill
            className="rounded-full object-cover border border-gray-200"
          />
        </div>
      ) : (
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white font-semibold text-lg">
          {getInitials(user.name)}
        </div>
      )}

      <div className="flex items-center justify-center ">
        <h2 className="text-sm font-semibold leading-tight">{user.name}</h2>

        {
          user.role === "admin" ? (
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="h-6 text-[11px] px-2 mt-1"
            >
              Go to Dashboard
            </Button>
          ) : (
            ""
          )
          // (
          //   <p className="text-xs text-gray-500 mt-1">
          //     Welcome, {user.name.split(' ')[0]}!
          //   </p>
          // )
        }
      </div>
    </div>
  );
};

export default Profile;
