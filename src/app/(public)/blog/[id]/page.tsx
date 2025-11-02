import { CommentForm } from "@/components/blog/CommentForm";
import { LikeButton } from "@/components/blog/LikeButton";
import { BlogData } from "@/types/blog";
import Image from "next/image";
import { notFound } from "next/navigation";


interface BlogPageProps {
  params: { id: string };
}

const Page = async ({ params }: BlogPageProps) => {
  const { id } =await params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, {
    
      next: { revalidate: 120 }, // optional caching
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch blog: ${res.status}`);
    }

    const blog: BlogData = await res.json();

    if (!blog) {
      notFound();
    }

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>

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

        {blog.image && (
          <Image
            width={1000}
            height={700}
            src={blog.image}
            alt={blog.title}
            className="w-full aspect-[5/2] object-cover rounded-md mb-6"
            priority
          />
        )}

        <p className="text-gray-700 leading-relaxed mb-6">{blog.content}</p>

        {/* Like Button Section */}
        <div className="flex items-center justify-between mb-8 p-4 border rounded-lg bg-gray-50">
          <LikeButton blogId={id} initialLikes={blog.likes?.length || 0} />
          <p>👁️ Views: {blog.views ?? 0}</p>
          <p>Status: {blog.status ?? "published"}</p>
        </div>

        <div className="text-xs text-gray-400 mb-8">
          <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</p>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">
            Comments ({blog.comments?.length || 0})
          </h2>
          
          {/* Comment Form */}
          <CommentForm blogId={id} />
          
          {/* Comments List */}
          {blog.comments && blog.comments.length > 0 ? (
            <ul className="space-y-3 mt-6">
              {blog.comments.map((comment) => (
                <li key={comment._id} className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">
                      {comment.user?.name || "Anonymous"}:
                    </span>{" "}
                    {comment.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm mt-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    notFound();
  }
};

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return [];
    }

    const blogs: BlogData[] = await res.json();

    if (!Array.isArray(blogs)) return [];

    return blogs.map((post) => ({
      id: String(post._id),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default Page;