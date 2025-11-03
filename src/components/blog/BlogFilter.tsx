"use client";
import React, { useState } from "react";

type FilterType = 
  | "All" 
  | "Adventure" 
  | "Travel" 
  | "Fashion" 
  | "Technology" 
  | "Branding";

interface BlogFilterProps {
  setFilterData: (filter: FilterType) => void;
}

const BlogFilter = ({ setFilterData }: BlogFilterProps) => {
  const [current, setCurrent] = useState<FilterType>("All");

  const filterData: FilterType[] = [
    "All",
    "Adventure",
    "Travel",
    // "Travel",
    "Technology",
    "Branding",
  ];

  const handleFilter = (item: FilterType) => {
    setCurrent(item);
    setFilterData(item);
  };

  return (
    <ul className="flex flex-wrap items-center gap-3 justify-center py-4">
      {filterData.map((item, index) => (
        <li
          key={index}
          onClick={() => handleFilter(item)}
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