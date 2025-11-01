"use client";

import { createComment } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface CommentFormProps {
    blogId: string;
}

export const CommentForm = ({ blogId }: CommentFormProps) => {
    const [comment, setComment] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const createCommentMutation = useMutation({
        mutationKey: ["createComment", blogId],
        mutationFn: () => createComment(blogId, comment.trim()),
        onSuccess: () => {
            toast.success("Comment added successfully!");
            setComment("");
            setName("");
            setIsSubmitting(false);
            // Refresh comments list
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
        onError: (error) => {
            console.log(error);
            toast.error("Failed to add comment");
            setIsSubmitting(false);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!comment.trim()) return;

        setIsSubmitting(true);
        createCommentMutation.mutate();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Comment
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your comment here..."
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Submitting..." : "Post Comment"}
            </button>
        </form>
    );
};