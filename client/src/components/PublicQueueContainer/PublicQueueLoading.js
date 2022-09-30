import React from "react";
import "./PublicQueueContainer.css";

const PublicQueueLoading = ({ heading }) => {
  return (
    <div className="queue-container">
      <h2>{heading}</h2>
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className={"queuer active loading"}
          style={{ "--i": item }}
        >
          <p className="username">
            <span>Username</span>
          </p>
          <button className="link-btn">{">>"}</button>
          <button className="info-btn">1</button>
        </div>
      ))}
    </div>
  );
};

export default PublicQueueLoading;
