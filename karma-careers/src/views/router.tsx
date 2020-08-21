import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Account from "./account";
import Homepage from "./homepage";
import Jobs from "./jobs";
import NotFound from "./notFound";
import Organizations from "./organizations";
import Candidates from "./organizations/candidates";
import Users from "./users";
import Authentication from "./users/authentication";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route component={Authentication} path="/login" />
      <Route component={Homepage} exact={true} path="/" />
      <Route component={Account} path="/account" />
      <Route component={Authentication} path="/login" />
      <Route component={Candidates} exact={true} path="/candidates" />
      <Route component={Jobs} path="/jobs" />
      <Route component={Organizations} path="/organizations" />
      <Route component={Users} path="/users" />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Router;
