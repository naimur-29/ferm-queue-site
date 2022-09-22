import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const Authenticated = (props) => {
  const { children } = props;
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/access", { replace: true, state: { from: location } });
    } else setIsVerified(true);
  }, [auth.isAuthenticated, location, navigate]);

  if (!isVerified) return null;
  return <>{children}</>;
};

export default Authenticated;
