import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Application from "./application";
import Dashboard from "./dashboard";
import Profile from "./profile";
import Settings from "./settings";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route component={Dashboard} exact={true} path="/" />
      <Route component={Profile} exact={true} path="/profile" />
      <Route component={Settings} exact={true} path="/settings" />
      <Route
        component={Application}
        exact={true}
        path="/application/:id/status"
      />
    </Switch>
  );
};

export default Router;
