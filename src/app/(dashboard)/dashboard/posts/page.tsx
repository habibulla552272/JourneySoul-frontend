"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Ban, CheckCircle, Eye } from "lucide-react"

interface Post {
  id: number
  title: string
  author: string
  date: string
  status: "published" | "suspended"
  views: number
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Getting Started with React",
      author: "Jane Smith",
      date: "2024-03-15",
      status: "published",
      views: 1250,
    },
    {
      id: 2,
      title: "Advanced TypeScript Tips",
      author: "John Doe",
      date: "2024-03-14",
      status: "published",
      views: 890,
    },
    { id: 3, title: "Spam Post", author: "Spam User", date: "2024-03-13", status: "suspended", views: 0 },
    {
      id: 4,
      title: "Next.js Best Practices",
      author: "Alice Brown",
      date: "2024-03-12",
      status: "published",
      views: 2100,
    },
    { id: 5, title: "CSS Grid Mastery", author: "Bob Johnson", date: "2024-03-11", status: "published", views: 1560 },
  ])

  const handleSuspend = (id: number) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, status: p.status === "published" ? "suspended" : "published" } : p)),
    )
  }

  const handleDelete = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id))
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
          <CardDescription>Total: {posts.length} posts</CardDescription>
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
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-sm font-medium">{post.title}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{post.author}</td>
                    <td className="py-3 px-4 text-sm">{post.date}</td>
                    <td className="py-3 px-4 text-sm flex items-center gap-1">
                      <Eye size={16} className="text-slate-400" />
                      {post.views}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          post.status === "published" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSuspend(post.id)}
                          className="p-2 hover:bg-yellow-100 rounded transition"
                          title={post.status === "published" ? "Suspend" : "Publish"}
                        >
                          {post.status === "published" ? (
                            <Ban size={16} className="text-yellow-600" />
                          ) : (
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-red-100 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
