import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaGithub, FaBars, FaUser } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import ProfilePanel from "./ProfilePanel";

const Navbar2 = ({ onLogout, isLoggedIn, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch user data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(
        "http://localhost:8080/api/v1/authors/loggedIn-user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    if (onLogout && typeof onLogout === "function") {
      onLogout();
    }
    setIsProfileOpen(false);
    setUserData(null);
    navigate("/home");
  };

  return (
    <>
      <header className="bg-white text-orange-500 fixed top-0 left-0 right-0 z-50">
        <div className="border-b border-orange-500">
          <nav className="px-12 py-6 max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <NavLink
                to="/home"
                className="text-2xl font-bold font-mono tracking-tighter text-orange-500"
              >
                BEEBLOGGER
              </NavLink>
            </div>

            <div className="md:flex gap-12 text-sm font-mono tracking-widest hidden">
              <NavLink
                to="/home"
                className="transition-opacity hover:opacity-50"
              >
                HOME
              </NavLink>

              <NavLink
                to="/authors"
                className="transition-opacity hover:opacity-50"
              >
                AUTHORS
              </NavLink>
              <NavLink
                to="/blogs"
                className="transition-opacity hover:opacity-50"
              >
                BLOGS
              </NavLink>
              <NavLink
                to="/services"
                className="transition-opacity hover:opacity-50"
              >
                SERVICES
              </NavLink>
              <NavLink
                to="/about"
                className="transition-opacity hover:opacity-50"
              >
                ABOUT
              </NavLink>
              <NavLink
                to="/contact"
                className="transition-opacity hover:opacity-50"
              >
                CONTACT
              </NavLink>
            </div>

            <div className="lg:flex items-center gap-5 hidden">
              <a
                href="https://github.com/Alok1764"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="w-6 h-6 text-orange-500 transition-opacity hover:opacity-50" />
              </a>

              {isLoggedIn ? (
                <button
                  onClick={toggleProfile}
                  className="border border-orange-500 p-3 text-orange-500 hover:bg-orange-500 hover:text-white transition-all hover:cursor-pointer"
                >
                  <FaUser className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="border border-orange-500 px-8 py-3 font-mono text-sm tracking-widest text-orange-500 hover:bg-orange-500 hover:text-white transition-all hover:cursor-pointer"
                >
                  LOGIN
                </button>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={toggleMenu} className="cursor-pointer">
                {isMenuOpen ? (
                  <FaXmark className="w-6 h-6 text-orange-500" />
                ) : (
                  <FaBars className="w-6 h-6 text-orange-500" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div>
          <div
            className={`md:hidden text-sm font-mono tracking-widest space-y-6 px-12 py-12 bg-white border-b border-orange-500 transition-all duration-300 text-orange-500 
              ${isMenuOpen ? "fixed top-[50px] w-full z-40" : "hidden"}`}
          >
            <div className="text-orange-500 flex flex-col space-y-6">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                  className="text-left transition-opacity hover:opacity-50 flex items-center gap-2"
                >
                  <FaUser className="w-6 h-6 text-orange-500" />
                  PROFILE
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="text-left transition-opacity hover:opacity-50"
                >
                  LOGIN
                </button>
              )}

              <NavLink
                to="/home"
                className="transition-opacity hover:opacity-50"
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </NavLink>
              <NavLink
                to="/authors"
                className="transition-opacity hover:opacity-50"
                onClick={() => setIsMenuOpen(false)}
              >
                AUTHORS
              </NavLink>
              <NavLink
                to="/blogs"
                className="transition-opacity hover:opacity-50"
                onClick={() => setIsMenuOpen(false)}
              >
                BLOGS
              </NavLink>
              <NavLink
                to="/services"
                className="transition-opacity hover:opacity-50"
                onClick={() => setIsMenuOpen(false)}
              >
                SERVICES
              </NavLink>
              <NavLink
                to="/about"
                className="transition-opacity hover:opacity-50"
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </NavLink>

              <NavLink
                to="/contact"
                className="transition-opacity hover:opacity-50"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </NavLink>

              <a
                href="https://github.com/Alok1764"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-50 flex items-center gap-2"
              >
                <FaGithub className="w-6 h-6 text-orange-500" />
                GITHUB
              </a>
            </div>
          </div>
        </div>
      </header>

      {isLoggedIn && (
        <ProfilePanel
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
          userName={userData?.userName || "USERNAME"}
          userEmail={userData?.email || "user@example.com"}
        />
      )}
    </>
  );
};

export default Navbar2;
