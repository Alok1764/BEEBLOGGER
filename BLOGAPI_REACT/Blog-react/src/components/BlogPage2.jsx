import React, { useEffect, useState } from "react";
import BlogCards2 from "./BlogCards2";
import Pagination2 from "./Pagination2";
import CategoryDropdown2 from "./CategoryDropdown2";
import SideBar2 from "./Sidebar2";

const BlogPage2 = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const tokenString = localStorage.getItem("jwtToken");
        const tokenObj = JSON.parse(tokenString);
        const token = tokenObj.jwtToken;

        let url = `http://localhost:8080/api/v1/posts?pageNo=${currentPage}&pageSize=${12}`;

        if (selectedCategories.length > 0) {
          url += `&categoryIds=${selectedCategories.join(",")}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        setBlogs(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }

    fetchBlogs();
  }, [selectedCategories, currentPage]);

  const handleSearch = (categories) => {
    setSelectedCategories(categories);
    setCurrentPage(0);
  };

  return (
    <div>
      <div className="mb-12">
        <CategoryDropdown2 onSearch={handleSearch} />
      </div>

      <div className="h-px w-full bg-orange-500 mb-20"></div>

      <div className="flex flex-col lg:flex-row gap-20">
        <BlogCards2 blogs={blogs} />
        <div>
          <SideBar2 />
        </div>
      </div>
      <div className="mt-20">
        <Pagination2
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default BlogPage2;
