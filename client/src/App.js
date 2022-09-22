import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { AuthConsumer, AuthProvider } from "./context/JWTAuthContext";

import Home from "./pages/Home/Home";
import Queue from "./pages/Queue/Queue";
import Admin from "./pages/Admin/Admin";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import BootAnimation from "./components/BootAnimation/BootAnimation";
import Authenticated from "./auth/Authenticated";
import PublicRoute from "./auth/PublicRoute";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <AuthConsumer>
            {(auth) =>
              !auth.isInitialized ? (
                <BootAnimation />
              ) : (
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <Home />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/queue"
                    element={
                      <PublicRoute>
                        <Queue />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/access"
                    element={
                      <PublicRoute>
                        <AdminLogin />
                      </PublicRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <Authenticated>
                        <Admin />
                      </Authenticated>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              )
            }
          </AuthConsumer>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
