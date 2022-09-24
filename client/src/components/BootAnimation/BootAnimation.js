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
    <section
      className={
        isLoadingActive ? "loader-container" : "loader-container inactive"
      }
    >
      <div className="loader">
        <span style={{ "--i": 1 }}></span>
        <span style={{ "--i": 2 }}></span>
        <span style={{ "--i": 3 }}></span>
        <span style={{ "--i": 4 }}></span>
        <span style={{ "--i": 5 }}></span>
        <span style={{ "--i": 6 }}></span>
        <span style={{ "--i": 7 }}></span>
        <span style={{ "--i": 8 }}></span>
        <span style={{ "--i": 9 }}></span>
        <span style={{ "--i": 10 }}></span>
        <span style={{ "--i": 11 }}></span>
        <span style={{ "--i": 12 }}></span>
        <span style={{ "--i": 13 }}></span>
        <span style={{ "--i": 14 }}></span>
        <span style={{ "--i": 15 }}></span>
        <span style={{ "--i": 16 }}></span>
        <span style={{ "--i": 17 }}></span>
        <span style={{ "--i": 18 }}></span>
        <span style={{ "--i": 19 }}></span>
        <span style={{ "--i": 20 }}></span>
      </div>
    </section>
  );
};

export default BootAnimation;
