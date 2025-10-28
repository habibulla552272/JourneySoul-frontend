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
import { be } from "zod/v4/locales";

// ✅ Validation Schema
const blogSchema = z.object({
  image: z.string().min(1, "Image is required"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  date: z.string().min(1, "Date is required"),
  content: z.string().min(10, "Description must be at least 10 characters"),
});

type BlogFormData = z.infer<typeof blogSchema>;

const CreateNewBlog = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      image: "",
      category: "",
      title: "",
      date: "",
      content: "",
    },
  });

  const [preview, setPreview] = React.useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setPreview(imgURL);
      setValue("image", file.name);
    }
  };
const onSubmit = async (data: BlogFormData) => {
  console.log("✅ Blog Data:", data);
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Fixed header name
      },
      body: JSON.stringify(data) // Removed semicolon, added missing parenthesis
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create blog');
    }

    const result = await res.json();
    console.log("✅ Blog created successfully:", result);
    
    toast.success("Blog created successfully!");
    reset();
    setPreview("");
    
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    toast.error(`Error:${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-neutral-800">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          ✍️ Create New Blog
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Image Upload */}
          <div className="flex flex-col space-y-2">
            <Label className="font-medium text-gray-700 dark:text-gray-300">Blog Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
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
            <Label className="font-medium text-gray-700 dark:text-gray-300">Category</Label>
            <Input
              type="text"
              placeholder="e.g. Travel, Food, Lifestyle"
              {...register("category")}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col space-y-2">
            <Label className="font-medium text-gray-700 dark:text-gray-300">Title</Label>
            <Input
              type="text"
              placeholder="Enter your blog title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col space-y-2">
            <Label className="font-medium text-gray-700 dark:text-gray-300">Date</Label>
            <Input type="date" {...register("date")} />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <Label className="font-medium text-gray-700 dark:text-gray-300">Description</Label>
            <Textarea
              placeholder="Write your blog content here..."
              {...register("content")}
              className="min-h-[120px]"
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
            >
              Publish Blog
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewBlog;
