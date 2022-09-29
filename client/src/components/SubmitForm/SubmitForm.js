import React, { useState } from "react";
import "./SubmitForm.css";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../services/axios";

const SubmitForm = ({ isFormActive, setIsFormActive }) => {
  const [isFile, setIsFile] = useState(false);
  const [isMessageActive, setIsMessageActive] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [userInput, setUserInput] = useState({
    artist_name: "",
    track_title: "",
    youtube_username: "",
    song_link: "",
    message: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("queuer", {
        artist_name: userInput?.artist_name ? userInput.artist_name : "Empty!",
        track_title: userInput?.track_title ? userInput.track_title : "Empty!",
        youtube_username: userInput?.youtube_username,
        username: userInput?.youtube_username.toLowerCase(),
        link: isFile ? userInput?.youtube_username : userInput?.song_link,
        message: userInput?.message ? userInput.message : "Empty!",
      });

      res?.data && localStorage.setItem("userInfo", JSON.stringify(res?.data));
      navigate("/queue");
    } catch (error) {
      setErrMessage("Connection failed!");

      error?.response?.status && setErrMessage(error?.response?.data?.detail);

      error?.response?.status === 422 &&
        setErrMessage("Must include youtube username & link!");
    }
  };

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
            <input
              type="text"
              placeholder="ex: artist1, artist2, ..."
              onChange={(e) =>
                setUserInput({ ...userInput, artist_name: e?.target?.value })
              }
            />
          </div>

          <div className="item">
            <label htmlFor="TrackName">Track title</label>
            <input
              type="text"
              placeholder="ex: song name"
              onChange={(e) =>
                setUserInput({ ...userInput, track_title: e?.target?.value })
              }
            />
          </div>

          <div className="item">
            <label htmlFor="YoutubeUsername">Youtube username</label>
            <input
              type="text"
              placeholder="ex: username"
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  youtube_username: e?.target?.value,
                })
              }
            />
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
                <input
                  type="text"
                  placeholder="ex: one link only"
                  onChange={(e) =>
                    setUserInput({
                      ...userInput,
                      song_link: e?.target?.value,
                    })
                  }
                />
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
              <input
                type="text"
                placeholder="ex: message to ferm"
                onChange={(e) =>
                  setUserInput({
                    ...userInput,
                    message: e?.target?.value,
                  })
                }
              />
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
              <button className="form-btn" onClick={() => handleSubmit()}>
                Join
              </button>
              <button
                className="form-btn"
                onClick={() => {
                  setIsFormActive(false);
                  setErrMessage("");
                }}
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
