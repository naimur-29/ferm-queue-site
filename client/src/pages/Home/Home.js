import React, { useEffect, useState } from "react";
import "./Home.css";

// Importing img assets from local directory
import fbIcon from "../../assets/socials/fb-icon.svg";
import instaIcon from "../../assets/socials/insta-icon.svg";
import twitterIcon from "../../assets/socials/twitter-icon.svg";
import ytIcon from "../../assets/socials/yt-icon.svg";

// constant variables
const realFermAudioLogoImg =
  "https://cdn.discordapp.com/attachments/1011744799629529208/1019645944221941841/realFERMaudio_logo_w_face2.png";

const Home = () => {
  const [isLoadingActive, setIsLoadingActive] = useState(true);

  useEffect(() => {
    let timer1 = setTimeout(() => setIsLoadingActive(false), 3 * 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  return (
    <section className="home-section-container">
      {/* loading animation */}
      <div class={isLoadingActive ? "spinner" : "spinner inactive"}>
        <div class="spinner-item"></div>
        <div class="spinner-item"></div>
        <div class="spinner-item"></div>
      </div>

      <div class="snow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1536"
          preserveAspectRatio="xMidYMax slice"
        >
          <g fill="#FFF" fill-opacity=".15" transform="translate(55 42)">
            <g id="snow-bottom-layer">
              <ellipse cx="6" cy="1009.5" rx="6" ry="5.5" />
              <ellipse cx="138" cy="1110.5" rx="6" ry="5.5" />
              <ellipse cx="398" cy="1055.5" rx="6" ry="5.5" />
              <ellipse cx="719" cy="1284.5" rx="6" ry="5.5" />
              <ellipse cx="760" cy="1155.5" rx="6" ry="5.5" />
              <ellipse cx="635" cy="1459.5" rx="6" ry="5.5" />
              <ellipse cx="478" cy="1335.5" rx="6" ry="5.5" />
              <ellipse cx="322" cy="1414.5" rx="6" ry="5.5" />
              <ellipse cx="247" cy="1234.5" rx="6" ry="5.5" />
              <ellipse cx="154" cy="1425.5" rx="6" ry="5.5" />
              <ellipse cx="731" cy="773.5" rx="6" ry="5.5" />
              <ellipse cx="599" cy="874.5" rx="6" ry="5.5" />
              <ellipse cx="339" cy="819.5" rx="6" ry="5.5" />
              <ellipse cx="239" cy="1004.5" rx="6" ry="5.5" />
              <ellipse cx="113" cy="863.5" rx="6" ry="5.5" />
              <ellipse cx="102" cy="1223.5" rx="6" ry="5.5" />
              <ellipse cx="395" cy="1155.5" rx="6" ry="5.5" />
              <ellipse cx="826" cy="943.5" rx="6" ry="5.5" />
              <ellipse cx="626" cy="1054.5" rx="6" ry="5.5" />
              <ellipse cx="887" cy="1366.5" rx="6" ry="5.5" />
              <ellipse cx="6" cy="241.5" rx="6" ry="5.5" />
              <ellipse cx="138" cy="342.5" rx="6" ry="5.5" />
              <ellipse cx="398" cy="287.5" rx="6" ry="5.5" />
              <ellipse cx="719" cy="516.5" rx="6" ry="5.5" />
              <ellipse cx="760" cy="387.5" rx="6" ry="5.5" />
              <ellipse cx="635" cy="691.5" rx="6" ry="5.5" />
              <ellipse cx="478" cy="567.5" rx="6" ry="5.5" />
              <ellipse cx="322" cy="646.5" rx="6" ry="5.5" />
              <ellipse cx="247" cy="466.5" rx="6" ry="5.5" />
              <ellipse cx="154" cy="657.5" rx="6" ry="5.5" />
              <ellipse cx="731" cy="5.5" rx="6" ry="5.5" />
              <ellipse cx="599" cy="106.5" rx="6" ry="5.5" />
              <ellipse cx="339" cy="51.5" rx="6" ry="5.5" />
              <ellipse cx="239" cy="236.5" rx="6" ry="5.5" />
              <ellipse cx="113" cy="95.5" rx="6" ry="5.5" />
              <ellipse cx="102" cy="455.5" rx="6" ry="5.5" />
              <ellipse cx="395" cy="387.5" rx="6" ry="5.5" />
              <ellipse cx="826" cy="175.5" rx="6" ry="5.5" />
              <ellipse cx="626" cy="286.5" rx="6" ry="5.5" />
              <ellipse cx="887" cy="598.5" rx="6" ry="5.5" />
            </g>
          </g>
          <g fill="#FFF" fill-opacity=".3" transform="translate(65 63)">
            <g id="snow-top-layer">
              <circle cx="8" cy="776" r="8" />
              <circle cx="189" cy="925" r="8" />
              <circle cx="548" cy="844" r="8" />
              <circle cx="685" cy="1115" r="8" />
              <circle cx="858" cy="909" r="8" />
              <circle
                cx="874"
                cy="1438"
                r="8"
                transform="rotate(180 874 1438)"
              />
              <circle
                cx="657"
                cy="1256"
                r="8"
                transform="rotate(180 657 1256)"
              />
              <circle
                cx="443"
                cy="1372"
                r="8"
                transform="rotate(180 443 1372)"
              />
              <circle
                cx="339"
                cy="1107"
                r="8"
                transform="rotate(180 339 1107)"
              />
              <circle cx="24" cy="1305" r="8" transform="rotate(180 24 1305)" />
              <circle cx="8" cy="8" r="8" />
              <circle cx="189" cy="157" r="8" />
              <circle cx="548" cy="76" r="8" />
              <circle cx="685" cy="347" r="8" />
              <circle cx="858" cy="141" r="8" />
              <circle cx="874" cy="670" r="8" transform="rotate(180 874 670)" />
              <circle cx="657" cy="488" r="8" transform="rotate(180 657 488)" />
              <circle cx="443" cy="604" r="8" transform="rotate(180 443 604)" />
              <circle cx="339" cy="339" r="8" transform="rotate(180 339 339)" />
              <circle cx="24" cy="537" r="8" transform="rotate(180 24 537)" />
            </g>
          </g>
        </svg>
      </div>

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

        <main className="main-section-container">
          <h1 className="title">
            UPCOMING ARTIST <span>RADIO</span>
          </h1>
          <h3 className="schedule">Monday Wednesday Friday</h3>

          <div className="btn-container">
            <button className="btn">Join Queue</button>
            <button className="btn">View Queue</button>
          </div>
          <div className="disclaimer-container">
            <p className="disclaimer">
              *Queue is only open during showtime. One submission per artist at
              a time. To guarantee your track is played for free, stay engaged
              and keep an eye on the queue page. You may be put on hold after a
              certain time of inactivity*
            </p>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Home;
