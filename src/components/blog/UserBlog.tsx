import { useAllBlog } from '@/hooks/dashboard'
import { BlogData } from '@/types/blog'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

const UserBlog = () => {
  const { data, refetch } = useAllBlog()
  const [userId, setUserId] = useState<string | null>(null)
  const [filterSelfBlog, setFilterSelfBlog] = useState<BlogData[]>([])

  console.log('user self blog', data)

  useEffect(() => {
    // Get userId from localStorage on client side
    const user = localStorage.getItem('userId')
    setUserId(user)
  }, [])

  useEffect(() => {
    if (data && userId) {
      const filtered = data.filter((item: BlogData) => item?.author?._id === userId)
      setFilterSelfBlog(filtered)
    }
  }, [data, userId])

  console.log('user Id', userId)
  console.log('single blog', filterSelfBlog)

  // Delete blog function
  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        // Refresh the blog list after successful deletion
        refetch()
        alert('Blog deleted successfully!')
      } else {
        throw new Error('Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Error deleting blog. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Blogs</h2>
      
      {filterSelfBlog.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven&apos;t created any blogs yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterSelfBlog.map((blog: BlogData) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* Blog Image */}
              {blog.image && (
                <div className="h-48 overflow-hidden">
                  <Image
                    src={blog.image} 
                    alt={blog.title}
                    width={50}
                    height={50}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.content}
                </p>
                
                {/* Blog Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    blog.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {blog.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                  
                  <button
                    onClick={() => {
                      // Add edit functionality here
                      // router.push(`/edit-blog/${blog._id}`)
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserBlog