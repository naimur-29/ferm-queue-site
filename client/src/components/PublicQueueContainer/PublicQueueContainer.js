import React, { useState, useEffect } from "react";
import "./PublicQueueContainer.css";

// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// dayjs.extend(relativeTime);

const PublicQueueContainer = ({
  queue,
  queueState,
  setQueueState,
  heading,
  opacity,
  setIsDeleteOverlayActive,
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
              <button className="link-btn" title="File submission">
                {"F"}
              </button>
            ) : (
              <a
                href={item?.link}
                target="_blank"
                rel="noreferrer"
                title="Click to visit"
              >
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
              title="Click to expand"
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
                  <span>Joined:</span> {item?.created_at}
                </p>
                <p>
                  <span>Joined:</span> {dayjs(item?.created_at).fromNow()}
                </p> */}

                {/* leave button */}
                {currentUser?.youtube_username === item?.youtube_username &&
                heading !== "Up Next" ? (
                  <button
                    className="leave-btn"
                    onClick={() => {
                      setIsDeleteOverlayActive(true);
                    }}
                  >
                    Leave
                  </button>
                ) : (
                  <></>
                )}

                {/* update button
                {currentUser?.youtube_username === item?.youtube_username &&
                heading !== "Up Next" ? (
                  <button
                    className="leave-btn"
                    onClick={() => {
                      setIsDeleteOverlayActive(true);
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <></>
                )} */}
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
