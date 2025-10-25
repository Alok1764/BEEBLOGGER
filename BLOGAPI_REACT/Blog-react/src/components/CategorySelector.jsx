import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";
import { useToast } from "../Contexts/ToastContext";

const CategorySelector = ({
  selectedCategoryIds = [],
  onChange,
  onAddCategory,
}) => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCategories();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const toggleCategory = (categoryId) => {
    const newSelectedIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];

    onChange(newSelectedIds);
  };

  const removeCategory = (categoryId) => {
    onChange(selectedCategoryIds.filter((id) => id !== categoryId));
  };

  const getSelectedCategories = () => {
    return categories.filter((cat) => selectedCategoryIds.includes(cat.id));
  };

  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredCategories = getFilteredCategories();
  const selectedCategories = getSelectedCategories();

  return (
    <div className="space-y-4">
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 border-2 border-orange-500 bg-orange-50">
          {selectedCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-mono text-xs tracking-widest"
            >
              {cat.name.toUpperCase()}
              <button
                onClick={() => removeCategory(cat.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-4 border-2 border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider hover:bg-orange-50 transition-all"
        >
          <span>
            {selectedCategoryIds.length === 0
              ? "SELECT CATEGORIES"
              : `${selectedCategoryIds.length} SELECTED`}
          </span>
          <FaChevronDown
            className={`w-4 h-4 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-2 border-2 border-orange-500 bg-white shadow-2xl">
            <div className="p-3 border-b border-orange-500">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH CATEGORIES..."
                className="w-full p-3 border border-orange-500 bg-white text-orange-500 font-mono text-xs tracking-wider focus:outline-none placeholder:text-orange-500 placeholder:opacity-50"
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filteredCategories.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-mono text-sm text-orange-500 opacity-50">
                    NO CATEGORIES FOUND
                  </p>
                </div>
              ) : (
                filteredCategories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-4 border-b border-orange-500 font-mono text-sm tracking-wider transition-all ${
                        isSelected
                          ? "bg-orange-500 text-white"
                          : "bg-white text-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      <span>{cat.name.toUpperCase()}</span>
                      {isSelected && (
                        <div className="w-5 h-5 border-2 border-white flex items-center justify-center">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                if (onAddCategory) onAddCategory();
              }}
              className="w-full flex items-center justify-center gap-2 p-4 bg-white text-orange-500 border-t-2 border-orange-500 font-mono text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all"
            >
              <FaPlus className="w-3 h-3" />
              ADD NEW CATEGORY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// AddCategoryModal Component
const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
  const toast = useToast();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch("http://localhost:8080/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      if (!res.ok) throw new Error("Failed to create category");

      const newCategory = await res.json();
      toast.success("Category created successfully");
      setCategoryName("");
      onCategoryAdded(newCategory);

      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100]"
        onClick={onClose}
      ></div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md">
        <div className="bg-white border-2 border-orange-500 relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-orange-500 hover:opacity-50 transition-opacity"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          <div className="p-12">
            <h2 className="text-3xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
              ADD CATEGORY
            </h2>
            <p className="text-xs font-mono tracking-widest text-orange-500 opacity-70 mb-8">
              CREATE A NEW BLOG CATEGORY
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
                  CATEGORY NAME *
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="E.G., TECHNOLOGY, DESIGN..."
                  className="w-full p-4 border-2 border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-orange-500 placeholder:opacity-30"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-4 font-mono text-sm tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50"
              >
                {loading ? "CREATING..." : "CREATE CATEGORY"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySelector;
export { AddCategoryModal };
