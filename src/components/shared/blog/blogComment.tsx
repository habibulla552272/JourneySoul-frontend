"use client";
import React, { useState, useEffect } from "react";
import {
  MessageSquareText,
  SendHorizontal,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { likeUnlike } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface BlogCommentProps {
  likes: string[]; // Array of user IDs who liked the post
  comments: number;
  id: string;
}

const BlogComment = ({ likes, comments, id }: BlogCommentProps) => {
  const [comment, setComment] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  console.log("blog id", id);

  const likeMutation = useMutation({
    mutationKey: ["likeBlog"],
    mutationFn: (id:string) => likeUnlike(id),
    onSuccess: (data) => {
      toast.success("Post unliked");
      //  toast.success();
    },
    onError: (error) => {
      toast.error("Error Likeing the post");
    },
  });
  useEffect(() => {
    // Get userId from localStorage on client side only
    const id = localStorage.getItem("userId");
    setUserId(id);

    // Initialize like count and check if current user has liked
    setLikeCount(likes?.length || 0);
    console.log("likeddddd", likes);
    if (id && likes) {
      setHasLiked(likes.includes(id));
    }
  }, [likes]);

  const handleComment = () => {
    toast.success("Thank you for your comment");
    setComment(!comment);
  };

  const handleLike = () => {
    if (!userId) {
      toast.error("Please login to like posts");
      return;
    }

    if (hasLiked) {
      // Unlike the post
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
      likeMutation.mutate(id);
    } else {
      // Like the post
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
      likeMutation.mutate(id);
    }

    // Here you would typically make an API call to update the like on the server
    // await update
    // LikeOnServer(blogId, userId);
  };

  console.log(hasLiked, "hasliked");

  return (
    <div>
      <div className="grid grid-cols-3 gap-5 pt-4 text-gray-700">
        <p
          className={`flex items-center gap-1 ${
            hasLiked ? "text-green-500" : "text-gray-700"
          }`}
        >
          <ThumbsUp
            className={`w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300 ${
              hasLiked ? "text-green-500" : ""
            }`}
            strokeWidth={1.5}
            onClick={handleLike}
          />
          <span>{likeCount}</span>
        </p>

        <p className="flex items-center gap-1" onClick={handleComment}>
          <MessageSquareText
            className="w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
            strokeWidth={1.5}
          />
          <span>{comments}</span>
        </p>

        <p>
          <Share2
            className="w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
            strokeWidth={1.5}
          />
        </p>
      </div>

      {comment && (
        <div>
          <p className="border-1 rounded-2xl flex gap-1 mt-2">
            <input
              className="w-full outline-none px-3 py-1 border rounded-lg"
              type="text"
              placeholder="Add a comment..."
            />
            <Button
              onClick={handleComment}
              className="cursor-pointer bg-green-500 hover:bg-green-600 text-white"
            >
              <SendHorizontal strokeWidth={1} />
            </Button>
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogComment;
