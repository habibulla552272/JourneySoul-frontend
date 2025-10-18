import Image from "next/image";
import React from "react";
import BlogComment from "./blogComment";

interface BlogCardProps {
  image: string;
  date: string;
  tittle: string;
  description: string;
  type: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  image,
  date,
  tittle,
  description,
  type,
}) => {
  return (
    <div className="flex flex-col justify-between h-full rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative w-full h-[250px]">
        <Image
          src={image}
          alt={tittle}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
        <p className="absolute top-4 right-4 bg-black/50 text-white text-xs uppercase px-3 py-1 rounded-full">
          {type}
        </p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-grw p-4">
        <div>
          <p className="text-gray-500 text-sm">{date}</p>
          <h2 className="text-lg font-semibold text-gray-800 mt-1 mb-2 hover:text-amber-500 transition-colors duration-300">
            {tittle}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description.length > 100
              ? description.slice(0, 100) + "..."
              : description}
          </p>
        </div>

        {/* Fixed bottom section */}
        <div className="pt-4">
          <BlogComment />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
