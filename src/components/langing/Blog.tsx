"use client";
import React from "react";
import BlogCard from "../shared/blog/blog";
import BlogFilter from "../blog/BlogFilter";
import { PlusCircleIcon } from "lucide-react";
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
  const {
    data: blogdata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog"],
    queryFn: FetchBlog,
  });

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
          <BlogFilter />
          <Link
            href={"/blog/blogcreate"}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Create Blog
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 items-stretch">
          {blogdata && blogdata.length > 0 ? (
            blogdata.map((item: BlogData) => {
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
      </div>
    </section>
  );
};

export default Blog;