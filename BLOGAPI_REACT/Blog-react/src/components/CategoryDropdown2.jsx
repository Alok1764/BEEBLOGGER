import React, { useEffect, useState } from "react";

const CategoryDropdown2 = ({ onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const tokenString = localStorage.getItem("jwtToken");
        const tokenObj = JSON.parse(tokenString);
        const token = tokenObj.jwtToken;

        const res = await fetch("http://localhost:8080/api/v1/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSearch = () => {
    onSearch(selectedCategories);
    setIsOpen(false);
  };

  return (
    <div className="w-full flex flex-col items-center my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-orange-500 border border-orange-500 px-8 py-3 font-mono text-sm tracking-widest
                   hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer"
      >
        {isOpen ? "HIDE FILTERS ▲" : "FILTER BY CATEGORY ▼"}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden w-full mt-6 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border border-orange-500 p-8 flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-6 py-3 border border-orange-500 font-mono text-sm tracking-widest transition-all duration-300 
                ${
                  selectedCategories.includes(cat.id)
                    ? "bg-orange-500 text-white"
                    : "bg-white text-orange-500 hover:bg-orange-500 hover:text-white"
                }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}

          <div className="w-full flex justify-center mt-8">
            <button
              onClick={handleSearch}
              className="bg-orange-500 text-white border border-orange-500 hover:bg-white hover:text-orange-500 px-12 py-3 font-mono text-sm tracking-widest
                          transition-all duration-300"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CategoryDropdown2;
