import React, { useState, useEffect } from "react";
import "./Home.css";

// Importing local components
import Snow from "../../components/Snow/Snow";
import BootAnimation from "../../components/BootAnimation/BootAnimation";
import SubmitForm from "../../components/SubmitForm/SubmitForm";

// Importing img assets from local directory
import fbIcon from "../../assets/socials/fb-icon.svg";
import instaIcon from "../../assets/socials/insta-icon.svg";
import twitterIcon from "../../assets/socials/twitter-icon.svg";
import ytIcon from "../../assets/socials/yt-icon.svg";

// constant variables
const realFermAudioLogoImg =
  "https://cdn.discordapp.com/attachments/1011744799629529208/1019645944221941841/realFERMaudio_logo_w_face2.png";

const Home = () => {
  const [isDisclaimerActive, setIsDisclaimerActive] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);
  const [disclaimerHidePos, setDisclaimerHidePos] = useState("down");

  useEffect(() => {
    let timer1 = setTimeout(() => setIsDisclaimerActive(true), 4 * 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  return (
    <section className="home-section-container">
      {/* loading animation */}
      <BootAnimation />

      {/* Snow Effect on Background */}
      <Snow />

      <div className="main-container">
        {/* Top nav section with logo & socials */}
        <nav className="nav-container">
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
        </nav>

        {/* Hero section */}
        <main className="main-section-container">
          <h1 className="title">
            UPCOMING ARTIST <span>RADIO</span>
          </h1>

          <h3 className="schedule">Monday Wednesday Friday</h3>

          <div className="btn-container">
            <button className="btn" onClick={() => setIsFormActive(true)}>
              Join Queue
            </button>

            <button className="btn">View Queue</button>
          </div>
        </main>

        <div
          className={
            isDisclaimerActive
              ? "disclaimer-container"
              : `disclaimer-container ${disclaimerHidePos}`
          }
        >
          <button
            className="close-overlay"
            onClick={() => {
              setIsDisclaimerActive(false);
              setDisclaimerHidePos("up");
            }}
          >
            Shoot Up
          </button>

          <p className="disclaimer">
            *Queue is only open during showtime. One submission per artist at a
            time. To guarantee your track is played for free, stay engaged and
            keep an eye on the queue page. You may be put on hold after a
            certain time of inactivity*
          </p>

          <button
            className="close-overlay"
            onClick={() => {
              setIsDisclaimerActive(false);
              setDisclaimerHidePos("down");
            }}
          >
            Shoot Down
          </button>
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
