"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";

// ✅ Validation Schema
const blogSchema = z.object({
  image: z.string().min(1, "Image is required"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Description must be at least 10 characters"),
});

type BlogFormData = z.infer<typeof blogSchema>;

const CreateNewBlog = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      image: "",
      category: "",
      title: "",
      content: "",
    },
  });

  const [preview, setPreview] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "First_Time_using");

      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_URL}`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const uploadedImageURL = await res.json();
      const secureUrl =
        uploadedImageURL.secure_url ||
        uploadedImageURL.url.replace(/^http:\/\//, "https://");

      setPreview(secureUrl);
      setValue("image", secureUrl);
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    console.log("✅ Blog Data:", data);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create blog");
      }

      const result = await res.json();
      console.log("✅ Blog created successfully:", result);

      toast.success("Blog created successfully!");
      reset();
      setPreview("");
    } catch (error) {
      console.error("❌ Error creating blog:", error);
      toast.error(
        `Error:${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  // Disable button when uploading image or submitting form
  const isButtonDisabled = isUploading || isSubmitting;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Link className="my-10 cursor-pointer" href={"/"}>
        <Button className="my-6 cursor-pointer">Back to Home</Button>
      </Link>

      <div className="bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-neutral-800">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          ✍️ Create New Blog
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Image Upload */}
          <div className="flex flex-col space-y-2">
            <Label className="font-medium text-gray-700 dark:text-gray-300">
              Blog Image
            </Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              disabled={isUploading || isSubmitting}
            />
            {isUploading && (
              <p className="text-blue-500 text-sm">Uploading image...</p>
            )}
            {preview && (
              <div className="mt-3">
                <Image
                  width={400}
                  height={200}
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col space-y-2">
            <Label className="font-medium text-gray-700 dark:text-gray-300">
              Category
            </Label>

            <select
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("category")}
              disabled={isSubmitting}
            >
              <option value="">Select Category</option>
              <option value="adventure">Adventure</option>
              <option value="travel">Travel</option>
              <option value="fashion">Fashion</option>
              <option value="technology">Technology</option>
              <option value="branding">Branding</option>
            </select>

            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col space-y-2">
            <Label className="font-medium text-gray-700 dark:text-gray-300">
              Title
            </Label>
            <Input
              type="text"
              placeholder="Enter your blog title"
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <Label className="font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              placeholder="Write your blog content here..."
              {...register("content")}
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-neutral-800">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-5"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isUploading ? "Uploading..." : "Publishing..."}
                </span>
              ) : (
                "Publish Blog"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewBlog;