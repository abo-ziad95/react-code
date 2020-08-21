import * as React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../notFound";
import Search from "./search";

const Jobs: React.FC = () => {
  return (
    <Switch>
      <Route component={Search} exact={true} path="/jobs" />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Jobs;
