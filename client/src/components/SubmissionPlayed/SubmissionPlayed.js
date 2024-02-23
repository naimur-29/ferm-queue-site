import React, { useState, useEffect } from "react";
import "./SubmissionPlayed.css";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

// local services:
import axiosInstance from "../../services/axios";

// local components:
import ManageQueueContainer from "../../components/ManageQueueContainer/ManageQueueContainer";
import ManageQueueLoading from "../../components/ManageQueueContainer/ManageQueueLoading";

// query functions:
const fetchQueue = () => {
  return axiosInstance.get("submission-played/queue/admin");
};

const SubmissionPlayed = () => {
  const [targetQueuer, setTargetQueuer] = useState({});
  const [targetHeader, setTargetHeader] = useState("Waiting");

  // react router dom:
  const navigate = useNavigate();

  // queue states
  const [queueState, setQueueState] = useState([]);

  // fetching submissions played:
  const {
    isLoading: isLoadingQueue,
    data: queue,
    isError: isQueueError,
  } = useQuery("submission-played-admin", fetchQueue);

  // useEffect hooks:
  useEffect(() => {
    document.title = "Submissions Played";    
    
    if (!isLoadingQueue) {
      setQueueState(new Array(queue?.length).fill(false));

      // // set document title:
      // document.title = `UAR Queue(${
      //   activeQueue.data.length + queue.data.length + onHoldQueue.data.length
      // })`;
      // console.log("LENGTH:", queue.data.length);
    }
  }, [
    isLoadingQueue,
    queue,
  ]);

  return (
    <section className="manage-queue-section-container">
      <main className="main-container">
        <h1 className="title">
          <span onClick={() => navigate("/admin")}>
            Submissions Played
          </span>
        </h1>

        {/* queue section */}
        {/* Submissions Played */}
        {isLoadingQueue ?
          <ManageQueueLoading heading={""} opacity={1} />
          : (
          <ManageQueueContainer
            queue={isQueueError ? {} : queue}
            queueState={queueState}
            setQueueState={setQueueState}
            heading={""}
            opacity={1}
            setTargetQueuer={setTargetQueuer}
            setTargetHeader={setTargetHeader}
          />
        )}
      </main>
    </section>
  );
};

export default SubmissionPlayed;
