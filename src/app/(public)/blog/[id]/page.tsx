import { BlogData } from "@/types/blog";
import Image from "next/image";
import { notFound } from "next/navigation";

interface BlogPageProps {
  params: { id: string };
}

const Page = async ({ params }: BlogPageProps) => {
  // console.log('parammsss',params)
  const { id } = await params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, {
      next: { revalidate: 120 }, // optional caching
    });

    if (!res.ok) {
      // console.error("Fetch failed:");
  
      throw new Error(`Failed to fetch blog`);
    }

    const blog: BlogData = await res.json();

    if (!blog) notFound();

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
          />
        )}

        <p className="text-gray-700 leading-relaxed mb-6">{blog.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <p>❤️ Likes: {blog.likes?.length || 0}</p>
          <p>👁️ Views: {blog.views ?? 0}</p>
          <p>Status: {blog.status ?? "published"}</p>
        </div>

        <div className="text-xs text-gray-400">
          <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">
            Comments ({blog.comments?.length || 0})
          </h2>
          {blog.comments && blog.comments.length > 0 ? (
            <ul className="space-y-3">
              {blog.comments.map((comment, index) => (
                <li key={index} className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">
                      {comment.user || "Anonymous"}:
                    </span>{" "}
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
  } catch (error) {
    console.error("Error fetching blog:", error);
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Failed to Load Blog
        </h1>
        <p className="text-gray-600 mb-4">
          We&apos;re having trouble loading this blog post. Please try again later.
        </p>
      </div>
    );
  }
};

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`,{
      
    });
    // console.log('res data ',res)
    const blogs = await res.json();

    if (!Array.isArray(blogs)) return [];

    return blogs.map((post: BlogData) => ({
      id: String(post._id),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default Page;
