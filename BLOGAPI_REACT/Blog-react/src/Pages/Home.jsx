import React from "react";
import BlogPage2 from "../components/BlogPage2";
import Navbar2 from "../components/Dashboard/Navbar2";
import Banner2 from "../components/Banner2";

const Home = () => {
  return (
    <div>
      <Navbar2 />
      <Banner2 />

      <div className="max-w-7xl mx-auto">
        <BlogPage2 />
      </div>
    </div>
  );
};

export default Home;
