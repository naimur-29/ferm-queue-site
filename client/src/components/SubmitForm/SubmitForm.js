import React, { useState } from "react";
import "./SubmitForm.css";
import { useNavigate } from "react-router-dom";

// Local Components:
import BootAnimation from "../../components/BootAnimation/BootAnimation";

// Local Services:
import axiosInstance from "../../services/axios";

const SubmitForm = ({ isFormActive, setIsFormActive, isAdmin }) => {
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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const endPoint = isAdmin ? "/admin-post" : "";

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.post(`queuer${endPoint}`, {
        artist_name: userInput?.artist_name ? userInput.artist_name : "Empty!",
        track_title: userInput?.track_title ? userInput.track_title : "Empty!",
        youtube_username: userInput?.youtube_username,
        username: userInput?.youtube_username.toLowerCase(),
        link: isFile ? userInput?.youtube_username : userInput?.song_link,
        message: userInput?.message ? userInput.message : "Empty!",
      });

      setErrMessage("");
      setIsFormActive(false);

      if (isAdmin) {
        window.location.reload();
      } else {
        res?.data &&
          localStorage.setItem("userInfo", JSON.stringify(res?.data));
        navigate("/queue");
      }
    } catch (error) {
      setErrMessage("Connection failed!");

      error?.response?.status && setErrMessage(error?.response?.data?.detail);

      error?.response?.status === 422 &&
        setErrMessage("Must include youtube username & link!");
    }

    setIsLoading(false);
  };

  if (isLoading) return <BootAnimation />;

  return (
    <section
      className={
        isAdmin
          ? isFormActive
            ? "submit-form-container active admin"
            : "submit-form-container admin"
          : isFormActive
          ? "submit-form-container active"
          : "submit-form-container"
      }
    >
      <div
        className={isFormActive ? "outer-container active" : "outer-container"}
      >
        <div className="form-container">
          <h3 className="title">
            {isAdmin ? "You're in control" : "Enter your submission"}
          </h3>

          {errMessage ? <p className="error-message">{errMessage}</p> : <></>}

          <div className="item">
            <label htmlFor="ArtistName">{"Artist(s) name"}</label>
            <input
              type="text"
              placeholder="ex: artist1, artist2, ..."
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  artist_name: e?.target?.value.trim(),
                })
              }
            />
          </div>

          <div className="item">
            <label htmlFor="TrackName">Track title</label>
            <input
              type="text"
              placeholder="ex: song name"
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  track_title: e?.target?.value.trim(),
                })
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
                  youtube_username: e?.target?.value.trim(),
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
                      song_link: e?.target?.value.trim(),
                    })
                  }
                />
              )}

              <button
                className="submission-type-btn"
                onClick={() => {
                  setIsFile(!isFile);

                  if (!isFile && !isAdmin) {
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
                    message: e?.target?.value.trim(),
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
                {isAdmin ? "Add" : "Join"}
              </button>
              <button
                className="form-btn"
                onClick={() => {
                  setIsFormActive(false);
                  setErrMessage("");
                  setIsFile(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitForm;
