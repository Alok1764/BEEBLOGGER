import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

const SideBar2 = () => {
  const [popularBlogs, setPopularBlogs] = useState([]);

  useEffect(() => {
    async function fetchPopularBlogs() {
      try {
        const tokenString = localStorage.getItem("jwtToken");
        const tokenObj = JSON.parse(tokenString);
        const token = tokenObj.jwtToken;

        const res = await fetch("http://localhost:8080/api/v1/posts/popular", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setPopularBlogs(data.slice(0, 15));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchPopularBlogs();
  }, []);

  return (
    <div className="lg:w-80 space-y-12">
      <div>
        <h3 className="text-2xl font-bold font-mono tracking-tighter text-orange-500 mb-6 pb-3 border-b border-orange-500">
          LATEST
        </h3>
        <div className="space-y-0">
          {popularBlogs.slice(0, 5).map((blog) => (
            <div key={blog.id} className="py-4 border-b border-orange-500">
              <h4 className="font-mono text-sm tracking-wider text-orange-500 mb-2">
                {blog.title}
              </h4>
              <Link
                to="/"
                className="text-xs font-mono tracking-widest text-orange-500 hover:opacity-50 inline-flex items-center transition-opacity"
              >
                LEARN MORE
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold font-mono tracking-tighter text-orange-500 mb-6 pb-3 border-b border-orange-500">
          POPULAR
        </h3>
        <div className="space-y-0">
          {popularBlogs.slice(0, 5).map((blog) => (
            <div key={blog.id} className="py-4 border-b border-orange-500">
              <h4 className="font-mono text-sm tracking-wider text-orange-500 mb-2">
                {blog.title}
              </h4>
              <Link
                to="/"
                className="text-xs font-mono tracking-widest text-orange-500 hover:opacity-50 inline-flex items-center transition-opacity"
              >
                LEARN MORE
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar2;
