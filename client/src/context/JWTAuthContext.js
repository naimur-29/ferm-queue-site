import { createContext, useReducer, useEffect, useRef } from "react";

import { validateToken } from "../utils/jwt";
import { setSession, resetSession } from "../utils/session";
import axiosInstance from "../services/axios";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  admin: null,
};

export const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, admin } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      admin,
    };
  },

  LOGIN: (state, action) => {
    const { admin } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      admin,
    };
  },

  LOGOUT: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken && validateToken(accessToken)) {
          setSession(accessToken);

          const response = await axiosInstance.get("auth/admin/test-token");
          const { data: admin } = response;
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              admin,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              admin: null,
            },
          });
        }
      } catch (error) {}
    };

    initialize();
    isMounted.current = true;
  }, []);

  const getTokens = async (emailOrUsername, password) => {
    const formData = new FormData();
    formData.append("username", emailOrUsername);
    formData.append("password", password);
    try {
      const response = await axiosInstance.post("auth/admin", formData);
      setSession(response.data.access_token, response.data.refresh_token);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await getTokens(email, password);
      const response = await axiosInstance.get("auth/admin/test-token");
      const { data: admin } = response;
      dispatch({
        type: "LOGIN",
        payload: {
          admin,
        },
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = () => {
    resetSession();
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
