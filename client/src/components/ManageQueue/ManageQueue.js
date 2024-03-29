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
  const [isNavigationActive, setIsNavigationActive] = useState(false);
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
  } = useQuery("on-hold-queue-admin", fetchOnHoldQueue, {
    cacheTime: 0,
  });

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
  const { isLoading: isLoadingPutCurrentOnHold, refetch: initiateHoldQueuer } =
    useQuery(
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
  const { isLoading: isLoadingReleaseCurrent, refetch: initiateReleaseQueuer } =
    useQuery(
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
  const initiateMoveUpNext = async () => {
    if (targetQueuer?.user_id) {
      try {
        await axiosInstance.get(`move/${targetQueuer?.user_id}`);

        window.location.reload();
      } catch (error) {
        alert("Connection failed!\nPlease try again!");
        error?.response?.status && alert(error?.response?.data?.detail);
      }
    }
  };

  // useEffect hooks:
  useEffect(() => {
    document.title = "Manage Queue";    
    
    if (!isLoadingQueue && !isLoadingOnHoldQueue && !isLoadingActiveQueue) {
      setOnHoldQueueState(new Array(onHoldQueue?.length).fill(false));
      setQueueState(new Array(queue?.length).fill(false));
      setActiveQueueState(new Array(activeQueue?.length).fill(false));

      // // set document title:
      // document.title = `UAR Queue(${
      //   activeQueue.data.length + queue.data.length + onHoldQueue.data.length
      // })`;
      // console.log("LENGTH:", queue.data.length);
    }
  }, [
    isLoadingQueue,
    isLoadingOnHoldQueue,
    isLoadingActiveQueue,
    queue,
    onHoldQueue,
    activeQueue,
  ]);

  return (
    <section className="manage-queue-section-container">
      <main className="main-container">
        <h1 className="title">
          <span onClick={() => setIsNavigationActive(true)}>
            Upcoming Artist Radio
          </span>
        </h1>

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
              !isLoadingRemoveCurrent && window.location.reload();
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
              !isLoadingPutCurrentOnHold && window.location.reload();
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
              !isLoadingReleaseCurrent && window.location.reload();
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
            }}
          >
            Move to Up Next?
          </button>
        </div>

        {/* queue section */}
        {/* Up next queuers */}
        {isLoadingActiveQueue || isLoadingRemoveCurrent ? (
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
        {isLoadingQueue ||
        isLoadingRemoveCurrent ||
        isLoadingPutCurrentOnHold ? (
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
        {isLoadingOnHoldQueue ||
        isLoadingRemoveCurrent ||
        isLoadingReleaseCurrent ? (
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
        <div
          className={
            isNavigationActive ? "nav-container active" : "nav-container"
          }
        >
          <button
            className="btn"
            onClick={() => {
              setIsNavigationActive(false);
              setIsFormActive(true);
            }}
          >
            Add Queuer
          </button>

          <button className="btn" onClick={() => setIsNavigationActive(false)}>
            Go Back
          </button>

          <button
            className="btn"
            onClick={() => {
              setIsNavigationActive(false);
              navigate("/access");
            }}
          >
            Return Admin Page
          </button>
        </div>
      </main>
    </section>
  );
};

export default ManageQueue;
