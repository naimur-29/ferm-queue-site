import React from "react";
import "./ManageQueueContainer.css";

const ManageQueueContainer = ({
  queue,
  queueState,
  setQueueState,
  heading,
  opacity,
  setIsDeleteOverlayActive,
  setTargetQueuer,
  setTargetHeader,
}) => {
  return (
    <div className="queue-container">
      <h2>{heading}</h2>
      {queue?.data?.length ? (
        queue?.data.map((item, ind) => (
          <div
            key={ind}
            className={!queueState[ind] ? "queuer active" : "queuer"}
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
                  <span>Joined:</span> {TimeBeautifier(item?.created_at)}
                </p> */}

                {/* Remove from queue button */}
                <button
                  className="leave-btn"
                  onClick={() => {
                    setTargetQueuer(item);
                    setTargetHeader(heading);
                    setIsDeleteOverlayActive(true);
                  }}
                >
                  Remove
                </button>
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

export default ManageQueueContainer;
