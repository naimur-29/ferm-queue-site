import React from "react";
import "./Error.css";
import { useNavigate } from "react-router-dom";

import sadface from "../../assets/sadface.gif";

const Error = () => {
  const navigate = useNavigate();

  return (
    <section className="error-section-container">
      <div className="main-container">
        <img src={sadface} alt="" />

        <h1 className="title">
          404 error!
          <br />
          page not found...
        </h1>

        <button className="error-btn" onClick={() => navigate("/")}>
          Return Home
        </button>
      </div>
    </section>
  );
};

export default Error;
