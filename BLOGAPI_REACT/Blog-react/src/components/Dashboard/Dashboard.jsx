import React from "react";
import Navbar2 from "./Navbar2";
import Blogs2 from "../../Pages/Blogs2";

const Dashboard = ({ userInfo, onLogout }) => {
  return (
    <div className="min-h-screen  bg-white">
      <Navbar2 onLogout={onLogout} />
      <Blogs2 />
    </div>
  );
};

export default Dashboard;
