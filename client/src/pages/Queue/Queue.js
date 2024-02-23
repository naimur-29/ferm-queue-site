import React, { useState, useEffect } from "react";
import "./Queue.css";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

// local services:
import axiosInstance from "../../services/axios";

// local components:
// import QueueDisclaimer from "../../components/QueueDisclaimer/QueueDisclaimer";
import PublicQueueContainer from "../../components/PublicQueueContainer/PublicQueueContainer";
import PublicQueueLoading from "../../components/PublicQueueContainer/PublicQueueLoading";
import UpdateForm from "../../components/UpdateForm/UpdateForm";

// assets:
import YtLogo from "../../assets/socials/yt-icon.svg";

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
  // const [isDisclaimerActive, setIsDisclaimerActive] = useState(true);

  // delete state:
  const [isDeleteOverlayActive, setIsDeleteOverlayActive] = useState(false);

  // update state:
  const [isUpdateOverlayActive, setIsUpdateOverlayActive] = useState(false);
  const [isUpdateFormActive, setIsUpdateFormActive] = useState(false);

  // const isMounted = useRef();
  const navigate = useNavigate();

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
    document.title = "UAR Queue";

    if (!isLoadingQueue && !isLoadingOnHoldQueue && !isLoadingActiveQueue) {
      setOnHoldQueueState(new Array(onHoldQueue?.length).fill(false));
      setQueueState(new Array(queue?.length).fill(false));
      setActiveQueueState(new Array(activeQueue?.length).fill(false));

      //TODO:
      // document.title = `UAR Queue(${
        // activeQueue?.length + queue?.length + onHoldQueue?.length || 0
      // })`;
    }
  }, [
    isLoadingQueue,
    isLoadingOnHoldQueue,
    isLoadingActiveQueue,
    queue,
    onHoldQueue,
    activeQueue,
  ]);

  // setting how may times the user visited the queue page & showing the disclaimer message at the start if visit count is 1:
  // useEffect(() => {
  //   if (!isMounted.current) {
  //     let visitCount = Number(window.localStorage.getItem("visitCount"));

  //     if (visitCount) {
  //       window.localStorage.setItem("visitCount", visitCount + 1);
  //     } else {
  //       window.localStorage.setItem("visitCount", 1);
  //     }

  //     setIsDisclaimerActive(
  //       Number(window.localStorage.getItem("visitCount")) === 1 ? true : false
  //     );
  //   }

  //   isMounted.current = true;
  // }, []);

  return (
    <section className="queue-section-container">
      <main className="main-container">
        <h1 className="title">
          <span onClick={() => navigate("/")}>
            Upcoming Artist Radio
          </span>
        </h1>
    
        <a className="stream-btn" href="/">
          <div className="logo-container">
            <img className="logo" src={YtLogo} atl="youtube" />
          </div>
          <p>STREAM</p>
        </a>

        {/* Disclaimer */}
        {/* <QueueDisclaimer
          isDisclaimerActive={isDisclaimerActive}
          setIsDisclaimerActive={setIsDisclaimerActive}
        /> */}

        {/* Remove current user -> overlay */}
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
              !isLoadingRemoveCurrent && window.location.reload();
            }}
          >
            Leave Queue?
          </button>
        </div>

        {/* Update current user -> overlay */}
        <div
          className={
            isUpdateOverlayActive ? "update-overlay active" : "update-overlay"
          }
        >
          <UpdateForm
            isFormActive={isUpdateFormActive}
            setIsFormActive={setIsUpdateFormActive}
            setIsUpdateOverlayActive={setIsUpdateOverlayActive}
          />
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

        {/* waiting */}
        {isLoadingQueue || isLoadingRemoveCurrent ? (
          <PublicQueueLoading heading={"Waiting"} opacity={1} />
        ) : (
          <PublicQueueContainer
            queue={isQueueError ? {} : queue}
            queueState={queueState}
            setQueueState={setQueueState}
            heading={"Waiting"}
            opacity={1}
            setIsDeleteOverlayActive={setIsDeleteOverlayActive}
            setIsUpdateOverlayActive={setIsUpdateOverlayActive}
            setIsUpdateFormActive={setIsUpdateFormActive}
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
