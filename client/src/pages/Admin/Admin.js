import React from "react";
import "./Admin.css";
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <section className="admin-home-section-container">
      <div className="main-container">
        <Link to="/access-queue" className="outer-btn">
          <button className="btn">Manage Queue</button>
        </Link>

        <Link to="/settings" className="outer-btn">
          <button className="btn">Queue Settings</button>
        </Link>

        <Link to="/queue" className="outer-btn">
          <button className="btn">View Public Queue</button>
        </Link>

        <Link to="/" className="outer-btn">
          <button className="btn">Return Home</button>
        </Link>
      </div>
    </section>
  );
};

export default Admin;
