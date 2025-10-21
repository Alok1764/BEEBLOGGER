import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      setBlog(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
        <p className="font-mono text-orange-500 tracking-widest">LOADING...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-bold font-mono tracking-tighter text-orange-500 mb-4">
            404 - NOT FOUND
          </h2>
          <button
            onClick={() => navigate("/blogs")}
            className="mt-6 px-8 py-3 border border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all"
          >
            BACK TO BLOGS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32">
      <div className="max-w-4xl mx-auto px-12 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/blogs")}
          className="mb-8 px-6 py-3 border border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all"
        >
          ← BACK
        </button>

        {/* Blog Header */}
        <div className="mb-12 pb-8 border-b border-orange-500">
          <h1 className="text-5xl sm:text-6xl font-bold font-mono tracking-tighter text-orange-500 mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center gap-6 text-sm font-mono tracking-wider text-orange-500 opacity-70">
            <span>BY {blog.authorDTO.userName.toUpperCase()}</span>
            <span>•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            {/* <span>{blog.categories.name.toUpperCase()}</span> */}
          </div>
        </div>

        {/* Blog Image */}
        {blog.image && (
          <div className="mb-12 border border-orange-500">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          <div className="font-mono text-orange-500 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Comments Section (Optional) */}
        <div className="mt-20 pt-12 border-t border-orange-500">
          <h3 className="text-3xl font-bold font-mono tracking-tighter text-orange-500 mb-8">
            COMMENTS
          </h3>
          <p className="font-mono text-sm tracking-wider text-orange-500 opacity-50">
            COMING SOON...
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
