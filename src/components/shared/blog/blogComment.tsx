"use client";
import React, { useState, useEffect } from "react";
import {
  MessageSquareText,
  SendHorizontal,
  Share2,
  ThumbsUp,
  User,
  Check,
} from "lucide-react"; // Added Check icon
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { likeUnlike, getComments, createComment } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createKey } from "next/dist/shared/lib/router/router";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BlogCommentProps {
  likes: string[];
  comments: number;
  id: string;
}

export interface Comment {
  _id: string;
  user: users;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface users {
  _id: string;
  name: string;
  email: string;
}

interface CommentData {
  _id: string;
  content: Comment[];
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const BlogComment = ({ likes, comments, id }: BlogCommentProps) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [isCopied, setIsCopied] = useState(false); // Added state for copy feedback

  const queryClient = useQueryClient();
  const router = useRouter();
  console.log('coment 22', comments);

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getComments(id),
    enabled: commentOpen,
  });

  console.log("comment data", commentsData);

  // Like mutation
  const likeMutation = useMutation({
    mutationKey: ["likeBlog"],
    mutationFn: () => likeUnlike(id),
    onSuccess: (data) => {
      console.log(data);
      toast.success(hasLiked ? "Post liked" : "Post unliked!");
    },
    onError: (error) => {
      console.log(error);
      setHasLiked((prev) => !prev);
      setLikeCount((prev) => (hasLiked ? prev + 1 : prev - 1));
      toast.error("Error liking the post");
    },
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationKey: ["createComment", id],
    mutationFn: () => createComment(id, newComment.trim()),
    onSuccess: () => {
      toast.success("Comment added successfully!");
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to add comment");
    },
  });

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    setUserId(userIdFromStorage);
    setLikeCount(likes?.length || 0);
    if (userIdFromStorage && likes) {
      setHasLiked(likes.includes(userIdFromStorage));
    }
  }, [likes]);

  const handleCommentClick = () => {
    setCommentOpen(true);
  };

  const handleLike = () => {
    console.log(window.location.pathname);
    const redirectAfterLogin = window.location.pathname;
    if (!userId) {
      localStorage.setItem("redirectAfterLogin", redirectAfterLogin);
      setShowLoginDialog(true);
      return;
    } else {
      router.push(redirectAfterLogin);
    }

    // Optimistic update
    if (hasLiked) {
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
    }

    likeMutation.mutate();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setShowLoginDialog(true);
      return;
    }
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    createCommentMutation.mutate();
  };

  const readmoreHandel = () => {
    router.push(`/blog/${id}`);
  };

  // Share functionality - Copy blog URL to clipboard
  const handleShare = async () => {
    try {
      // Construct the blog URL

      const blogUrl = `${window.location.origin}/blog/${id}`;
      console.log(blogUrl)
      // Use the Clipboard API
      await navigator.clipboard.writeText(blogUrl);
      // Show success feedback
      setIsCopied(true);
      toast.success("Blog link copied to clipboard!");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  // Alternative share method that works on all devices
  const handleShareWithFallback = async () => {
    const blogUrl = `${window.location.origin}/blog/${id}`;
    
    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this blog post!',
          text: 'I found this interesting blog post and wanted to share it with you.',
          url: blogUrl,
        });
        return;
      } catch (error) {
        console.log('Web Share API failed, falling back to clipboard');
      }
    }
    
    // Fallback to clipboard
    handleShare();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-3 gap-5 pt-4 text-gray-700">
          <p
            className={`flex items-center gap-1 ${hasLiked ? "text-green-500" : "text-gray-700"
              }`}
          >
            <ThumbsUp
              className={`w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300 ${hasLiked ? "text-green-500 bg-green-100 rounded-full" : ""
                } ${likeMutation.isPending ? "opacity-50" : ""}`}
              strokeWidth={1.5}
              onClick={handleLike}
            />
            <span>{likeCount}</span>
          </p>

          <p
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleCommentClick}
          >
            <MessageSquareText
              className="w-8 h-8 hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
              strokeWidth={1.5}
            />
            <span>{comments}</span>
          </p>

          {/* Share Button with Copy Feedback */}
          <p className="flex items-center gap-1">
            <button
              onClick={handleShareWithFallback}
              className="flex items-center gap-1 cursor-pointer group"
              title="Share this blog"
            >
              {isCopied ? (
                <Check
                  className="w-8 h-8 bg-green-400 text-white rounded-full p-2 transition-all duration-300"
                  strokeWidth={1.5}
                />
              ) : (
                <Share2
                  className="w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
                  strokeWidth={1.5}
                />
              )}
            </button>
          </p>
        </div>
        <Button
          onClick={readmoreHandel}
          className="hover:border-b-1 font-normal text-xs pt-2 hover:border-green-300"
        >
          Read More
        </Button>
      </div>

      <Dialog open={commentOpen} onOpenChange={setCommentOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Comments ({comments})</DialogTitle>
          </DialogHeader>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {isLoading ? (
              <div className="text-center py-4">Loading comments...</div>
            ) : commentsData?.length > 0 ? (
              commentsData?.map((comment: Comment) => (
                <div
                  key={comment._id}
                  className="flex gap-3 p-3 border rounded-lg"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {comment?.user?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquareText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="mt-4 pt-4 border-t">
            <div className="flex gap-2">
              <input
                className="flex-1 outline-none px-3 py-2 border rounded-lg text-sm"
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={createCommentMutation.isPending}
              />
              <Button
                type="submit"
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="cursor-pointer bg-green-500 hover:bg-green-600 text-white"
              >
                <SendHorizontal
                  strokeWidth={1}
                  className={
                    createCommentMutation.isPending ? "animate-pulse" : ""
                  }
                />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
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

export default BlogComment;