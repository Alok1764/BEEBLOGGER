import React from "react";

const Pagination2 = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 py-12 border-t border-orange-500 ">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 0}
        className={`px-6 py-3 border border-orange-500 font-mono text-sm tracking-widest transition-all hover:cursor-pointer${
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
          onClick={() => handlePageClick(index)}
          className={`px-6 py-3 border border-orange-500 font-mono text-sm tracking-widest transition-all hover:cursor-pointer ${
            index === currentPage
              ? "bg-orange-500 text-white"
              : "text-orange-500 hover:opacity-50"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`px-6 py-3 border border-orange-500 font-mono text-sm tracking-widest transition-all hover:cursor-pointer ${
          currentPage === totalPages - 1
            ? "opacity-30 cursor-not-allowed text-orange-500"
            : "hover:bg-orange-500 hover:text-white text-orange-500"
        }`}
      >
        →
      </button>
    </div>
  );
};

export default Pagination2;
