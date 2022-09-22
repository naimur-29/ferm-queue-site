import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "../../hooks/useAuth";

import BootAnimation from "../../components/BootAnimation/BootAnimation";

const AdminLogin = () => {
  const [userInput, setUserInput] = useState({});
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (values = userInput) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
    } catch (error) {
      setErrMessage("Connection failed!");
      error?.response?.data?.detail &&
        setErrMessage(error.response.data.detail);
    }
    setIsLoading(false);
  };

  if (isLoading) return <BootAnimation />;

  return (
    <section className="adminLogin-section-container">
      <div className="main-container">
        <h1 className="title">Admin Login</h1>

        <div className="form-container">
          {errMessage ? <h3 className="error-message">{errMessage}</h3> : <></>}

          <div className="item">
            <label htmlFor="EmailOrUsername">Email / Username</label>
            <input
              type="text"
              placeholder="username"
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </div>

          <div className="item">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              placeholder="password"
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
            />
          </div>

          <button
            className="submit-btn"
            onClick={() => handleSubmit()}
            disabled={!userInput.email || !userInput.password}
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
