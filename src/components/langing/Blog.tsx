"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "../shared/blog/blog";
import BlogFilter from "../blog/BlogFilter";
import { PlusCircleIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FetchBlog } from "@/lib/api";
import { BlogData } from "@/types/blog";

// URL validation function
const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Fallback image
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80";

const Blog = () => {
  const [filterData, setFilterData] = useState('all');
  const [blogData, setBlogData] = useState<BlogData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const {
    data: blogdatas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog"],
    queryFn: FetchBlog,
  });

  // Use useEffect to filter data when filterData or blogdatas changes
  useEffect(() => {
    if (!blogdatas) return;

    let filteredData: BlogData[];

    switch (filterData) {
      case 'all':
        filteredData = blogdatas;
        break;
      case 'Adventure':
        filteredData = blogdatas.filter((item: BlogData) => item.category === 'adventure');
        break;
      case 'Travel':
        filteredData = blogdatas.filter((item: BlogData) => item.category === 'travel');
        break;
      case 'Technology':
        filteredData = blogdatas.filter((item: BlogData) => item.category === 'technology');
        break;
      case 'Branding':
        filteredData = blogdatas.filter((item: BlogData) => item.category === 'branding');
        break;
      default:
        filteredData = blogdatas;
        break;
    }

    setBlogData(filteredData);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filterData, blogdatas]);

  // Pagination calculations
  const totalPages = Math.ceil(blogData.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentBlogs = blogData.slice(firstIndex, lastIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <section className="my-16">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-32">
            <p>Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-16">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-32">
            <p>Error loading blogs. Please try again.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <BlogFilter setFilterData={setFilterData} />
          <Link
            href={"/blog/blogcreate"}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Create Blog
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 items-stretch mb-8">
          {currentBlogs && currentBlogs.length > 0 ? (
            currentBlogs.map((item: BlogData) => {
              // Validate and sanitize image URL
              const imageUrl =
                item.image && isValidUrl(item.image)
                  ? item.image
                  : FALLBACK_IMAGE;

              return (
                <div key={item._id} className="h-full">
                  <BlogCard
                    image={imageUrl}
                    date={new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    tittle={item.title}
                    description={item.content}
                    type={item.category || "Uncategorized"}
                    likes={item.likes || []}
                    comments={item.comments || []}
                    id={item._id}
                    author={
                      item.author
                        ? {
                            name: item.author.name,
                            email: item.author.email,
                          }
                        : undefined
                    }
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <p className="text-gray-500 text-lg mb-4">No blogs found.</p>
                <Link
                  href="/blog/blogcreate"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Create First Blog
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {/* Previous Button */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                  currentPage === pageNumber
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {blogData.length > 0 && (
          <div className="text-center mt-4 text-gray-600">
            Showing {firstIndex + 1}-{Math.min(lastIndex, blogData.length)} of {blogData.length} blogs
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;