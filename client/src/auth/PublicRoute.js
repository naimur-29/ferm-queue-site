import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const PublicRoute = (props) => {
  const { children } = props;
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/admin", { replace: true, state: { from: location } });
    } else setIsVerified(true);
  }, [auth.isAuthenticated, location, navigate]);

  if (!isVerified) return null;
  return <>{children}</>;
};

export default PublicRoute;
