import React from "react";
import "./ManageQueueContainer.css";

// importing icons:
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHandPointer } from "react-icons/fa";
import { FaRegHandPaper } from "react-icons/fa";
import { FaHandsWash } from "react-icons/fa";

// check priority submissions:
const premiumArr = [
  "donated",
  "donation",
  "priority",
  "prio",
  "paid",
  "skip",
  "venmo",
  "cashapp",
];

const isPremium = (string) => {
  let processedString = string.toLowerCase();
  for (let clue of premiumArr) {
    if (processedString.includes(clue)) {
      return true;
    }
  }

  return false;
};

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
            className={`queuer${
              !queueState[ind] && heading !== "Up Next" ? " active" : ""
            }${isPremium(item?.message || "") ? " premium" : ""}`}
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
                    Note:
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
                    Hold <FaRegHandPaper className="icon" />
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
                    Release <FaHandsWash className="icon" />
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
                    Move <FaRegHandPointer className="icon" />
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
                  Remove <RiDeleteBin6Line className="icon" />
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
