import React, { useEffect, useRef, useState } from "react";
import "./Admin.css";

import axiosInstance from "../../services/axios";

const Admin = () => {
  const [queue, setQueue] = useState([]);
  const [onHoldQueue, setOnHoldQueue] = useState([]);

  const isMounted = useRef(false);

  useEffect(() => {
    const getQueue = async () => {
      if (isMounted.current) return;

      try {
        const resQueue = await axiosInstance.get("queuer/queue/admin");
        resQueue?.data.length && setQueue(resQueue.data);
      } catch (error) {}

      try {
        const resOnHoldQueue = await axiosInstance.get("queuer/on-hold/admin");
        resOnHoldQueue?.data.length && setOnHoldQueue(resOnHoldQueue.data);
      } catch (error) {}
    };

    getQueue();
    isMounted.current = true;
  }, [onHoldQueue]);

  return (
    <div>
      Admin
      <h2>Queue:</h2>
      {queue.length ? (
        queue.map((item, ind) => <p key={ind}>{item?.youtube_username}</p>)
      ) : (
        <p>Empty!</p>
      )}
      <h2>On Hold:</h2>
      {onHoldQueue.length ? (
        onHoldQueue.map((item, ind) => (
          <p key={ind}>
            {item?.youtube_username}
            <br />
            {item?.user_id}
          </p>
        ))
      ) : (
        <p>Empty!</p>
      )}
    </div>
  );
};

export default Admin;
