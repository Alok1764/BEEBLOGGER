import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa6";

const BlogCards2 = ({ blogs }) => {
  return (
    <div className="border border-orange-500 bg-white p-8 flex-1  shadow-md">
      <div
        className="
          grid 
          md:grid-cols-3 
          sm:grid-cols-2 
          grid-cols-1 
          gap-8
        "
      >
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            className="
              p-6 
              bg-white 
              border border-orange-500 
              hover:bg-orange-500 
              hover:text-white 
              hover:-translate-y-1 
              hover:shadow-lg 
              transition-all 
              duration-300 
              group 
              flex 
              flex-col
            "
          >
            <div className="overflow-hidden mb-6 rounded-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="
                  w-full 
                  h-48 
                  object-cover 
                  grayscale 
                  group-hover:grayscale-0 
                  transition-all 
                  duration-300
                "
              />
            </div>

            <h3
              className="
                mb-4 
                font-bold 
                font-mono 
                text-xl 
                tracking-tighter 
                text-orange-500 
                group-hover:text-white 
                transition-colors
              "
            >
              {blog.title.toUpperCase()}
            </h3>

            <p
              className="
                mb-3 
                flex 
                items-center 
                text-sm 
                font-mono 
                tracking-wider 
                opacity-70
              "
            >
              <FaUser className="inline mr-2" />
              {blog.authorDTO.name.toUpperCase()}
            </p>

            <p
              className="
                text-xs 
                font-mono 
                tracking-widest 
                opacity-70
              "
            >
              PUBLISHED: <span className="italic">DATE TO UPDATE</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogCards2;
