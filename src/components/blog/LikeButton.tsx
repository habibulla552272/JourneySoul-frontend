"use client";

import { likeUnlike } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface LikeButtonProps {
    blogId: string;
    initialLikes: number;
}

export const LikeButton = ({ blogId, initialLikes }: LikeButtonProps) => {
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const likeMutation = useMutation({
        mutationKey: ["likeBlog", blogId],
        mutationFn: () => likeUnlike(blogId),
        onMutate: () => {
            // Optimistic update
            setHasLiked(prev => !prev);
            setLikeCount(prev => hasLiked ? prev - 1 : prev + 1);
        },
        onSuccess: (data) => {
            console.log(data);
            toast.success(hasLiked ? "Post unliked!" : "Post liked");
            setIsLoading(false);
        },
        onError: (error) => {
            // Revert optimistic update
            console.log(error);
            setHasLiked(prev => !prev);
            setLikeCount(prev => (hasLiked ? prev + 1 : prev - 1));
            toast.error("Error liking the post");
            setIsLoading(false);
        },
    });

    const handleLike = async () => {
        if (isLoading) return;
        setIsLoading(true);
        likeMutation.mutate();
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasLiked
                    ? "bg-red-100 text-red-600 border border-red-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <span className="text-lg">{hasLiked ? "❤️" : "🤍"}</span>
            <span>Like ({likeCount})</span>
        </button>
    );
};