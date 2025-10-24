import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import { getUserFromToken, removeToken, isAuthenticated } from "./Utils/auth";
import { ToastProvider } from "./Contexts/ToastContext";
import Navbar2 from "./components/Dashboard/Navbar2";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import About from "./Pages/About";
import Blogs2 from "./Pages/Blogs2";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import AuthModal from "./components/AuthModal";
import BlogDetails from "./Pages/BlogDetails";
import Authors from "./Pages/Authors";
import AuthorDetails from "./Pages/AuthorDetails";
import BlogPostEditor from "./Pages/BlogPostEditor";
import MyPosts from "./Pages/MyPosts";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUserFromToken();
      if (user) {
        setUserInfo(user);
        setIsLoggedIn(true);
        console.log("User already logged in:", user);
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setUserInfo(user);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    removeToken();
    setUserInfo(null);
    setIsLoggedIn(false);
    console.log("User logged out");
  };

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen">
        {/* Navbar on all pages */}
        <Navbar2
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => openAuthModal("login")}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />

          <Route path="/editor" element={<BlogPostEditor />} />
          <Route path="/editor/:id" element={<BlogPostEditor />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route
            path="/authors"
            element={
              <Authors openAuthModal={openAuthModal} isLoggedIn={isLoggedIn} />
            }
          />

          {/* Too view specific author profiles are required login */}
          <Route
            path="/authors/:id"
            element={
              isAuthenticated() ? (
                <AuthorDetails />
              ) : (
                <Navigate to="/authors" replace />
              )
            }
          />

          {/* Blogs - accessible to all, but some features require login */}
          <Route
            path="/blogs"
            element={
              <Blogs2 openAuthModal={openAuthModal} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/blogs/:id"
            element={
              isAuthenticated() ? (
                <BlogDetails />
              ) : (
                <Navigate to="/blogs" replace />
              )
            }
          />

          <Route path="/contact" element={<Contact />} />

          {/* Protected Route - Profile */}
          <Route
            path="/profile"
            element={
              isAuthenticated() ? <Profile /> : <Navigate to="/home" replace />
            }
          />

          {/* Protected Route - Dashboard */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard userInfo={userInfo} onLogout={handleLogout} />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />

          <Route
            path="*"
            element={
              <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
                <h2 className="text-5xl font-bold font-mono tracking-tighter text-orange-500">
                  404 - NOT FOUND
                </h2>
              </div>
            }
          />
        </Routes>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={closeAuthModal}
          mode={authMode}
          onLoginSuccess={handleLoginSuccess}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      </div>
    </ToastProvider>
  );
};

export default App;
