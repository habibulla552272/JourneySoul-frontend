import Link from "next/link";
import React, { useState, useEffect } from "react";
import SearchCom from "./search";
import Profile from "./Profile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Add this useEffect to handle body scroll
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Main Navbar */}
      <nav className="py-4 md:py-8 absolute text-white top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <div className="w-auto">
            <h2 className="text-xl md:text-2xl font-bold font-serif">
              The JourneySoul
            </h2>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:block w-[70%]">
            <ul className="grid grid-cols-11 items-center">
              <li className="">
                <Link href={"/"}>Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="blog">Blog</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li className="col-span-4">
                <SearchCom />
              </li>
              <li className="col-span-3">
                <Profile />
              </li>
            </ul>
          </div>

          {/* Mobile Search & Profile - Hidden on desktop */}
          <div className="flex lg:hidden items-center space-x-4">
  

            {/* Search Bar for Tablet - Hidden on small mobile */}
            <div className="hidden lg:block">
              <SearchCom />
            </div>

            {/* Profile for Tablet - Hidden on small mobile */}
            <div className="hidden lg:block">
              <Profile />
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2.5" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      <div
        className={`fixed inset-0 w-full h-full bg-black lg:hidden transition-all duration-500 ease-in-out z-40 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`w-full h-full transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <div className="absolute top-6 right-6 z-60">
            <button
              onClick={toggleMenu}
              className="p-3 text-white text-2xl bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-700 transition-colors"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Mobile Menu Content - Centered */}
          <div className="flex flex-col items-center justify-center h-full px-6 space-y-12">
            {/* Full Width Search Bar in Mobile Menu */}
            <div className="w-full max-w-md">
              <div className="text-lg font-semibold text-white mb-3 text-center">
                Search
              </div>
              <SearchCom />
            </div>

            {/* Navigation Links - No borders, clean design */}
            <ul className="flex flex-col items-center space-y-8 text-2xl w-full max-w-md">
              <li className="w-full text-center">
                <Link
                  href={"/"}
                  className="block text-white hover:text-gray-300 transition-colors duration-200 py-4 font-medium"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li className="w-full text-center">
                <Link
                  href="/about"
                  className="block text-white hover:text-gray-300 transition-colors duration-200 py-4 font-medium"
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>
              <li className="w-full text-center">
                <Link
                  href="blog"
                  className="block text-white hover:text-gray-300 transition-colors duration-200 py-4 font-medium"
                  onClick={closeMenu}
                >
                  Blog
                </Link>
              </li>
              <li className="w-full text-center">
                <Link
                  href="/contact"
                  className="block text-white hover:text-gray-300 transition-colors duration-200 py-4 font-medium"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Profile Section in Mobile Menu */}
            <div className="w-full max-w-md pt-6">
              <div className="text-lg font-semibold text-white mb-4 text-center">
                Account
              </div>
              <div className="flex justify-center">
                <Profile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
