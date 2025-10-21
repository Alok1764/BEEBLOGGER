import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

const Banner2 = () => {
  return (
    <div className="bg-white pt-32">
      <div className="max-w-7xl mx-auto text-center px-12">
        <div className="bg-white text-orange-500 border border-orange-500 py-20 px-12 ">
          <h2 className="text-7xl sm:text-8xl lg:text-9xl font-bold font-mono tracking-tighter mb-8">
            BLOG
          </h2>
          <p className="text-sm font-mono tracking-widest text-orange-500 opacity-70 lg:w-3/4 mx-auto mb-8">
            START YOUR BLOG TODAY AND JOIN A COMMUNITY OF{" "}
            <span className="opacity-100 font-bold">THINKERS</span>,{" "}
            <span className="opacity-100 font-bold">WRITERS</span>,{" "}
            <span className="opacity-100 font-bold">READERS</span>
          </p>
          <div>
            <Link
              to="/blogs"
              className="font-mono text-xs tracking-widest text-orange-500 hover:opacity-50 inline-flex items-center transition-opacity"
            >
              LEARN MORE
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner2;
