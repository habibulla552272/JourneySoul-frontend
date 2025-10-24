import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TanstackProvider from "../providers/tanstack-provider";
import Navbar from "@/components/shared/navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import LayoutVisibilityWrapper from "@/providers/layout-visibility-wraper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Journeysoul",
  description: "This is a Blog site Crate you one Happynes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <TanstackProvider>
        <LayoutVisibilityWrapper>


            {/* <Navbar /> */}
            {children}
            <Toaster position="top-center" richColors closeButton duration={5000} visibleToasts={3} offset={16} />
        </LayoutVisibilityWrapper>
          </TanstackProvider>
      </body>
    </html>
  );
}
