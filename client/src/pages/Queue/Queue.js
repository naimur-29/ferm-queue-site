import React, { useState, useEffect } from "react";
import "./Queue.css";
import { useQuery } from "react-query";
import { motion } from "framer-motion";

// local services:
import axiosInstance from "../../services/axios";

// local components:
import BootAnimation from "../../components/BootAnimation/BootAnimation";

// global declarations:
const TimeBeautifier = (timeString) => {
  let date = timeString.slice(0, 10);
  let time = timeString.slice(11, -7);

  time = time.split(":"); // convert to array

  // fetch
  let hours = Number(time[0]);
  let minutes = Number(time[1]);

  // calculate
  let timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue = "" + hours;
  } else if (hours > 12) {
    timeValue = "" + (hours - 12);
  } else if (hours === 0) {
    timeValue = "12";
  }

  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
  timeValue += hours >= 12 ? " PM" : " AM";

  return date + " at " + timeValue;
};

// query functions:
const fetchQueue = () => {
  return axiosInstance.get("queuer/queue");
};
const fetchOnHoldQueue = () => {
  return axiosInstance.get("queuer/on-hold");
};

const Queue = () => {
  const [isDisclaimerActive, setIsDisclaimerActive] = useState(true);
  const [currentQueuer, setCurrentQueuer] = useState({});

  // queue & onHoldQueue states
  const [queueState, setQueueState] = useState([]);
  const [onHoldQueueState, setOnHoldQueueState] = useState([]);

  // fetching active queue:
  const { isLoading: isLoadingQueue, data: queue } = useQuery(
    "queue",
    fetchQueue
  );

  // fetching on hold queue:
  const { isLoading: isLoadingOnHoldQueue, data: onHoldQueue } = useQuery(
    "on-hold-queue",
    fetchOnHoldQueue
  );

  useEffect(() => {
    if (!isLoadingQueue && !isLoadingOnHoldQueue) {
      setOnHoldQueueState(new Array(onHoldQueue?.length).fill(false));
      setQueueState(new Array(queue?.length).fill(false));
    }
  }, [isLoadingQueue, isLoadingOnHoldQueue, queue, onHoldQueue]);

  useEffect(() => {
    setCurrentQueuer(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  // remove on hold:
  useQuery("refresh-queuer", () => {
    return axiosInstance.put(`queuer/${currentQueuer?.user_id}`, {
      ...currentQueuer,
      on_hold: false,
    });
  });

  if (isLoadingQueue || isLoadingOnHoldQueue) return <BootAnimation />;

  return (
    <section className="queue-section-container">
      <div className="main-container">
        <h1 className="title">Upcoming Artist Radio</h1>

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
            *To guarantee your track is played for free, stay engaged and keep
            an eye on the queue page. You may be put on hold after a certain
            time of inactivity*
          </article>
        </motion.div>

        <div className="queue-container">
          <h2>Queue</h2>
          {queue?.data?.length ? (
            queue?.data.map((item, ind) => (
              <div
                key={ind}
                className={!queueState[ind] ? "queuer active" : "queuer"}
              >
                <p className="username">
                  <span>
                    {queueState[ind] ? "Username:" : item?.youtube_username}
                  </span>{" "}
                  {queueState[ind] ? item?.youtube_username : ""}
                </p>

                <a href={item?.link} target="_blank" rel="noreferrer">
                  <button className="link-btn">{">>"}</button>
                </a>
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
                      <span>Artist:</span> {item?.artist_name}
                    </p>
                    <p>
                      <span>Track:</span> {item?.track_title}
                    </p>
                    <p>
                      <span>Joined:</span> {TimeBeautifier(item?.created_at)}
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <h3>Empty!</h3>
          )}
        </div>

        <div className="on-hold-queue-container">
          <h2>On Hold</h2>
          {onHoldQueue?.data?.length ? (
            onHoldQueue?.data.map((item, ind) => (
              <div
                key={ind}
                className={!onHoldQueueState[ind] ? "queuer active" : "queuer"}
              >
                <p className="username">
                  <span>
                    {onHoldQueueState[ind]
                      ? "Username:"
                      : item?.youtube_username}
                  </span>{" "}
                  {onHoldQueueState[ind] ? item?.youtube_username : ""}
                </p>

                <a href={item?.link} target="_blank" rel="noreferrer">
                  <button className="link-btn">{">>"}</button>
                </a>
                <button
                  className="info-btn"
                  onClick={() => {
                    let newArr = [...onHoldQueueState];
                    newArr[ind] = !newArr[ind];
                    setOnHoldQueueState([...newArr]);
                  }}
                >
                  {ind + 1}
                </button>

                {onHoldQueueState[ind] ? (
                  <>
                    <p>
                      <span>Artist:</span> {item?.artist_name}
                    </p>
                    <p>
                      <span>Track:</span> {item?.track_title}
                    </p>
                    <p>
                      <span>Joined:</span> {TimeBeautifier(item?.created_at)}
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <h3>Empty!</h3>
          )}
        </div>
      </div>
    </section>
  );
};

export default Queue;
