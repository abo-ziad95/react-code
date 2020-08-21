import * as React from "react";
import { Route, Switch } from "react-router-dom";
import JobList from "./list";
import Job from "./job";
import Map from "./map";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route component={Map} exact={true} path="/" />
      <Route component={Map} exact={true} path="/map" />
      <Route component={JobList} exact={true} path="/list" />
      <Route component={Job} exact={true} path="/job/:id" />
    </Switch>
  );
};

export default Router;
