import React from "react";
import BlogPage2 from "../components/BlogPage2";

const Blogs2 = ({ openAuthModal, isLoggedIn }) => {
  const handleBlogClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevent navigation
      openAuthModal("login"); // Open login modal
    }
    // If logged in, normal navigation happens
  };

  return (
    <div className="bg-white min-h-screen pt-32">
      <div className="max-w-7xl mx-auto text-center px-12">
        <div className="bg-white text-orange-500 border border-orange-500 py-20 px-12 transition-opacity hover:opacity-50">
          <h2 className="text-7xl sm:text-8xl lg:text-9xl font-bold font-mono tracking-tighter mb-6">
            BLOG
          </h2>
          <p className="text-sm font-mono tracking-widest text-orange-500 opacity-70">
            INSIGHTS — STORIES — UPDATES
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 px-12">
        <BlogPage2
          isLoggedIn={isLoggedIn}
          onAuthRequired={() => openAuthModal("login")}
        />
      </div>
    </div>
  );
};

export default Blogs2;
