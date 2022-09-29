import React, { useState, useEffect } from "react";
import "./Queue.css";
import { useQuery } from "react-query";

// local services:
import axiosInstance from "../../services/axios";

// local components:
import BootAnimation from "../../components/BootAnimation/BootAnimation";
import QueueDisclaimer from "../../components/QueueDisclaimer/QueueDisclaimer";
import PublicQueueContainer from "../../components/PublicQueueContainer/PublicQueueContainer";

// global declarations:
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
  const {
    isLoading: isLoadingQueue,
    data: queue,
    isError: isQueueError,
  } = useQuery("queue", fetchQueue);

  // fetching on hold queue:
  const {
    isLoading: isLoadingOnHoldQueue,
    data: onHoldQueue,
    isError: isOnHoldQueueError,
  } = useQuery("on-hold-queue", fetchOnHoldQueue);

  useEffect(() => {
    if (!isLoadingQueue && !isLoadingOnHoldQueue) {
      setOnHoldQueueState(new Array(onHoldQueue?.length).fill(false));
      setQueueState(new Array(queue?.length).fill(false));
    }
  }, [isLoadingQueue, isLoadingOnHoldQueue, queue, onHoldQueue]);

  // remove on hold:
  useQuery("refresh-queuer", () => {
    let targetQueuer = {};
    if (localStorage.getItem("userInfo") !== "undefined") {
      targetQueuer = JSON.parse(localStorage.getItem("userInfo"));
      setCurrentQueuer(targetQueuer);
    }

    if (targetQueuer?.user_id) {
      return axiosInstance.put(`queuer/${targetQueuer?.user_id}`, {
        artist_name: targetQueuer?.artist_name,
        track_title: targetQueuer?.track_title,
        youtube_username: targetQueuer?.youtube_username,
        username: targetQueuer?.youtube_username?.toLowerCase(),
        link: targetQueuer?.link,
        message: targetQueuer?.message,
        on_hold: false,
      });
    }
  });

  if (isLoadingQueue || isLoadingOnHoldQueue) return <BootAnimation />;

  return (
    <section className="queue-section-container">
      <main className="main-container">
        <h1 className="title">Upcoming Artist Radio</h1>

        <QueueDisclaimer
          isDisclaimerActive={isDisclaimerActive}
          setIsDisclaimerActive={setIsDisclaimerActive}
        />

        {/* queue section */}
        <PublicQueueContainer
          TimeBeautifier={TimeBeautifier}
          queue={isQueueError ? {} : queue}
          queueState={queueState}
          setQueueState={setQueueState}
          heading={"Queue"}
          opacity={1}
        />

        <PublicQueueContainer
          TimeBeautifier={TimeBeautifier}
          queue={onHoldQueue}
          queueState={isOnHoldQueueError ? {} : onHoldQueueState}
          setQueueState={setOnHoldQueueState}
          heading={"On-hold Queue"}
          opacity={0.3}
        />
      </main>
    </section>
  );
};

export default Queue;
