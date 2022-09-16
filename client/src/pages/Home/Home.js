import React from "react";
import "./Home.css";

// Importing img assets from local directory
import fbIcon from "../../assets/socials/fb-icon.svg";
import instaIcon from "../../assets/socials/insta-icon.svg";
import twitterIcon from "../../assets/socials/twitter-icon.svg";

// constant variables
const realFermAudioLogoImg =
  "https://cdn.discordapp.com/attachments/1011744799629529208/1019645944221941841/realFERMaudio_logo_w_face2.png";

const Home = () => {
  return (
    <section className="home-section-container">
      <div className="main-container">
        {/* Top nav section with logo & socials */}
        <nav className="nav-container">
          {/* Logo section */}
          <div className="left">
            <a href="/">
              <img
                src={realFermAudioLogoImg}
                alt="RealFerm Audio Logo"
                className="logo"
              />
            </a>
          </div>

          {/* Socials Section */}
          <div className="right">
            <a href="/">
              <img src={fbIcon} alt="" className="icons" />
            </a>
            <a href="/">
              <img src={instaIcon} alt="" className="icons" />
            </a>
            <a href="/">
              <img src={twitterIcon} alt="" className="icons" />
            </a>
            <a href="/" className="site-link">
              REALFERMAUDIO
            </a>
          </div>
        </nav>

        <main className="main-section-container">
          <h1 className="title">
            UPCOMING ARTIST <span>RADIO</span>
          </h1>
          <h3 className="schedule">Monday Wednesday Friday</h3>

          <div className="btn-container">
            <button className="btn">Join Queue</button>
            <button className="btn">View Queue</button>
          </div>

          <p className="disclaimer">
            *Queue's only open during showtime. One submission per artist at a
            time. To guarantee your track is played for free, stay engaged &
            keep an eye on the queue page. You'll be put on hold after a certain
            time. So, remove yourself from from the on hold queue to let us know
            you're still there to keep you spot in line.
          </p>
        </main>
      </div>
    </section>
  );
};

export default Home;
