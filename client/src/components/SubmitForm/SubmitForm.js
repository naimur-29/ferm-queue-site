import React, { useState } from "react";
import "./SubmitForm.css";

const SubmitForm = ({ isFormActive, setIsFormActive }) => {
  const [isFile, setIsFile] = useState(false);
  const [isMessageActive, setIsMessageActive] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  return (
    <div
      className={
        isFormActive ? "submit-form-container active" : "submit-form-container"
      }
    >
      <div
        className={isFormActive ? "outer-container active" : "outer-container"}
      >
        <div className="form-container">
          <h3 className="title">Enter your submission</h3>

          {errMessage ? <p className="error-message">{errMessage}</p> : <></>}

          <div className="item">
            <label htmlFor="ArtistName">{"Artist(s) name"}</label>
            <input type="text" placeholder="ex: artist1, artist2, ..." />
          </div>
          <div className="item">
            <label htmlFor="TrackName">Track title</label>
            <input type="text" placeholder="ex: song name" />
          </div>
          <div className="item">
            <label htmlFor="YoutubeUsername">Youtube username</label>
            <input type="text" placeholder="ex: username" />
          </div>

          <div className="item">
            <label htmlFor="ArtistName">Song link / file</label>
            <div className="input-container">
              {isFile ? (
                <>
                  <input
                    type="text"
                    value="submit@realfermaudio.com"
                    disabled
                  />
                </>
              ) : (
                <input type="text" placeholder="ex: one link only" />
              )}

              <button
                className="submission-type-btn"
                onClick={() => {
                  setIsFile(!isFile);
                  if (!isFile) {
                    navigator.clipboard.writeText("submit@realfermaudio.com");
                    setTimeout(() => {
                      alert("Copied email address to clipboard!");
                    }, 100);
                  }
                }}
              >
                {!isFile ? "File" : "Link"}
              </button>
            </div>

            {isFile ? (
              <p className="if-file">Send your file to this mail address!</p>
            ) : (
              <></>
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
            <button
              className="form-btn"
              onClick={() => setIsMessageActive(!isMessageActive)}
            >
              {isMessageActive ? "Remove message" : "Add message"}
            </button>

            <div className="submit-btn-container">
              <button className="form-btn">Submit</button>
              <button
                className="form-btn"
                onClick={() => setIsFormActive(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;
