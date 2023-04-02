import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "react-query";

// Importing local components
import Snow from "../../components/Snow/Snow";
import BootAnimation from "../../components/BootAnimation/BootAnimation";
import SubmitForm from "../../components/SubmitForm/SubmitForm";

// Importing img assets from local directory
import fbIcon from "../../assets/socials/fb-icon.svg";
import instaIcon from "../../assets/socials/insta-icon.svg";
import twitterIcon from "../../assets/socials/twitter-icon.svg";
import ytIcon from "../../assets/socials/yt-icon.svg";

// local services:
import axiosInstance from "../../services/axios";

// constant variables
// const realFermAudioLogoImg =
//   "https://cdn.discordapp.com/attachments/1011744799629529208/1019645944221941841/realFERMaudio_logo_w_face2.png";

import realFermAudioLogoImg from "../../assets/realferm-logo.webp";

const Home = () => {
  const [isDisclaimerActive, setIsDisclaimerActive] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);
  const [isAlreadyInQueue, setIsAlreadyInQueue] = useState(false);

  const navigate = useNavigate();

  // fetching active queuer:
  const { isLoading: isLoadingCurrentQueuer, isError: isCurrentQueuerDead } =
    useQuery("current-queuer", () => {
      let targetID = "";
      if (
        localStorage.getItem("userInfo") !== "undefined" &&
        localStorage.getItem("userInfo")
      ) {
        targetID = JSON.parse(localStorage.getItem("userInfo"))?.user_id;
      }
      if (targetID.length > 10) {
        return axiosInstance.get(`queuer/${targetID}`);
      }
    });

  // fetching queue settings:
  const { data: isQueueOn, isLoading: isLoadingQueueOn } = useQuery(
    "is-queue-on",
    () => {
      return axiosInstance.get("set/isQueueOn");
    }
  );

  useEffect(() => {
    if (
      localStorage.getItem("userInfo") !== "undefined" &&
      localStorage.getItem("userInfo")
    ) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user?.user_id && setIsAlreadyInQueue(true);
    }
  }, []);

  useEffect(() => {
    if (isCurrentQueuerDead) {
      localStorage.removeItem("userInfo");
      setIsAlreadyInQueue(false);
    }
  }, [isCurrentQueuerDead]);

  useEffect(() => {
    window.localStorage.setItem("visitCount", 0);
  }, []);

  if (isLoadingCurrentQueuer || isLoadingQueueOn) return <BootAnimation />;

  return (
    <section className="home-section-container">
      {/* loading animation */}
      <BootAnimation time={2} />

      {/* Snow Effect on Background */}
      <Snow />

      <div className="main-container">
        {/* Top nav section with logo & socials */}
        <motion.nav
          className="nav-container"
          initial={{ y: "-200%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          {/* Logo section */}
          <div className="left">
            <a
              href="https://realfermaudio.com/faq"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={realFermAudioLogoImg}
                alt="RealFerm Audio Logo"
                className="logo"
              />
            </a>
          </div>

          {/* Socials Section */}
          <div className="right">
            <a
              href="https://www.facebook.com/realfermaudio"
              target="_blank"
              rel="noreferrer"
            >
              <img src={fbIcon} alt="fb icon" className="icons" />
            </a>
            <a
              href="https://www.instagram.com/realfermaudio/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={instaIcon} alt="instagram icon" className="icons" />
            </a>
            <a
              href="https://twitter.com/realFERMaudio"
              target="_blank"
              rel="noreferrer"
            >
              <img src={twitterIcon} alt="twitter icon" className="icons" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCegXLVNGhEVDnje5leOXXYQ"
              target="_blank"
              rel="noreferrer"
            >
              <img src={ytIcon} alt="youtube icon" className="icons" />
            </a>
          </div>
        </motion.nav>

        {/* Hero section */}
        <main className="main-section-container">
          <h1 className="title">
            UPCOMING ARTIST <span>RADIO</span>
          </h1>

          <h3 className="schedule">Monday Wednesday Friday</h3>

          <div className="btn-container">
            <button className="btn" onClick={() => setIsDisclaimerActive(true)}>
              Join Queue
            </button>

            <button className="btn" onClick={() => navigate("/queue")}>
              View Queue
            </button>
          </div>
        </main>

        <div
          className={
            isDisclaimerActive
              ? "disclaimer-container"
              : `disclaimer-container active`
          }
        >
          <motion.p
            className="disclaimer"
            initial={{ y: "-100%" }}
            animate={isDisclaimerActive ? { y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            {isAlreadyInQueue ? (
              <>
                <strong>*You've already Joined the queue!*</strong>
                <br /> *Free plays are ONLY guaranteed to ACTIVE
                viewers/listeners. Stay engaged and track your position in the
                queue to avoid being placed on hold for inactivity. Only one
                submission per artist is allowed in the queue at a time*
              </>
            ) : isQueueOn?.data?.state === "false" && !isAlreadyInQueue ? (
              <strong>
                *The free queue is currently closed. It is only open during the
                start of each live stream, come back for the next one!*
              </strong>
            ) : (
              `*Free plays are ONLY guaranteed to ACTIVE viewers/listeners. Stay engaged and track your position in the queue to avoid being placed on hold for inactivity. Only one submission per artist is allowed in the queue at a time*`
            )}
          </motion.p>

          <motion.button
            className="close-overlay"
            onClick={() => setIsDisclaimerActive(false)}
            initial={{ x: "-100%", opacity: 0 }}
            animate={isDisclaimerActive ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0, duration: 0.25 }}
          >
            Go Back
          </motion.button>

          {isQueueOn?.data?.state === "true" || isAlreadyInQueue ? (
            <motion.button
              className="close-overlay"
              onClick={() => {
                setIsDisclaimerActive(false);
                isAlreadyInQueue ? navigate("/queue") : setIsFormActive(true);
              }}
              initial={{ x: "100%", opacity: 0 }}
              animate={isDisclaimerActive ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0, duration: 0.25 }}
            >
              {isAlreadyInQueue ? "View Queue" : "Join Queue"}
            </motion.button>
          ) : (
            <></>
          )}
        </div>

        <SubmitForm
          isFormActive={isFormActive}
          setIsFormActive={setIsFormActive}
        />
      </div>
    </section>
  );
};

export default Home;
