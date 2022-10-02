import React, { useState, useEffect } from "react";
import "./PublicQueueContainer.css";

// Global Functions & Variables:
const TimeBeautifier = (timeString) => {
  let date = timeString.slice(0, 10);
  let time = timeString.slice(11, -7);

  // get users time offset:
  let offset = new Date().getTimezoneOffset();
  offset *= -1;

  time = time.split(":"); // convert to array

  // fetch
  let hours = Number(time[0]) + Math.floor(offset / 60);
  let minutes = Number(time[1]) + (offset % 60);

  if (minutes > 60) {
    minutes -= 60;
    hours++;
  }

  // calculate
  let timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue = "" + hours;
  } else if (hours > 12) {
    timeValue = "" + (hours - 24);
  } else if (hours === 0) {
    timeValue = "12";
  }

  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
  timeValue += hours >= 12 ? " AM" : " PM";

  return date + " at " + timeValue;
};

const PublicQueueContainer = ({
  queue,
  queueState,
  setQueueState,
  heading,
  opacity,
}) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (localStorage.getItem("userInfo") !== "undefined") {
      setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  return (
    <div className="queue-container">
      <h2>{heading}</h2>
      {queue?.data?.length ? (
        queue?.data.map((item, ind) => (
          <div
            key={ind}
            className={
              currentUser?.youtube_username === item?.youtube_username
                ? !queueState[ind]
                  ? "queuer active current"
                  : "queuer current"
                : !queueState[ind]
                ? "queuer active"
                : "queuer"
            }
            style={{ opacity: opacity }}
          >
            <p className="username">
              <span>
                {queueState[ind] ? "Username:" : item?.youtube_username}
              </span>{" "}
              {queueState[ind] ? item?.youtube_username : ""}
            </p>

            {item?.youtube_username === item?.link ? (
              <button className="link-btn">{"F"}</button>
            ) : (
              <a href={item?.link} target="_blank" rel="noreferrer">
                <button className="link-btn">{">>"}</button>
              </a>
            )}
            <button
              className="info-btn"
              onClick={() => {
                let newArr = [...queueState];
                newArr[ind] = !newArr[ind];
                setQueueState([...newArr]);
              }}
            >
              {ind + 1}
            </button>

            {queueState[ind] ? (
              <>
                <p>
                  <span>{"Artist(s):"}</span> {item?.artist_name}
                </p>
                <p>
                  <span>Track:</span> {item?.track_title}
                </p>
                <p>
                  <span>Link:</span>{" "}
                  {item?.link === item?.youtube_username
                    ? "Empty!"
                    : item?.link.length > 50
                    ? item?.link.slice(0, 47) + "..."
                    : item?.link}
                </p>
                {/* <p>
                  <span>Joined:</span> {TimeBeautifier(item?.created_at)}
                </p> */}
              </>
            ) : (
              <></>
            )}
          </div>
        ))
      ) : (
        <h3 className="empty-disclaimer">Empty!</h3>
      )}
    </div>
  );
};

export default PublicQueueContainer;
