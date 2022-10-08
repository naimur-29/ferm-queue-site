import React, { useState, useEffect } from "react";
import "./ManageQueue.css";
import { useQuery } from "react-query";

// local services:
import axiosInstance from "../../services/axios";

// local components:
import ManageQueueContainer from "../../components/ManageQueueContainer/ManageQueueContainer";
import ManageQueueLoading from "../../components/ManageQueueContainer/ManageQueueLoading";

// query functions:
const fetchQueue = () => {
  return axiosInstance.get("queuer/queue/admin");
};

const fetchOnHoldQueue = () => {
  return axiosInstance.get("queuer/on-hold/admin");
};

const fetchActiveQueue = () => {
  return axiosInstance.get("active-queuer/queue/admin");
};

const ManageQueue = () => {
  const [isDeleteOverlayActive, setIsDeleteOverlayActive] = useState(false);
  const [targetQueuer, setTargetQueuer] = useState({});
  const [targetHeader, setTargetHeader] = useState("");

  // queue & onHoldQueue states
  const [queueState, setQueueState] = useState([]);
  const [onHoldQueueState, setOnHoldQueueState] = useState([]);
  const [activeQueueState, setActiveQueueState] = useState([]);

  // fetching queue:
  const {
    isLoading: isLoadingQueue,
    data: queue,
    isError: isQueueError,
  } = useQuery("queue-admin", fetchQueue);

  // fetching on hold queue:
  const {
    isLoading: isLoadingOnHoldQueue,
    data: onHoldQueue,
    isError: isOnHoldQueueError,
  } = useQuery("on-hold-queue-admin", fetchOnHoldQueue);

  // fetching active queue:
  const {
    isLoading: isLoadingActiveQueue,
    data: activeQueue,
    isError: isActiveQueueError,
  } = useQuery("active-queue-admin", fetchActiveQueue);

  // remove selected user from the queue
  const { isLoading: isLoadingRemoveCurrent, refetch: initiateLeaveQueue } =
    useQuery(
      ["remove-queuer-admin", targetQueuer, targetHeader],
      () => {
        const userID = targetQueuer?.user_id;
        console.log(userID);
        if (userID) {
          if (targetHeader === "Waiting" || targetHeader === "On Hold")
            return axiosInstance.delete(`queuer/${userID}`);
          else if (targetHeader === "Up Next")
            return axiosInstance.delete(`active-queuer/${userID}`);
        }
      },
      {
        enabled: false,
      }
    );

  // remove on hold:
  // useQuery("refresh-queuer-admin", () => {
  //   let targetQueuer = {};
  //   if (localStorage.getItem("userInfo") !== "undefined") {
  //     targetQueuer = JSON.parse(localStorage.getItem("userInfo"));
  //   }

  //   if (targetQueuer?.user_id) {
  //     return axiosInstance.put(`queuer/${targetQueuer?.user_id}`, {
  //       artist_name: targetQueuer?.artist_name,
  //       track_title: targetQueuer?.track_title,
  //       youtube_username: targetQueuer?.youtube_username,
  //       username: targetQueuer?.youtube_username?.toLowerCase(),
  //       link: targetQueuer?.link,
  //       message: targetQueuer?.message,
  //       on_hold: false,
  //     });
  //   }
  // });

  // useEffect hooks:
  useEffect(() => {
    if (!isLoadingQueue && !isLoadingOnHoldQueue) {
      setOnHoldQueueState(new Array(onHoldQueue?.length).fill(false));
      setQueueState(new Array(queue?.length).fill(false));
    }
  }, [isLoadingQueue, isLoadingOnHoldQueue, queue, onHoldQueue]);

  return (
    <section className="manage-queue-section-container">
      <main className="main-container">
        <h1 className="title">Upcoming Artist Radio</h1>

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
              window.location.reload();
            }}
          >
            Remove Queue?
          </button>
        </div>

        {/* queue section */}
        {/* Up next queuers */}
        {isLoadingActiveQueue ? (
          <ManageQueueLoading heading={"Up Next"} opacity={1} />
        ) : (
          <ManageQueueContainer
            queue={isActiveQueueError ? {} : activeQueue}
            queueState={activeQueueState}
            setQueueState={setActiveQueueState}
            heading={"Up Next"}
            opacity={1}
            setIsDeleteOverlayActive={setIsDeleteOverlayActive}
            setTargetQueuer={setTargetQueuer}
            setTargetHeader={setTargetHeader}
          />
        )}

        {/* Waiting queuers */}
        {isLoadingQueue || isLoadingRemoveCurrent ? (
          <ManageQueueLoading heading={"Waiting"} opacity={1} />
        ) : (
          <ManageQueueContainer
            queue={isQueueError ? {} : queue}
            queueState={queueState}
            setQueueState={setQueueState}
            heading={"Waiting"}
            opacity={1}
            setIsDeleteOverlayActive={setIsDeleteOverlayActive}
            setTargetQueuer={setTargetQueuer}
            setTargetHeader={setTargetHeader}
          />
        )}

        {/* On Hold queuers */}
        {isLoadingOnHoldQueue ? (
          <ManageQueueLoading heading={"On Hold"} />
        ) : (
          <ManageQueueContainer
            queue={isOnHoldQueueError ? {} : onHoldQueue}
            queueState={onHoldQueueState}
            setQueueState={setOnHoldQueueState}
            heading={"On Hold"}
            opacity={0.3}
            setIsDeleteOverlayActive={setIsDeleteOverlayActive}
            setTargetQueuer={setTargetQueuer}
            setTargetHeader={setTargetHeader}
          />
        )}

        {/* Navigation */}
        <div className="nav-container"></div>
      </main>
    </section>
  );
};

export default ManageQueue;
