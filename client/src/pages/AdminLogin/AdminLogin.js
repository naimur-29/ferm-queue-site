import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AdminLogin = () => {
  const [isEmail, setIsEmail] = useState(false);

  return (
    <section className="adminLogin-section-container">
      <div className="main-container">
        <h1 className="title">Admin Login</h1>

        <div className="form-container">
          <div className="item">
            <label htmlFor="EmailOrUsername">Email / Username</label>
            {isEmail ? (
              <input type="email" placeholder="email" />
            ) : (
              <input type="text" placeholder="username" />
            )}
            <button onClick={() => setIsEmail(!isEmail)}>
              {isEmail ? "Email" : "Username"}
            </button>
          </div>

          <div className="item">
            <label htmlFor="Password">Password</label>
            <input type="password" placeholder="password" />
          </div>

          <button className="submit-btn">Login</button>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
