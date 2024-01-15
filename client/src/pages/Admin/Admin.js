import React, { useState, useEffect } from "react";
import "./Admin.css";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import BootAnimation from "../../components/BootAnimation/BootAnimation";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert("Connection failed!");
      error?.response?.data?.detail && alert(error.response.data.detail);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "UAR Controlling";
  }, []);

  if (isLoading) return <BootAnimation />;

  return (
    <section className="admin-home-section-container">
      <div className="main-container">
        <Link to="/access-queue" className="outer-btn">
          <button className="btn">Manage Queue</button>
        </Link>

        <Link to="/settings" className="outer-btn">
          <button className="btn">Queue Settings</button>
        </Link>

        <div
          className="outer-btn"
          onClick={() => {
            handleSubmit();
          }}
        >
          <button className="btn">Logout</button>
        </div>

        <Link to="/" className="outer-btn">
          <button className="btn">Return Home</button>
        </Link>
      </div>
    </section>
  );
};

export default Admin;
