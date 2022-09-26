import React from "react";
import "./QueueDisclaimer.css";
import { motion } from "framer-motion";

const QueueDisclaimer = ({ isDisclaimerActive, setIsDisclaimerActive }) => {
  return (
    <>
      {isDisclaimerActive ? <div className="overlay"></div> : <></>}
      <motion.div
        className={
          isDisclaimerActive
            ? "disclaimer-container active"
            : "disclaimer-container"
        }
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <button
          className="close-btn"
          onClick={() => setIsDisclaimerActive(false)}
        >
          X
        </button>
        <article className="disclaimer">
          *To guarantee your track is played for free, stay engaged and keep an
          eye on the queue page. You may be put on hold after a certain time of
          inactivity*
        </article>
      </motion.div>
    </>
  );
};

export default QueueDisclaimer;
