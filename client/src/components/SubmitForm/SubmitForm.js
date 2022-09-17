import React, { useState } from "react";
import "./SubmitForm.css";

const SubmitForm = ({ isFormActive, setIsFormActive }) => {
  const [isFile, setIsFile] = useState(false);
  const [isMessageActive, setIsMessageActive] = useState(false);

  return (
    <div
      className={
        isFormActive ? "submit-form-container active" : "submit-form-container"
      }
    >
      <div className="form-container">
        <h3 className="title">Submit Your Song & Join The Queue</h3>
        <div className="item">
          <label htmlFor="ArtistName">Artist Name:</label>
          <input type="text" />
        </div>
        <div className="item">
          <label htmlFor="ArtistName">Track Title:</label>
          <input type="text" />
        </div>
        <div className="item">
          <label htmlFor="ArtistName">Youtube Username:</label>
          <input type="text" />
        </div>

        {isMessageActive ? (
          <div className="item">
            <label htmlFor="ArtistName">Message:</label>
            <input type="text" />
          </div>
        ) : (
          <></>
        )}

        {isFile ? (
          <div className="item">
            <p>Email: submit.realfermaudio.com</p>
          </div>
        ) : (
          <div className="item">
            <label htmlFor="ArtistName">Link:</label>
            <input type="text" />
          </div>
        )}

        <div className="config-btn-container">
          <button onClick={() => setIsFile(true)}>File</button>
          <button onClick={() => setIsFile(false)}>Link</button>
          <button onClick={() => setIsMessageActive(!isMessageActive)}>
            Add a message
          </button>
        </div>

        <div className="submit-btn-container">
          <button>Submit</button>
          <button onClick={() => setIsFormActive(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;
