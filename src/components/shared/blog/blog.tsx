import Image from "next/image";
import React from "react";
import BlogComment from "./blogComment";
import Link from "next/link";

interface BlogCardProps {
  image: string;
  date: string;
  tittle: string;
  description: string;
  type: string;
  id: string;
  likes?: string[]; // Changed from number to string[]
  comments?: number;
  author?: {
    name: string;
    email: string;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({
  id = "",
  image,
  date,
  tittle,
  description,
  type,
  likes = [],
  comments = 0,
  author,
}) => {
  const truncatedDescription =
    description.length > 100 ? `${description.slice(0, 100)}...` : description;
  console.log(likes, "likes000");
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative w-full aspect-5/3">
        <Image
          src={image}
          alt={tittle}
          width={500}
          height={300}
          className="object-cover hover:scale-105 w-full aspect-5/3 transition-transform duration-500"
        />
        <p className="absolute top-4 right-4 bg-black/50 text-white text-xs uppercase px-3 py-1 rounded-full">
          {type}
        </p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 justify-between p-4">
        <div className="flex-1">
          <p className="text-gray-500 text-sm">{date}</p>
          <h2 className="text-lg font-semibold overflow-hidden text-gray-800 mt-1 mb-2 hover:text-amber-500 transition-colors duration-300">
            {tittle}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncatedDescription}
          </p>
          {author && (
            <p className="text-gray-500 text-xs mt-2">By: {author.name}</p>
          )}
        </div>

        {/* Fixed bottom section */}
        <div className="pt-4 flex justify-between items-center">
          <BlogComment id={id} likes={likes} comments={comments} />
          <Link
            className="hover:border-b-1 font-normal text-xs pt-2 hover:border-green-300"
            href={`/blog/${tittle.toLowerCase().replace(/\s+/g, "-")}`}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
