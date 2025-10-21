import React, { useState, useEffect } from "react";
import AuthorCardHorizontal from "../components/AuthorCardHorizontal";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaEye, FaFileAlt } from "react-icons/fa";

const Authors = () => {
  const navigate = useNavigate();
  const [topAuthors, setTopAuthors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch top 10 authors on page load
  useEffect(() => {
    fetchTopAuthors();
  }, []);

  // Search authors when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchAuthors();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchTopAuthors = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/authors/popular");

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setTopAuthors(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top authors:", error);
      setLoading(false);
    }
  };

  const searchAuthors = async () => {
    setSearchLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/authors/search?userName=${searchQuery}`
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setSearchResults(data);
      setSearchLoading(false);
    } catch (error) {
      console.error("Error searching authors:", error);
      setSearchLoading(false);
    }
  };

  const handleAuthorClick = (authorId) => {
    navigate(`/authors/${authorId}`);
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
        <div className="text-center mb-12 pb-8 border-b border-orange-500">
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold font-mono tracking-tighter text-orange-500 mb-4">
            AUTHORS
          </h1>
          <p className="text-sm font-mono tracking-widest text-orange-500 opacity-70">
            DISCOVER CREATORS — EXPLORE STORIES
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-16">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH AUTHORS BY USERNAME..."
              className="w-full pl-16 pr-6 py-5 border-2 border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition placeholder:text-orange-500 placeholder:opacity-50"
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold font-mono tracking-tighter text-orange-500 mb-4 pb-3 border-b border-orange-500">
                SEARCH RESULTS
              </h3>
              {searchLoading ? (
                <p className="font-mono text-sm tracking-wider text-orange-500 opacity-50 text-center py-8">
                  SEARCHING...
                </p>
              ) : searchResults.length === 0 ? (
                <p className="font-mono text-sm tracking-wider text-orange-500 opacity-50 text-center py-8">
                  NO AUTHORS FOUND
                </p>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((author) => (
                    <AuthorCardHorizontal
                      key={author.id}
                      author={author}
                      onClick={() => handleAuthorClick(author.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top 10 Authors */}
        {!searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-orange-500">
              <h2 className="text-4xl font-bold font-mono tracking-tighter text-orange-500">
                TOP 5 AUTHORS
              </h2>
            </div>

            <div className="space-y-4">
              {topAuthors.map((author, index) => (
                <AuthorCardHorizontal
                  key={author.id}
                  author={author}
                  rank={index + 1}
                  onClick={() => handleAuthorClick(author.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authors;
