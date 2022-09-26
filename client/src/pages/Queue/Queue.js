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

  time = time.split(":"); // convert to array

  // fetch
  let hours = Number(time[0]) + Math.floor(offset / 60);
  let minutes = Number(time[1]) + (offset % 60);

  // calculate
  if (minutes > 60) {
    minutes = minutes % 60;
    hours++;
  }

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
  const { isLoading: isRefreshing } = useQuery("refresh-queuer", () => {
    return axiosInstance.put(`queuer/${currentQueuer?.user_id}`, {
      ...currentQueuer,
      on_hold: false,
    });
  });

  if (isLoadingQueue || isLoadingOnHoldQueue || isRefreshing)
    return <BootAnimation />;

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
          queue={queue}
          queueState={queueState}
          setQueueState={setQueueState}
          heading={"Queue"}
          opacity={1}
        />

        <PublicQueueContainer
          TimeBeautifier={TimeBeautifier}
          queue={onHoldQueue}
          queueState={onHoldQueueState}
          setQueueState={setOnHoldQueueState}
          heading={"On-hold Queue"}
          opacity={0.5}
        />
      </main>
    </section>
  );
};

export default Queue;
