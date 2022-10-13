import React, { useEffect } from "react";
import "./QueueSettings.css";
import { FaPowerOff } from "react-icons/fa";
import { useQuery } from "react-query";

// local services:
import axiosInstance from "../../services/axios";

// Importing local components
import BootAnimation from "../../components/BootAnimation/BootAnimation";

const QueueSettings = () => {
  // fetching queue settings:
  const { data: isQueueOn, isLoading: isLoadingQueueOn } = useQuery(
    "queue-on",
    () => {
      return axiosInstance.get("set/isQueueOn");
    }
  );

  const {
    isLoading: isLoadingQueueOnToggle,
    isError: isQueueOnToggleError,
    refetch: initiateQueueOnToggle,
  } = useQuery(
    ["toggle-queue-on", isQueueOn],
    () => {
      return axiosInstance.put("set/isQueueOn", {
        state: isQueueOn?.data?.state === "true" ? "false" : "true",
      });
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    isQueueOnToggleError && alert("Failed to toggle!");
  });

  if (isLoadingQueueOn || isLoadingQueueOnToggle) return <BootAnimation />;

  return (
    <section className="queue-settings-section-container">
      <div className="main-container">
        <div className="queue-on-off">
          Queue
          {isQueueOn?.data?.state === "true" ? " Open -> " : " Closed -> "}
          <div className="btn-container">
            <FaPowerOff
              className={
                isQueueOn?.data?.state === "true"
                  ? "settings-btn on"
                  : "settings-btn off"
              }
              title="Click to toggle"
              onClick={() => {
                initiateQueueOnToggle();
                !isLoadingQueueOnToggle && window.location.reload();
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueueSettings;
