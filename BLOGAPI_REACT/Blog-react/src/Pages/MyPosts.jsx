import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Contexts/ToastContext";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";

const MyPosts = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // all, published, draft
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(
        "http://localhost:8080/api/v1/posts/my-posts?pageNo=0&pageSize=12",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      console.log(data.content);
      setPosts(data.content || []);
      setLoading(false);
      console.log(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
      setLoading(false);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`Delete "${postTitle}"?`)) return;

    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(`http://localhost:8080/api/v1/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      toast.success("Post deleted successfully");
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handlePublish = async (postId) => {
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(
        `http://localhost:8080/api/v1/posts/${postId}/publish`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to publish post");

      toast.success("Post published successfully");

      fetchMyPosts(); // Refresh list
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post");
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === "PUBLISHED") return post.status === "PUBLISHED";
    if (filter === "DRAFT") return post.status === "DRAFT";
    return true;
  });

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "PUBLISHED").length,
    drafts: posts.filter((p) => p.status === "DRAFT").length,
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
        {/* Header */}
        <div className="flex justify-between items-center mb-12 pb-6 border-b border-orange-500">
          <div>
            <h1 className="text-5xl font-bold font-mono tracking-tighter text-orange-500">
              MY POSTS
            </h1>
            <p className="text-xs font-mono tracking-widest text-orange-500 opacity-70 mt-2">
              MANAGE YOUR BLOG POSTS
            </p>
          </div>
          <button
            onClick={() => navigate("/editor")}
            className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white font-mono text-sm tracking-widest hover:bg-orange-600 transition-all"
          >
            <FaPlus />
            NEW POST
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-orange-500 mb-12">
          <div className="bg-white p-8 text-center">
            <FaFileAlt className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <div className="text-4xl font-bold font-mono text-orange-500 mb-2">
              {stats.total}
            </div>
            <div className="text-xs font-mono tracking-widest text-orange-500 opacity-70">
              TOTAL POSTS
            </div>
          </div>
          <div className="bg-white p-8 text-center">
            <FaEye className="w-8 h-8  text-orange-500 mx-auto mb-3" />
            <div className="text-4xl font-bold font-mono text-orange-500 mb-2">
              {stats.published}
            </div>
            <div className="text-xs font-mono tracking-widest text-orange-500 opacity-70">
              PUBLISHED
            </div>
          </div>
          <div className="bg-white p-8 text-center">
            <FaClock className="w-8 h-8  text-orange-500 mx-auto mb-3" />
            <div className="text-4xl font-bold font-mono  text-orange-500 mb-2">
              {stats.drafts}
            </div>
            <div className="text-xs font-mono tracking-widest text-orange-500 opacity-70">
              DRAFTS
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-px bg-orange-500 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-4 font-mono text-sm tracking-widest transition-all ${
              filter === "all"
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-500 hover:opacity-70"
            }`}
          >
            ALL ({stats.total})
          </button>
          <button
            onClick={() => setFilter("PUBLISHED")}
            className={`flex-1 py-4 font-mono text-sm tracking-widest transition-all ${
              filter === "published"
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-500 hover:opacity-70"
            }`}
          >
            PUBLISHED ({stats.published})
          </button>
          <button
            onClick={() => setFilter("DRAFT")}
            className={`flex-1 py-4 font-mono text-sm tracking-widest transition-all ${
              filter === "draft"
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-500 hover:opacity-70"
            }`}
          >
            DRAFTS ({stats.drafts})
          </button>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="border-2 border-orange-500 p-20 text-center">
            <p className="font-mono text-orange-500 opacity-50 mb-6">
              {filter === "DRAFT"
                ? "NO DRAFTS"
                : filter === "PUBLISHED"
                ? "NO PUBLISHED POSTS"
                : "NO POSTS YET"}
            </p>
            <button
              onClick={() => navigate("/editor")}
              className="px-8 py-3 border border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all"
            >
              CREATE YOUR FIRST POST
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="border border-orange-500 p-6 hover:bg-orange-50 transition-all group"
              >
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  {post.image && (
                    <div className="flex-shrink-0 w-32 h-32 border border-orange-500">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                  )}

                  {/* Post Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-2xl font-bold font-mono tracking-tighter text-orange-500 truncate">
                        {post.title.toUpperCase()}
                      </h3>
                      {/* Status Badge */}
                      <span className="flex-shrink-0 px-4 py-1 border font-mono text-xs tracking-widest bg-orange-500 text-white ">
                        {post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </div>

                    {post.excerpt && (
                      <p className="text-sm font-mono text-orange-500 opacity-70 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs font-mono tracking-wider text-orange-500 opacity-50 mb-4">
                      <span>
                        CREATED: {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.categoryDTO && (
                        <>
                          <span>•</span>
                          <span>{post.categoryDTO.name.toUpperCase()}</span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {/* View */}
                      {post.status === "PUBLISHED" && (
                        <button
                          onClick={() => navigate(`/blogs/${post.id}`)}
                          className="px-4 py-2 border border-orange-500 text-orange-500 font-mono text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
                        >
                          <FaEye />
                          VIEW
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/editor/${post.id}`)}
                        className="px-4 py-2 border border-orange-500 text-orange-500 font-mono text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
                      >
                        <FaEdit />
                        EDIT
                      </button>

                      {/* Publish (if draft) */}
                      {post.status === "DRAFT" && (
                        <button
                          onClick={() => handlePublish(post.id)}
                          className="px-4 py-2  text-orange-500 border border-orange-500 font-mono text-xs tracking-widest hover:bg-orange-500  hover:text-white transition-all"
                        >
                          PUBLISH
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="px-4 py-2 border border-red-500 text-orange-500 font-mono text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
                      >
                        <FaTrash />
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
