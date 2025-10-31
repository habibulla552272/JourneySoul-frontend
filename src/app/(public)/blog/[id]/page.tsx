import { AllBlogsForStatic, SingleBlogForStatic } from "@/lib/api";
import { BlogData } from "@/types/blog";
import Image from "next/image";
import { notFound } from "next/navigation";


interface BlogPageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: BlogPageProps) => {
  const { id } = params;

  try {
    const blog: BlogData = await SingleBlogForStatic(id);
    console.log('blog why no found',blog)
    if (!blog) {
      notFound();
    }

    return (
      <div className="container mx-auto p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>

        {/* Category and Author */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <p>
            Category:{" "}
            <span className="font-medium text-gray-700">
              {blog.category || "Uncategorized"}
            </span>
          </p>
          <p>
            Author:{" "}
            <span className="font-medium text-gray-700">
              {blog.author?.name || "Unknown"}
            </span>
          </p>
        </div>

        {/* Blog Image */}
        {blog.image && (
          <Image
            width={1000}
            height={700}
            src={blog.image}
            alt={blog.title}
            className="w-full aspect-5/2 object-cover rounded-md mb-6"
          />
        )}

        {/* Content */}
        <p className="text-gray-700 leading-relaxed mb-6">{blog.content}</p>

        {/* Blog Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <p>Likes: ❤️ {blog.likes?.length || 0}</p>
          <p>Views: 👁️ {blog.views ?? 0}</p>
          <p>Status: {blog.status ?? "published"}</p>
        </div>

        {/* Created and Updated Dates */}
        <div className="text-xs text-gray-400">
          <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</p>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">
            Comments ({blog.comments?.length || 0})
          </h2>
          {blog.comments && blog.comments.length > 0 ? (
            <ul className="space-y-3">
              {blog.comments.map((comment, index) => (
                <li key={index} className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{comment.user || "Anonymous"}:</span>{" "}
                    {comment.text}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}
        </div>
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    
    // Check if it's a 404 error
    if (error?.response?.status === 404) {
      notFound();
    }
    
    // Return a user-friendly error message
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to Load Blog
          </h1>
          <p className="text-gray-600 mb-4">
            We&apos;re having trouble loading this blog post. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
};

export async function generateStaticParams() {
  try {
    const blogs = await AllBlogsForStatic();
    console.log('blogssss ',blogs)
    if (!Array.isArray(blogs) || blogs.length === 0) {
      console.warn("No blogs found for static generation");
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return blogs.map((post: any) => ({
      id: String(post._id || post.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default Page;