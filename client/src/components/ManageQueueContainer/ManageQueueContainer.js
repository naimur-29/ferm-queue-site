import React from "react";
import "./ManageQueueContainer.css";

const ManageQueueContainer = ({
  queue,
  queueState,
  setQueueState,
  heading,
  opacity,
  setTargetQueuer,
  setTargetHeader,
  setIsDeleteOverlayActive,
  setIsHoldOverlayActive,
  setIsReleaseOverlayActive,
  setIsUpNextOverlayActive,
}) => {
  return (
    <div className="queue-container">
      <h2>{heading}</h2>
      {queue?.data?.length ? (
        queue?.data.map((item, ind) => (
          <div
            key={ind}
            className={
              !queueState[ind] && heading !== "Up Next"
                ? "queuer active"
                : "queuer"
            }
            style={{ opacity: opacity }}
          >
            <p className="username">
              <span
                title="Click to copy"
                onClick={() => {
                  navigator.clipboard.writeText(item?.youtube_username);
                }}
              >
                {queueState[ind] || heading === "Up Next"
                  ? "Username:"
                  : item?.youtube_username}
              </span>{" "}
              {queueState[ind] || heading === "Up Next"
                ? item?.youtube_username
                : ""}
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
                if (heading === "Up Next") return;
                let newArr = [...queueState];
                newArr[ind] = !newArr[ind];
                setQueueState([...newArr]);
              }}
              title="Click to expand"
            >
              {ind + 1}
            </button>

            {queueState[ind] || heading === "Up Next" ? (
              <>
                <p>
                  <span
                    title="Click to copy"
                    onClick={() => {
                      navigator.clipboard.writeText(item?.artist_name);
                    }}
                  >
                    {"Artist(s):"}
                  </span>{" "}
                  {item?.artist_name}
                </p>
                <p>
                  <span
                    title="Click to copy"
                    onClick={() => {
                      navigator.clipboard.writeText(item?.track_title);
                    }}
                  >
                    Track:
                  </span>{" "}
                  {item?.track_title}
                </p>
                <p>
                  <span
                    title="Click to copy"
                    onClick={() => {
                      navigator.clipboard.writeText(item?.link);
                    }}
                  >
                    Link:
                  </span>{" "}
                  {item?.link === item?.youtube_username
                    ? "Empty!"
                    : item?.link.length > 50
                    ? item?.link.slice(0, 47) + "..."
                    : item?.link}
                </p>
                <p>
                  <span
                    title="Click to copy"
                    onClick={() => {
                      navigator.clipboard.writeText(item?.message);
                    }}
                  >
                    Message:
                  </span>{" "}
                  {item?.message}
                </p>
                {/* <p>
                  <span>Joined:</span> {TimeBeautifier(item?.created_at)}
                </p> */}

                {/* Buttons */}
                {heading === "Waiting" ? (
                  <button
                    className="new-btn"
                    onClick={() => {
                      setTargetQueuer(item);
                      setIsHoldOverlayActive(true);
                    }}
                  >
                    Hold
                  </button>
                ) : (
                  <></>
                )}

                {heading === "On Hold" ? (
                  <button
                    className="new-btn"
                    onClick={() => {
                      setTargetQueuer(item);
                      setIsReleaseOverlayActive(true);
                    }}
                  >
                    Release
                  </button>
                ) : (
                  <></>
                )}

                {heading === "Waiting" || heading === "On Hold" ? (
                  <button
                    className="new-btn"
                    onClick={() => {
                      setTargetQueuer(item);
                      setIsUpNextOverlayActive(true);
                    }}
                  >
                    Move
                  </button>
                ) : (
                  <></>
                )}

                {/* Remove from queue button */}
                <button
                  className="new-btn"
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
