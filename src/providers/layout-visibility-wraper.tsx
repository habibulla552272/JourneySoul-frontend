
'use client'
import Footer from "@/components/shared/footer/Footer";
import Hero from "@/components/shared/hero/Hero";
import Navbar from "@/components/shared/navbar/Navbar";
import { usePathname } from "next/navigation";
import React from "react";

const HIDDEN_ROUTES = [
  "/signup",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/verify-otp",
  "/dashboard",
  "/signinaspage",
  "/forget-otp",
  "/forget-password",
  "/account/profile",
  "/account/change-password",
  "/account/booking-history",
  "/account/tour-history",
];

interface LayoutVisibilityWrapperProps {
  children: React.ReactNode;
}

const LayoutVisibilityWrapper: React.FC<LayoutVisibilityWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const shouldHideLayout = HIDDEN_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      {!shouldHideLayout && <Hero />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default LayoutVisibilityWrapper;
