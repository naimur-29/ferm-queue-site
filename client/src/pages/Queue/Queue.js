import React, { useState, useEffect } from "react";
import "./Queue.css";
import { useQuery } from "react-query";

// local services:
import axiosInstance from "../../services/axios";

// local components:
import QueueDisclaimer from "../../components/QueueDisclaimer/QueueDisclaimer";
import PublicQueueContainer from "../../components/PublicQueueContainer/PublicQueueContainer";
import PublicQueueLoading from "../../components/PublicQueueContainer/PublicQueueLoading";

// query functions:
const fetchQueue = () => {
  return axiosInstance.get("queuer/queue");
};
const fetchOnHoldQueue = () => {
  return axiosInstance.get("queuer/on-hold");
};

const Queue = () => {
  const [isDisclaimerActive, setIsDisclaimerActive] = useState(true);

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

  return (
    <section className="queue-section-container">
      <main className="main-container">
        <h1 className="title">Upcoming Artist Radio</h1>

        <QueueDisclaimer
          isDisclaimerActive={isDisclaimerActive}
          setIsDisclaimerActive={setIsDisclaimerActive}
        />

        {/* queue section */}
        {isLoadingQueue ? (
          <PublicQueueLoading heading={"Queue"} opacity={1} />
        ) : (
          <PublicQueueContainer
            queue={isQueueError ? {} : queue}
            queueState={queueState}
            setQueueState={setQueueState}
            heading={"Queue"}
            opacity={1}
          />
        )}

        {isLoadingOnHoldQueue ? (
          <PublicQueueLoading heading={"On-hold Queue"} />
        ) : (
          <PublicQueueContainer
            queue={isOnHoldQueueError ? {} : onHoldQueue}
            queueState={onHoldQueueState}
            setQueueState={setOnHoldQueueState}
            heading={"On-hold Queue"}
            opacity={0.3}
          />
        )}

        {/* Navigation */}
        <div className="nav-container"></div>
      </main>
    </section>
  );
};

export default Queue;
