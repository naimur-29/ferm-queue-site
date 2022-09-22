import React, { useEffect, useRef, useState } from "react";
import "./Queue.css";

import axiosInstance from "../../services/axios";

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [onHoldQueue, setOnHoldQueue] = useState([]);

  const isMounted = useRef(false);

  useEffect(() => {
    const getQueue = async () => {
      if (isMounted.current) return;

      try {
        const resQueue = await axiosInstance.get("queuer/queue");
        resQueue?.data.length && setQueue(resQueue.data);
      } catch (error) {}

      try {
        const resOnHoldQueue = await axiosInstance.get("queuer/on-hold");
        resOnHoldQueue?.data.length && setOnHoldQueue(resOnHoldQueue.data);
      } catch (error) {}
    };

    getQueue();
    isMounted.current = true;
  }, [onHoldQueue]);

  return (
    <div>
      <h2>Queue:</h2>
      {queue.length ? (
        queue.map((item, ind) => <p key={ind}>{item?.youtube_username}</p>)
      ) : (
        <p>Empty!</p>
      )}

      <h2>On Hold:</h2>
      {onHoldQueue.length ? (
        onHoldQueue.map((item, ind) => (
          <p key={ind}>{item?.youtube_username}</p>
        ))
      ) : (
        <p>Empty!</p>
      )}
    </div>
  );
};

export default Queue;
