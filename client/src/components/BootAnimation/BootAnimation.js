import React, { useState, useEffect } from "react";
import "./BootAnimation.css";

const BootAnimation = ({ time }) => {
  const [isLoadingActive, setIsLoadingActive] = useState(true);

  useEffect(() => {
    if (time) {
      let timer1 = setTimeout(() => setIsLoadingActive(false), time * 1000);

      return () => {
        clearTimeout(timer1);
      };
    }
  }, [time]);

  return (
    <div className={isLoadingActive ? "spinner" : "spinner inactive"}>
      <div className="spinner-item"></div>
      <div className="spinner-item"></div>
      <div className="spinner-item"></div>
    </div>
  );
};

export default BootAnimation;
