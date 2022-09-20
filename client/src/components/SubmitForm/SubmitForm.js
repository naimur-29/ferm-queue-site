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
        <h3 className="title">Enter your submission</h3>
        <div className="item">
          <label htmlFor="ArtistName">{"Artist(s) Name"}</label>
          <input type="text" placeholder="ex: artist1, artist2, ..." />
        </div>
        <div className="item">
          <label htmlFor="TrackName">Track Title</label>
          <input type="text" placeholder="ex: song name" />
        </div>
        <div className="item">
          <label htmlFor="YoutubeUsername">Youtube Username</label>
          <input type="text" placeholder="ex: username" />
        </div>

        <div className="item">
          <label htmlFor="ArtistName">
            <button onClick={() => setIsFile(true)}>File</button>
            <button onClick={() => setIsFile(false)}>Link</button>
          </label>
          {isFile ? (
            <>
              <p className="if-file">Send your file to this mail address!</p>
              <input
                type="text"
                value="submit@realfermaudio.com"
                disabled
                style={{ cursor: "pointer" }}
              />
            </>
          ) : (
            <input type="text" placeholder="ex: only one link" />
          )}
        </div>

        {isMessageActive ? (
          <div className="item">
            <label htmlFor="Message">Message</label>
            <input type="text" placeholder="ex: message to ferm" />
          </div>
        ) : (
          <></>
        )}

        <div className="config-btn-container">
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
