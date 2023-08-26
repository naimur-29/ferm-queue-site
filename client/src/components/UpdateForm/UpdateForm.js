import React, { useState } from "react";
import "./UpdateForm.css";

// Local Components:
import BootAnimation from "../BootAnimation/BootAnimation";

// Local Services:
import axiosInstance from "../../services/axios";

// Local Hooks:
import { useFocusNext } from "../../hooks/useFocusNext";

// importing icons(react):
import { BsCheck2Circle } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";

const SubmitForm = ({
  isFormActive,
  setIsFormActive,
  setIsUpdateOverlayActive,
  isAdmin,
}) => {
  const [isFile, setIsFile] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [userInput, setUserInput] = useState({
    artist_name: "",
    track_title: "",
    song_link: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Focus on next input field functionality:
  const focusNextRef = useFocusNext();

  // const endPoint = isAdmin ? "/admin-post" : "";

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    try {
      if (user?.user_id) {
        setIsLoading(true);

        const res = await axiosInstance.put(`queuer/${user?.user_id}`, {
          artist_name: userInput?.artist_name
            ? userInput.artist_name
            : user.artist_name,
          track_title: userInput?.track_title
            ? userInput.track_title
            : user.track_title,
          link: isFile ? user.youtube_username : userInput?.song_link,

          youtube_username: user.youtube_username,
          username: user.youtube_username.toLowerCase(),
          message: user.message || "Empty!",
          on_hold: false,
        });

        setErrMessage("");
        setIsFormActive(false);
        setIsUpdateOverlayActive(false);

        window.location.reload();
        res?.data &&
          localStorage.setItem("userInfo", JSON.stringify(res?.data));
      }
    } catch (error) {
      setErrMessage("Connection failed!");

      error?.response?.status && setErrMessage(error?.response?.data?.detail);

      error?.response?.status === 422 &&
        setErrMessage("Must include song link!");
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
            {isAdmin ? "You're in control" : "Update your submission"}
          </h3>

          {errMessage ? <p className="error-message">{errMessage}</p> : <></>}

          <div className="item">
            <label htmlFor="ArtistName">{"New Artist(s) name"}</label>
            <input
              type="text"
              placeholder="ex: artist1, artist2, ..."
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  artist_name: e?.target?.value.trim(),
                })
              }
              ref={focusNextRef}
            />
          </div>

          <div className="item">
            <label htmlFor="TrackName">New Track title</label>
            <input
              type="text"
              placeholder="ex: song name"
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  track_title: e?.target?.value.trim(),
                })
              }
              ref={focusNextRef}
            />
          </div>

          {/* <div className="item">
            <label htmlFor="YoutubeUsername">Username</label>
            <input
              type="text"
              placeholder="ex: username"
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  youtube_username: e?.target?.value.trim(),
                })
              }
              ref={focusNextRef}
            />
          </div> */}

          <div className="item">
            <label htmlFor="ArtistName">New Song link / file</label>
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
                  ref={focusNextRef}
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
                {!isFile ? "File?" : "Link?"}
              </button>
            </div>

            {isFile ? (
              <p className="if-file">Send your file to this mail address!</p>
            ) : (
              <></>
            )}
          </div>

          {/* {isMessageActive ? (
            <div className="item">
              <label htmlFor="Message">Note</label>
              <input
                type="text"
                placeholder="ex: social media handle, other info"
                onChange={(e) =>
                  setUserInput({
                    ...userInput,
                    message: e?.target?.value.trim(),
                  })
                }
                ref={focusNextRef}
              />
            </div>
          ) : (
            <></>
          )} */}

          <div className="config-btn-container">
            {/* <button
              className="form-btn"
              onClick={() => setIsMessageActive(!isMessageActive)}
            >
              {isMessageActive ? "Remove Note" : "Add Note (optional)"}
            </button> */}

            <div className="submit-btn-container">
              <button className="form-btn" onClick={() => handleSubmit()}>
                {isAdmin ? "Add" : "Submit"}
                <BsCheck2Circle />
              </button>
              <button
                className="form-btn"
                onClick={() => {
                  setIsFormActive(false);
                  setIsUpdateOverlayActive(false);
                  setErrMessage("");
                  setIsFile(false);
                }}
              >
                Cancel
                <MdOutlineCancel />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitForm;
