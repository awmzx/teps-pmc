import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Splash from "../CommonUniversal/Splash";
import NotFound from "../CommonUniversal/NotFound";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import Dashboard from "../Components/Dashboard/Dashboard";
import login from "../Components/Login/Login";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Splash} />
        <PublicRoute path="/login" component={login} />
        <PrivateRoute path="/home" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};
export default AppRouter;
