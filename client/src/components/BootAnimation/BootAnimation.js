import React, { useState, useEffect } from "react";
import "./BootAnimation.css";

const BootAnimation = () => {
  const [isLoadingActive, setIsLoadingActive] = useState(true);

  useEffect(() => {
    let timer1 = setTimeout(() => setIsLoadingActive(false), 3 * 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  return (
    <div className={isLoadingActive ? "spinner" : "spinner inactive"}>
      <div className="spinner-item"></div>
      <div className="spinner-item"></div>
      <div className="spinner-item"></div>
    </div>
  );
};

export default BootAnimation;
