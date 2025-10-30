"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Ban, CheckCircle, Eye } from "lucide-react"
import { useAllBlog, useBlogDeleter } from "@/hooks/dashboard"
import { BlogData } from "@/types/blog"

export default function PostsPage() {
  const { data } = useAllBlog();
  console.log('blog data', data)
  const  deleteMutation= useBlogDeleter()

  // You'll need to implement these functions with actual API calls
  const handleSuspend = async (id: string) => {
    // TODO: Implement suspend/publish API call
    console.log('Suspend/publish post:', id)
  }

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id)
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get author name safely
  const getAuthorName = (author: BlogData['author']) => {
    return author?.name || 'Unknown Author'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Post Management</h1>
        <p className="text-muted-foreground mt-2">Manage, suspend, or delete blog posts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            Total: {data ? data.length : 0} posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Author</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Views</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((post: BlogData) => (
                    <tr key={post._id} className="border-b hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-sm font-medium">{post.title}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {getAuthorName(post.author)}
                      </td>
                      <td className="py-3 px-4 text-sm">{formatDate(post.createdAt)}</td>
                      <td className="py-3 px-4 text-sm flex items-center gap-1">
                        <Eye size={16} className="text-slate-400" />
                        {/* Add views count if available in your data, using likes as fallback */}
                        {post.likes?.length || 0}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            true // Replace with actual status from your data
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {/* You'll need to add status field to your BlogData interface */}
                          Published
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSuspend(post._id)}
                            className="p-2 hover:bg-yellow-100 rounded transition"
                            title="Suspend"
                          >
                            <Ban size={16} className="text-yellow-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="p-2 hover:bg-red-100 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-center text-sm text-muted-foreground">
                      No posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}