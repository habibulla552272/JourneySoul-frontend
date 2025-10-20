"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Define schema with Zod
const blogSchema = z.object({
    image: z.string().min(1, "Image is required"),
    category: z.string().min(3, "Category must be at least 3 characters"),
    title: z.string().min(5, "Title must be at least 5 characters"),
    date: z.string().min(1, "Date is required"),
    description: z.string().min(20, "Description must be at least 20 characters"),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface CreateNewBlogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreateNewBlog: React.FC<CreateNewBlogProps> = ({ open, onOpenChange }) => {
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
            description: "",
        },
    });

    // ✅ Handle image upload and preview
    const [preview, setPreview] = React.useState<string>("");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imgURL = URL.createObjectURL(file);
            setPreview(imgURL);
            setValue("image", file.name); // store file name for validation
        }
    };

    // ✅ On Submit
    const onSubmit = (data: BlogFormData) => {
        console.log("✅ Blog Data:", data);
        toast.success("Blog created successfully!");
        reset();
        setPreview("");
        onOpenChange(false);
    };

 
   return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Create New Blog</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
                    {/* Image Upload */}
                    <div className="flex flex-col space-y-2">
                        <Label>Blog Image</Label>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded-lg border"
                            />
                        )}
                        {errors.image && (
                            <p className="text-red-500 text-sm">{errors.image.message}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="flex flex-col space-y-2">
                        <Label>Category</Label>
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
                        <Label>Title</Label>
                        <Input type="text" placeholder="Enter your blog title" {...register("title")} />
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div className="flex flex-col space-y-2">
                        <Label>Date</Label>
                        <Input type="date" {...register("date")} />
                        {errors.date && (
                            <p className="text-red-500 text-sm">{errors.date.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Write your blog description..."
                            className="min-h-[100px]"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-3 border-t mt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>

                        <Button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            Publish Blog
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );


};

export default CreateNewBlog;
