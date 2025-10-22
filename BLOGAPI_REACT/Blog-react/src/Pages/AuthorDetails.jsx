import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaFileAlt,
  FaEye,
  FaUserFriends,
  FaArrowLeft,
} from "react-icons/fa";

const AuthorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAuthorData();
    fetchAuthorBlogs(); // Track profile view
  }, [id]);

  useEffect(() => {
    if (author) {
      fetchAuthorBlogs();
    }
  }, [currentPage]);

  const fetchAuthorData = async () => {
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(`http://localhost:8080/api/v1/authors/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setAuthor(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching author:", error);
      setLoading(false);
    }
  };

  const fetchAuthorBlogs = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/posts/authors/${id}?pageNo=${currentPage}&pageSize=12`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setBlogs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching author blogs:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
        <p className="font-mono text-orange-500 tracking-widest">LOADING...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-bold font-mono tracking-tighter text-orange-500 mb-4">
            404 - AUTHOR NOT FOUND
          </h2>
          <button
            onClick={() => navigate("/authors")}
            className="mt-6 px-8 py-3 border border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all"
          >
            BACK TO AUTHORS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-12 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/authors")}
          className="mb-8 flex items-center gap-2 text-orange-500 font-mono text-sm tracking-widest hover:opacity-50 transition-opacity"
        >
          <FaArrowLeft className="w-4 h-4" />
          BACK TO AUTHORS
        </button>

        {/* Author Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Side - Avatar & Basic Info */}
          <div className="lg:col-span-4">
            <div className="border border-orange-500 p-8">
              {/* Avatar */}
              <div className="w-full aspect-square bg-orange-500 flex items-center justify-center mb-6">
                {author.authorPic ? (
                  <img
                    src={author.authorPic}
                    alt={author.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-32 h-32 text-white" />
                )}
              </div>

              {/* Name */}
              <h1 className="text-3xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                {author.userName.toUpperCase()}
              </h1>

              {/* Email */}
              <p className="font-mono text-sm tracking-wider text-orange-500 opacity-70 mb-6 pb-6 border-b border-orange-500">
                {author.email}
              </p>

              {/* Bio */}
              {author.bio && (
                <div className="mb-6 pb-6 border-b border-orange-500">
                  <h3 className="font-mono text-xs tracking-widest text-orange-500 mb-3">
                    BIO
                  </h3>
                  <p className="font-mono text-sm text-orange-500 opacity-70 leading-relaxed">
                    {author.bio}
                  </p>
                </div>
              )}

              {/* Social Links */}
              <div className="space-y-3">
                {author.githubLink && (
                  <a
                    href={author.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-orange-500 hover:opacity-50 transition-opacity"
                  >
                    <FaGithub className="w-5 h-5" />
                    <span className="font-mono text-sm tracking-wider">
                      GITHUB
                    </span>
                  </a>
                )}

                {author.linkedInLink && (
                  <a
                    href={author.linkedInLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-orange-500 hover:opacity-50 transition-opacity"
                  >
                    <FaLinkedin className="w-5 h-5" />
                    <span className="font-mono text-sm tracking-wider">
                      LINKEDIN
                    </span>
                  </a>
                )}

                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-orange-500 hover:opacity-50 transition-opacity"
                  >
                    <FaGlobe className="w-5 h-5" />
                    <span className="font-mono text-sm tracking-wider">
                      WEBSITE
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Stats & Blogs */}
          <div className="lg:col-span-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-orange-500 mb-12">
              <div className="bg-white p-8 text-center">
                <FaFileAlt className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {author.totalBlogs || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  POSTS
                </div>
              </div>

              <div className="bg-white p-8 text-center">
                <FaEye className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {author.totalViews || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  VIEWS
                </div>
              </div>

              <div className="bg-white p-8 text-center">
                <FaUserFriends className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {author.followers || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  FOLLOWERS
                </div>
              </div>

              <div className="bg-white p-8 text-center">
                <FaUserFriends className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {author.following || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  FOLLOWING
                </div>
              </div>
            </div>

            {/* Author's Blogs Section */}
            <div className="border border-orange-500 p-8">
              <h2 className="text-3xl font-bold font-mono tracking-tighter text-orange-500 mb-8 pb-4 border-b border-orange-500">
                PUBLISHED BLOGS
              </h2>

              {blogs.length === 0 ? (
                <p className="text-center py-12 font-mono text-sm tracking-wider text-orange-500 opacity-50">
                  NO PUBLISHED BLOGS YET
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-orange-500">
                    {blogs.map((blog) => (
                      <div
                        key={blog.id}
                        onClick={() => navigate(`/blogs/${blog.id}`)}
                        className="bg-white p-6 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer group"
                      >
                        {blog.image && (
                          <div className="mb-4">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-32 object-cover grayscale group-hover:grayscale-0 transition-all"
                            />
                          </div>
                        )}
                        <h3 className="font-mono text-lg tracking-tighter text-orange-500 group-hover:text-white mb-2 font-bold">
                          {blog.title.toUpperCase()}
                        </h3>
                        <p className="text-xs font-mono tracking-widest opacity-70">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-8 pt-8 border-t border-orange-500">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(0, prev - 1))
                        }
                        disabled={currentPage === 0}
                        className={`px-6 py-3 border border-orange-500 font-mono text-sm tracking-widest transition-all ${
                          currentPage === 0
                            ? "opacity-30 cursor-not-allowed text-orange-500"
                            : "hover:bg-orange-500 hover:text-white text-orange-500"
                        }`}
                      >
                        ←
                      </button>

                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          className={`px-6 py-3 border border-orange-500 font-mono text-sm tracking-widest transition-all ${
                            index === currentPage
                              ? "bg-orange-500 text-white"
                              : "text-orange-500 hover:opacity-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages - 1, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages - 1}
                        className={`px-6 py-3 border border-orange-500 font-mono text-sm tracking-widest transition-all ${
                          currentPage === totalPages - 1
                            ? "opacity-30 cursor-not-allowed text-orange-500"
                            : "hover:bg-orange-500 hover:text-white text-orange-500"
                        }`}
                      >
                        →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;
