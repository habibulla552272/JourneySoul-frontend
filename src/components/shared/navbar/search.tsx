"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FetchBlog } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Define the type for blog items
interface BlogItem {
  _id: string;
  title: string;
  category: string;
  image?: string;
}

const SearchCom = () => {
  const [showdata, setShowdata] = useState<BlogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const {
    data: blogdata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog"],
    queryFn: FetchBlog,
  });

  // Helper function to validate and format image paths
  const getValidImageSrc = (path: string | undefined): string => {
    if (!path) return "";

    // If it's already an absolute URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // If it's a relative path, ensure it starts with leading slash
    return path.startsWith('/') ? path : `/${path}`;
  };

  // Check if image path is valid for Next.js Image component
  const isValidImagePath = (path: string | undefined): boolean => {
    if (!path) return false;
    return path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setShowdata([]);
      return;
    }

    if (blogdata) {
      const filterdata = blogdata.filter(
        (item: BlogItem) =>
          item.category?.toLowerCase().includes(value.toLowerCase()) ||
          item.title?.toLowerCase().includes(value.toLowerCase())
      );
      setShowdata(filterdata);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Optional: Add submit logic if needed
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const handelsingleblog = (id: string) => {

    const redirectAfterLogin = window.location.pathname;
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.setItem('redirectAfterLogin',redirectAfterLogin)
      setShowLoginDialog(true)
      return;
    }else{
      router.push(redirectAfterLogin)
    }

    router.push(`/blog/${id}`)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-1 border-1 rounded-xl">
        <input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by category or title..."
          className="w-full text-white outline-none pl-3 bg-transparent"
        />
        <button
          type="submit"
          className="h-full bg-green-400 rounded-xl cursor-pointer px-1 py-1 w-fit"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showdata.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-2 shadow-lg z-10 max-h-60 overflow-y-auto">
          {showdata.map((item) => (
            <div onClick={() => handelsingleblog(item._id)}
              key={item._id}
              className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer h-16 overflow-hidden"
            >
              <div className="flex items-center gap-3">
                {item?.image && isValidImagePath(item.image) ? (
                  <Image
                    src={getValidImageSrc(item.image)}
                    alt={item?.title || "Blog image"}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  // Fallback when no image or invalid image path
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                    <span className="text-xs">No Image</span>
                  </div>
                )}
                <div>
                  {item.title && (
                    <h2 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h2>
                  )}
                  {item.category && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Category: {item.category}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {searchTerm && showdata.length === 0 && blogdata && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-2 p-3 text-center text-gray-500 dark:text-gray-400">
          No results found for &apos;{searchTerm}&apos;
        </div>
      )}

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to like or comment on posts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLoginDialog(false);
                router.push("/login");
              }}
            >
              Login Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchCom;