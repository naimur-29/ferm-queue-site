import React, { useState, useEffect, useRef } from "react";
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

const fetchActiveQueue = () => {
  return axiosInstance.get("active-queuer/queue");
};

const removeCurrentUser = () => {
  let targetQueuer = {};
  if (localStorage.getItem("userInfo") !== "undefined") {
    targetQueuer = JSON.parse(localStorage.getItem("userInfo"));
  }

  return axiosInstance.delete(`queuer/${targetQueuer?.user_id}`);
};

const Queue = () => {
  const [isDisclaimerActive, setIsDisclaimerActive] = useState(true);
  const [isDeleteOverlayActive, setIsDeleteOverlayActive] = useState(false);
  const isMounted = useRef();

  // queue & onHoldQueue states
  const [queueState, setQueueState] = useState([]);
  const [onHoldQueueState, setOnHoldQueueState] = useState([]);
  const [activeQueueState, setActiveQueueState] = useState([]);

  // fetching queue:
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

  // fetching active queue:
  const {
    isLoading: isLoadingActiveQueue,
    data: activeQueue,
    isError: isActiveQueueError,
  } = useQuery("active-queue", fetchActiveQueue);

  // remove current user from the queue
  const { isLoading: isLoadingRemoveCurrent, refetch: initiateLeaveQueue } =
    useQuery("remove-current", removeCurrentUser, { enabled: false });

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

  // useEffect hooks:
  useEffect(() => {
    if (!isLoadingQueue && !isLoadingOnHoldQueue) {
      setOnHoldQueueState(new Array(onHoldQueue?.length).fill(false));
      setQueueState(new Array(queue?.length).fill(false));
    }
  }, [isLoadingQueue, isLoadingOnHoldQueue, queue, onHoldQueue]);

  // setting how may times the user visited the queue page & showing the disclaimer message at the start if visit count is 1:
  useEffect(() => {
    if (!isMounted.current) {
      let visitCount = Number(window.localStorage.getItem("visitCount"));

      if (visitCount) {
        window.localStorage.setItem("visitCount", visitCount + 1);
      } else {
        window.localStorage.setItem("visitCount", 1);
      }

      setIsDisclaimerActive(
        Number(window.localStorage.getItem("visitCount")) === 1 ? true : false
      );
    }

    isMounted.current = true;
  }, []);

  return (
    <section className="queue-section-container">
      <main className="main-container">
        <h1 className="title">Upcoming Artist Radio</h1>

        <QueueDisclaimer
          isDisclaimerActive={isDisclaimerActive}
          setIsDisclaimerActive={setIsDisclaimerActive}
        />

        {/* Remove current user overlay */}
        <div
          className={
            isDeleteOverlayActive ? "delete-overlay active" : "delete-overlay"
          }
          onClick={() => setIsDeleteOverlayActive(false)}
        >
          <button
            className="del-btn"
            onClick={() => {
              initiateLeaveQueue();
              localStorage.removeItem("userInfo");
              window.location.reload();
            }}
          >
            Leave Queue?
          </button>
        </div>

        {/* queue section */}
        {/* About To Be Played */}
        {isLoadingActiveQueue ? (
          <PublicQueueLoading heading={"Up Next"} opacity={1} />
        ) : (
          <PublicQueueContainer
            queue={isActiveQueueError ? {} : activeQueue}
            queueState={activeQueueState}
            setQueueState={setActiveQueueState}
            heading={"Up Next"}
            opacity={1}
          />
        )}

        {/* Pending */}
        {isLoadingQueue || isLoadingRemoveCurrent ? (
          <PublicQueueLoading heading={"Waiting"} opacity={1} />
        ) : (
          <PublicQueueContainer
            queue={isQueueError ? {} : queue}
            queueState={queueState}
            setQueueState={setQueueState}
            heading={"Waiting"}
            opacity={1}
            isDeleteOverlayActive={isDeleteOverlayActive}
            setIsDeleteOverlayActive={setIsDeleteOverlayActive}
          />
        )}

        {/* On Hold */}
        {isLoadingOnHoldQueue ? (
          <PublicQueueLoading heading={"On Hold"} />
        ) : (
          <PublicQueueContainer
            queue={isOnHoldQueueError ? {} : onHoldQueue}
            queueState={onHoldQueueState}
            setQueueState={setOnHoldQueueState}
            heading={"On Hold"}
            opacity={0.3}
          />
        )}
      </main>
    </section>
  );
};

export default Queue;
