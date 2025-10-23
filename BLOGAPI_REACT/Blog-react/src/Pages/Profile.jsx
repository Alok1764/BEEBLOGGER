import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEdit,
  FaFileAlt,
  FaEye,
  FaUserFriends,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    bio: "",
    githubLink: "",
    linkedInLink: "",
    website: "",
    authorPic: "",
  });

  // For image upload preview
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      fetchMyBlogs();
      // Initialize form with current data when profile loads
      setEditForm({
        bio: profileData.bio || "",
        githubLink: profileData.githubLink || "",
        linkedInLink: profileData.linkedInLink || "",
        website: profileData.website || "",
        authorPic: profileData.authorPic || "",
      });
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditForm((prev) => ({
          ...prev,
          authorPic: reader.result, // Base64 string or upload to server first
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes using PATCH
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      // Only send fields that have values (PATCH behavior)
      const updateData = {};

      // Add fields only if they exist
      if (editForm.bio !== undefined && editForm.bio !== null) {
        updateData.bio = editForm.bio;
      }
      if (editForm.githubLink) updateData.githubLink = editForm.githubLink;
      if (editForm.linkedInLink)
        updateData.linkedInLink = editForm.linkedInLink;
      if (editForm.website) updateData.website = editForm.website;
      if (editForm.authorPic) updateData.authorPic = editForm.authorPic;
      console.log(updateData);
      const res = await fetch(
        `http://localhost:8080/api/v1/authors/${profileData.id}/update-profile`,
        {
          method: "PATCH", // Using PATCH for partial updates
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const updatedData = await res.json();

      // Update local state with new data
      setProfileData(updatedData);
      setIsEditMode(false);
      setImagePreview(null);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setImagePreview(null);
    // Reset form to original profile data
    setEditForm({
      bio: profileData.bio || "",
      githubLink: profileData.githubLink || "",
      linkedInLink: profileData.linkedInLink || "",
      website: profileData.website || "",
      authorPic: profileData.authorPic || "",
    });
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
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-12 pb-6 border-b border-orange-500">
          <h1 className="text-5xl font-bold font-mono tracking-tighter text-orange-500">
            PROFILE
          </h1>
          <div className="flex gap-3">
            {isEditMode ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-3 px-8 py-3 border border-red-500 text-red-500 font-mono text-sm tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  <FaTimes />
                  CANCEL
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="flex items-center gap-3 px-8 py-3 bg-orange-500 text-white font-mono text-sm tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                  <FaSave />
                  {isSaving ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-3 px-8 py-3 border border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all"
              >
                <FaEdit />
                EDIT PROFILE
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Left Side - Profile Info */}
          <div className="lg:col-span-4">
            <div className="border border-orange-500 p-8">
              {/* Profile Picture */}
              <div className="mb-8">
                <div className="w-full aspect-square bg-orange-500 flex items-center justify-center mb-4 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : profileData.authorPic ? (
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
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-full py-3 border border-orange-500 text-orange-500 font-mono text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all cursor-pointer text-center">
                      UPLOAD IMAGE
                    </div>
                  </label>
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
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-orange-500 font-mono text-sm text-orange-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                    rows="4"
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
                      <FaGithub className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <input
                        type="text"
                        name="githubLink"
                        value={editForm.githubLink}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-orange-500 font-mono text-xs text-orange-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="https://github.com/username"
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
                        NO GITHUB LINK
                      </span>
                    </div>
                  )}

                  {/* LinkedIn */}
                  {isEditMode ? (
                    <div className="flex items-center gap-3">
                      <FaLinkedin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <input
                        type="text"
                        name="linkedInLink"
                        value={editForm.linkedInLink}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-orange-500 font-mono text-xs text-orange-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="https://linkedin.com/in/username"
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
                        NO LINKEDIN LINK
                      </span>
                    </div>
                  )}

                  {/* Website */}
                  {isEditMode ? (
                    <div className="flex items-center gap-3">
                      <FaGlobe className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <input
                        type="text"
                        name="website"
                        value={editForm.website}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-orange-500 font-mono text-xs text-orange-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="https://yourwebsite.com"
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
                        NO WEBSITE
                      </span>
                    </div>
                  )}
                </div>
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
                  {profileData.totalBlogs || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  POSTS
                </div>
              </div>

              <div className="bg-white p-8 text-center">
                <FaEye className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {profileData.totalViews || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  VIEWS
                </div>
              </div>

              <div className="bg-white p-8 text-center">
                <FaUserFriends className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {profileData.followers || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  FOLLOWERS
                </div>
              </div>

              <div className="bg-white p-8 text-center">
                <FaUserFriends className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
                  {profileData.following || 0}
                </div>
                <div className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  FOLLOWING
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                    {blogs.map((blog) => (
                      <Link
                        key={blog.id}
                        to={`/blogs/${blog.id}`}
                        className="bg-white p-6 hover:bg-orange-500 hover:text-white transition-all group border border-orange-500"
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
                          <span>VIEWS {blog.viewCount}</span>
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
