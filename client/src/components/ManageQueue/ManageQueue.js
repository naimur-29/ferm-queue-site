import React, { useState, useEffect } from "react";
import "./ManageQueue.css";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

// local services:
import axiosInstance from "../../services/axios";

// local components:
import ManageQueueContainer from "../../components/ManageQueueContainer/ManageQueueContainer";
import ManageQueueLoading from "../../components/ManageQueueContainer/ManageQueueLoading";
import SubmitForm from "../SubmitForm/SubmitForm";

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
  const [isReleaseOverlayActive, setIsReleaseOverlayActive] = useState(false);
  const [isHoldOverlayActive, setIsHoldOverlayActive] = useState(false);
  const [isUpNextOverlayActive, setIsUpNextOverlayActive] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);
  const [targetQueuer, setTargetQueuer] = useState({});
  const [targetHeader, setTargetHeader] = useState("Waiting");

  // react router dom:
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

  // put on hold:
  const { refetch: initiateHoldQueuer } = useQuery(
    ["hold-queuer-admin", targetQueuer],
    () => {
      if (targetQueuer?.user_id) {
        return axiosInstance.put(`queuer/${targetQueuer?.user_id}`, {
          artist_name: targetQueuer?.artist_name,
          track_title: targetQueuer?.track_title,
          youtube_username: targetQueuer?.youtube_username,
          username: targetQueuer?.youtube_username?.toLowerCase(),
          link: targetQueuer?.link,
          message: targetQueuer?.message,
          on_hold: true,
        });
      }
    },
    {
      enabled: false,
    }
  );

  // Release from hold:
  const { refetch: initiateReleaseQueuer } = useQuery(
    ["release-queuer-admin", targetQueuer],
    () => {
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
    },
    {
      enabled: false,
    }
  );

  // Move Queuer to up next:
  const { refetch: initiateMoveUpNext } = useQuery(
    ["move-queuer-admin", targetQueuer],
    () => {
      if (targetQueuer?.user_id) {
        return axiosInstance.post("active-queuer", {
          user_id: targetQueuer?.user_id,
          artist_name: targetQueuer?.artist_name,
          track_title: targetQueuer?.track_title,
          youtube_username: targetQueuer?.youtube_username,
          username: targetQueuer?.youtube_username?.toLowerCase(),
          link: targetQueuer?.link,
          message: targetQueuer?.message,
        });
      }
    },
    {
      enabled: false,
    }
  );

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
          className={isDeleteOverlayActive ? "overlay active" : "overlay"}
          onClick={() => setIsDeleteOverlayActive(false)}
        >
          <button
            className="manage-btn"
            onClick={() => {
              setIsDeleteOverlayActive(false);
              initiateLeaveQueue();
              window.location.reload();
            }}
          >
            Remove Queuer?
          </button>
        </div>

        {/* hold overlay */}
        <div
          className={isHoldOverlayActive ? "overlay active" : "overlay"}
          onClick={() => setIsHoldOverlayActive(false)}
        >
          <button
            className="manage-btn"
            onClick={() => {
              setIsHoldOverlayActive(false);
              initiateHoldQueuer();
              window.location.reload();
            }}
          >
            Put On Hold?
          </button>
        </div>

        {/* Remove hold overlay */}
        <div
          className={isReleaseOverlayActive ? "overlay active" : "overlay"}
          onClick={() => setIsReleaseOverlayActive(false)}
        >
          <button
            className="manage-btn"
            onClick={() => {
              setIsReleaseOverlayActive(false);
              initiateReleaseQueuer();
              window.location.reload();
            }}
          >
            Release Queuer?
          </button>
        </div>

        {/* Move to up next overlay */}
        <div
          className={isUpNextOverlayActive ? "overlay active" : "overlay"}
          onClick={() => setIsUpNextOverlayActive(false)}
        >
          <button
            className="manage-btn"
            onClick={() => {
              setIsUpNextOverlayActive(false);
              initiateMoveUpNext();
              initiateLeaveQueue();
              window.location.reload();
            }}
          >
            Move to Up Next?
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
            setTargetQueuer={setTargetQueuer}
            setTargetHeader={setTargetHeader}
            setIsDeleteOverlayActive={setIsDeleteOverlayActive}
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
            setTargetQueuer={setTargetQueuer}
            setTargetHeader={setTargetHeader}
            setIsDeleteOverlayActive={setIsDeleteOverlayActive}
            setIsHoldOverlayActive={setIsHoldOverlayActive}
            setIsUpNextOverlayActive={setIsUpNextOverlayActive}
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
            setTargetQueuer={setTargetQueuer}
            setTargetHeader={setTargetHeader}
            setIsDeleteOverlayActive={setIsDeleteOverlayActive}
            setIsReleaseOverlayActive={setIsReleaseOverlayActive}
            setIsUpNextOverlayActive={setIsUpNextOverlayActive}
          />
        )}

        {/* Add new Queuer form */}
        <SubmitForm
          isFormActive={isFormActive}
          setIsFormActive={setIsFormActive}
          isAdmin
        />

        {/* Navigation */}
        <div className="nav-container">
          <button
            onClick={() => {
              setIsFormActive(true);
            }}
          >
            Add Queuer
          </button>
          <button>Queue Settings</button>
          <button>Go Back</button>
        </div>
      </main>
    </section>
  );
};

export default ManageQueue;
