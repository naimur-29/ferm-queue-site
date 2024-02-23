import React, { useState, useEffect } from "react";
import "./QueueSettings.css";
import { useQuery } from "react-query";

// local services:
import axiosInstance from "../../services/axios";

const QueueSettings = () => {
  // states:
  const [settings, setSettings] = useState({});

  // fetching queue settings:
  const { data: queueSettings, isLoading: isLoadingQueueSettings} = useQuery(
    "queue-settings",
    () => axiosInstance.get("set")
  );

  const {
    isLoading: isLoadingQueueOnToggle,
    isError: isQueueOnToggleError,
    refetch: initiateQueueOnToggle,
  } = useQuery(
    ["toggle-queue-on", queueSettings],
    () => {
      const state = settings?.isQueueOn === "true" ? "false" : "true";
      return axiosInstance.put("set/isQueueOn", {
        state
      });
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    isQueueOnToggleError && alert("Failed to toggle!");
  });

  useEffect(() => {
    if (!isLoadingQueueSettings) {
      const res = {};
      for (const ele of queueSettings?.data) res[ele.name] = ele.state;
      setSettings(res);
    }
  // eslint-disable-next-line
  }, [isLoadingQueueSettings]);
 
  return (
    <section className="queue-settings-section-container">
      <div className="main-container">
        <div className="settings-container">
          {/* queue on of settings */}
          <div className="queue-on-off">
            Queue
            {settings?.isQueueOn === "true" ? " Open" : " Closed"}
            <div className="btn-container">
              <button
                className="on-btn"
                disabled={settings?.isQueueOn === "true"}
                onClick={() => {
                  initiateQueueOnToggle();
                  const timeoutRef = window.setTimeout(() => {
                    !isLoadingQueueOnToggle && window.location.reload();
                    window.clearTimeout(timeoutRef);
                  }, 100);
                }}
              >
                Toggle On
              </button>

              <button
                className="off-btn"
                disabled={settings?.isQueueOn === "false"}
                onClick={() => {
                  initiateQueueOnToggle();
                  const timeoutRef = window.setTimeout(() => {
                    !isLoadingQueueOnToggle && window.location.reload();
                    window.clearTimeout(timeoutRef);
                  }, 100);
                }}
              >
                Toggle Off
              </button>
            </div>
          </div>

          {/* set stream link */}
          <div className="set-stream-link-container">
            <label htmlFor="stream link">Stream Link</label>
            <input type="text" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueueSettings;
