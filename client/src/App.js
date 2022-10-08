import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";

import { AuthConsumer, AuthProvider } from "./context/JWTAuthContext";

import Home from "./pages/Home/Home";
import Queue from "./pages/Queue/Queue";
import Admin from "./pages/Admin/Admin";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import BootAnimation from "./components/BootAnimation/BootAnimation";
import ManageQueue from "./components/ManageQueue/ManageQueue";
import QueueSettings from "./components/QueueSettings/QueueSettings";
import Authenticated from "./auth/Authenticated";
import PublicRoute from "./auth/PublicRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AuthConsumer>
            {(auth) =>
              !auth.isInitialized ? (
                <BootAnimation />
              ) : (
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/queue" element={<Queue />} />
                  <Route
                    path="/access"
                    element={
                      <PublicRoute>
                        <AdminLogin />
                      </PublicRoute>
                    }
                  />
                  {/* Admin Panel Routes */}
                  <Route
                    path="/admin"
                    element={
                      <Authenticated>
                        <Admin />
                      </Authenticated>
                    }
                  />
                  <Route
                    path="/access-queue"
                    element={
                      <Authenticated>
                        <ManageQueue />
                      </Authenticated>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Authenticated>
                        <QueueSettings />
                      </Authenticated>
                    }
                  />

                  {/* Error Routes */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              )
            }
          </AuthConsumer>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
