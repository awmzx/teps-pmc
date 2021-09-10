import React from "react";
import { Route, Redirect } from "react-router-dom";

import { getToken } from "../CommonUniversal/auth/localStorage";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = getToken();
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Redirect to="/home" /> : <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
