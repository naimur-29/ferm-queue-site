import axiosInstance from "../services/axios";

export const setSession = (accessToken, refreshToken = null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const refresh = (refreshToken) => {
  if (refreshToken) {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${refreshToken}`;
  } else {
    localStorage.removeItem("refresh_token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const resetSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete axiosInstance.defaults.headers.common["Authorization"];
};
