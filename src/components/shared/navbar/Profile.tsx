"use client";

import React from "react";
import { useUserProfileData } from "@/hooks/dashboard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Menubar,

  MenubarContent,
  MenubarItem,
  MenubarMenu,




  MenubarTrigger,
} from "@/components/ui/menubar";
import Cookies from 'js-cookie';

const Profile = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useUserProfileData();
  const user = data?.data?.user;
  

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    const first = words[0]?.[0] || "";
    const last = words.length > 1 ? words[words.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  // Show login button when user is not logged in
  if (isError || !user) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-xl w-fit mx-auto">
        <Button
          onClick={() => router.push("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
        >
          Login
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-xl w-fit mx-auto">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  const handelLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear cookies
    Cookies.remove("token", { path: "/" });
    Cookies.remove("userId", { path: "/" });
    Cookies.remove("userRole", { path: "/" });

    // Optional: Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl w-fit mx-auto">
      <Menubar className="w-14 h-14 rounded-full">
        <MenubarMenu>
          <MenubarTrigger>
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
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/userprofile">Profile</Link>
            </MenubarItem>
            <MenubarItem onClick={handelLogout}>Logout</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <div className="flex flex-col items-start justify-center">
        <h2 className="text-sm font-semibold leading-tight">{user.name}</h2>

        {user.role === "admin" ? (
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="h-6 text-[11px] text-black px-2 mt-1"
          >
            Go to Dashboard
          </Button>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Welcome, {user.name.split(" ")[0]}!
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
