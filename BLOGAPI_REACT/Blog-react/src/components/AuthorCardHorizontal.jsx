import React from "react";
import { FaUser, FaSearch, FaEye, FaFileAlt } from "react-icons/fa";
const AuthorCardHorizontal = ({ author, rank, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border border-orange-500 bg-white p-6 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer group flex items-center gap-6"
    >
      {/* Rank Badge (if provided) */}
      {rank && (
        <div className="flex-shrink-0 w-12 h-12 border-2 border-orange-500 bg-white flex items-center justify-center group-hover:border-white">
          <span className="text-2xl font-bold font-mono text-orange-500 group-hover:text-orange-500">
            {rank}
          </span>
        </div>
      )}

      {/* Avatar */}
      <div className="flex-shrink-0 w-16 h-16 bg-orange-500 flex items-center justify-center group-hover:bg-white transition-colors">
        {author.authorPic ? (
          <img
            src={author.authorPic}
            alt={""}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUser className="w-8 h-8 text-white group-hover:text-orange-500 transition-colors" />
        )}
      </div>

      {/* Author Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-2xl font-bold font-mono tracking-tighter text-orange-500 group-hover:text-white mb-1 truncate">
          {author.userName.toUpperCase()}
        </h3>
        {author.bio && (
          <p className="text-sm font-mono tracking-wider opacity-80 truncate">
            {author.bio}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 flex items-center gap-8">
        {/* Total Posts */}
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <FaFileAlt className="w-4 h-4 opacity-70" />
            <span className="text-2xl font-bold font-mono tracking-tighter">
              {author.totalBlogs || 0}
            </span>
          </div>
          <span className="text-xs font-mono tracking-widest opacity-70">
            POSTS
          </span>
        </div>

        {/* Total Views */}
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <FaEye className="w-4 h-4 opacity-70" />
            <span className="text-2xl font-bold font-mono tracking-tighter">
              {author.totalViews || 0}
            </span>
          </div>
          <span className="text-xs font-mono tracking-widest opacity-70">
            VIEWS
          </span>
        </div>

        {/* Arrow */}
        <div className="text-3xl font-mono opacity-70">→</div>
      </div>
    </div>
  );
};
export default AuthorCardHorizontal;
