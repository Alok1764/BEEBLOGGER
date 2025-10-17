import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaGithub, FaLinkedin, FaGlobe, FaEdit } from "react-icons/fa";
import Navbar2 from "../components/Dashboard/Navbar2";
const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      fetchMyBlogs();
    }
  }, [currentPage, profileData]);

  const fetchProfileData = async () => {
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(
        "http://localhost:8080/api/v1/authors/loggedIn-user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setProfileData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const fetchMyBlogs = async () => {
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(
        `http://localhost:8080/api/v1/posts/my-posts?pageNo=${currentPage}&pageSize=12`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setBlogs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
        <p className="font-mono text-orange-500 tracking-widest">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-12 py-12">
        <Navbar2 />
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-12 pb-6 border-b border-orange-500">
          <h1 className="text-5xl font-bold font-mono tracking-tighter text-orange-500">
            PROFILE
          </h1>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex items-center gap-3 px-8 py-3 border border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all"
          >
            <FaEdit />
            {isEditMode ? "CANCEL" : "EDIT PROFILE"}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Left Side - Profile Info */}
          <div className="lg:col-span-4">
            <div className="border border-orange-500 p-8">
              {/* Profile Picture */}
              <div className="mb-8">
                <div className="w-full aspect-square bg-orange-500 flex items-center justify-center mb-4">
                  {profileData.authorPic ? (
                    <img
                      src={profileData.authorPic}
                      alt={profileData.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-32 h-32 text-white" />
                  )}
                </div>
                {isEditMode && (
                  <button className="w-full py-3 border border-orange-500 text-orange-500 font-mono text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                    UPLOAD IMAGE
                  </button>
                )}
              </div>

              {/* Name & Email */}
              <div className="mb-8 pb-8 border-b border-orange-500">
                <h2 className="text-2xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {profileData.name}
                </h2>
                <p className="font-mono text-sm tracking-wider text-orange-500 opacity-70">
                  {profileData.email}
                </p>
              </div>

              {/* Bio */}
              <div className="mb-8 pb-8 border-b border-orange-500">
                <h3 className="font-mono text-sm tracking-widest text-orange-500 mb-3">
                  BIO
                </h3>
                {isEditMode ? (
                  <textarea
                    className="w-full p-3 border border-orange-500 font-mono text-sm text-orange-500 bg-white focus:outline-none"
                    rows="4"
                    defaultValue={profileData.bio || ""}
                    placeholder="ADD YOUR BIO..."
                  />
                ) : (
                  <p className="font-mono text-sm text-orange-500 opacity-70 leading-relaxed">
                    {profileData.bio || "NO BIO ADDED YET"}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-mono text-sm tracking-widest text-orange-500 mb-4">
                  LINKS
                </h3>
                <div className="space-y-3">
                  {/* GitHub */}
                  {isEditMode ? (
                    <div className="flex items-center gap-3">
                      <FaGithub className="w-5 h-5 text-orange-500" />
                      <input
                        type="text"
                        className="flex-1 p-2 border border-orange-500 font-mono text-xs text-orange-500 bg-white focus:outline-none"
                        placeholder="GITHUB URL"
                        defaultValue={profileData.githubLink || ""}
                      />
                    </div>
                  ) : profileData.githubLink ? (
                    <a
                      href={profileData.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-orange-500 hover:opacity-50 transition-opacity"
                    >
                      <FaGithub className="w-5 h-5" />
                      <span className="font-mono text-sm tracking-wider">
                        GITHUB
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-orange-500 opacity-30">
                      <FaGithub className="w-5 h-5" />
                      <span className="font-mono text-xs tracking-wider">
                        ADD GITHUB
                      </span>
                    </div>
                  )}

                  {/* LinkedIn */}
                  {isEditMode ? (
                    <div className="flex items-center gap-3">
                      <FaLinkedin className="w-5 h-5 text-orange-500" />
                      <input
                        type="text"
                        className="flex-1 p-2 border border-orange-500 font-mono text-xs text-orange-500 bg-white focus:outline-none"
                        placeholder="LINKEDIN URL"
                        defaultValue={profileData.linkedInLink || ""}
                      />
                    </div>
                  ) : profileData.linkedInLink ? (
                    <a
                      href={profileData.linkedInLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-orange-500 hover:opacity-50 transition-opacity"
                    >
                      <FaLinkedin className="w-5 h-5" />
                      <span className="font-mono text-sm tracking-wider">
                        LINKEDIN
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-orange-500 opacity-30">
                      <FaLinkedin className="w-5 h-5" />
                      <span className="font-mono text-xs tracking-wider">
                        ADD LINKEDIN
                      </span>
                    </div>
                  )}

                  {/* Website */}
                  {isEditMode ? (
                    <div className="flex items-center gap-3">
                      <FaGlobe className="w-5 h-5 text-orange-500" />
                      <input
                        type="text"
                        className="flex-1 p-2 border border-orange-500 font-mono text-xs text-orange-500 bg-white focus:outline-none"
                        placeholder="WEBSITE URL"
                        defaultValue={profileData.website || ""}
                      />
                    </div>
                  ) : profileData.website ? (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-orange-500 hover:opacity-50 transition-opacity"
                    >
                      <FaGlobe className="w-5 h-5" />
                      <span className="font-mono text-sm tracking-wider">
                        WEBSITE
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-orange-500 opacity-30">
                      <FaGlobe className="w-5 h-5" />
                      <span className="font-mono text-xs tracking-wider">
                        ADD WEBSITE
                      </span>
                    </div>
                  )}
                </div>

                {isEditMode && (
                  <button className="w-full mt-6 py-3 bg-orange-500 text-white font-mono text-sm tracking-widest hover:bg-white hover:text-orange-500 border border-orange-500 transition-all">
                    SAVE CHANGES
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Stats & Blogs */}
          <div className="lg:col-span-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-px bg-orange-500 mb-12">
              <div className="bg-white p-8 text-center">
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {profileData.totalBlogs || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  TOTAL BLOGS
                </div>
              </div>
              <div className="bg-white p-8 text-center">
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  0
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  TOTAL VIEWS
                </div>
              </div>
              <div className="bg-white p-8 text-center">
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  0
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  FOLLOWERS
                </div>
              </div>
            </div>

            {/* My Blogs Section */}
            <div className="border border-orange-500 p-8">
              <h3 className="text-2xl font-bold font-mono tracking-tighter text-orange-500 mb-8 pb-4 border-b border-orange-500">
                MY BLOGS
              </h3>

              {blogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-mono text-sm tracking-widest text-orange-500 opacity-50">
                    NO BLOGS YET
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-orange-500">
                    {blogs.map((blog) => (
                      <Link
                        key={blog.id}
                        to={`/blogs/${blog.id}`}
                        className="bg-white p-6 hover:bg-orange-500 hover:text-white transition-all group"
                      >
                        <div className="mb-4">
                          {blog.image && (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all"
                            />
                          )}
                        </div>
                        <h4 className="font-mono text-lg tracking-tighter text-orange-500 group-hover:text-white mb-2 font-bold">
                          {blog.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs font-mono tracking-widest opacity-70">
                          <span
                            className={
                              blog.published ? "text-green-500" : "text-red-500"
                            }
                          >
                            {blog.published ? "PUBLISHED" : "DRAFT"}
                          </span>
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
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

export default Profile;
