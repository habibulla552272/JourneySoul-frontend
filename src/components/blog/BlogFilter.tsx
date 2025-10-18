"use client";
import React, { useState } from "react";

const BlogFilter = () => {
  const [current, setCurrent] = useState("all");

  const filterData = [
    "all",
    "Adventure",
    "Travel",
    "Fashion",
    "Technology",
    "Branding",
  ];

  return (
    <ul className="flex flex-wrap items-center gap-3 justify-center py-4">
      {filterData.map((item, index) => (
        <li
          key={index}
          onClick={() => setCurrent(item)}
          className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 
          ${
            current === item
              ? "bg-amber-400 text-white shadow-md"
              : "text-gray-700 hover:text-amber-400"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default BlogFilter;
