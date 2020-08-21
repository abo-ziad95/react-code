import * as React from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "../../components/protectedRoute";
import NotFound from "../notFound";
import Candidates from './candidates/index';
import Create from "./create";
import Edit from "./edit";
import Jobs from './jobs';
import List from "./list";
import Members from "./members";
import Profile from "./profile";

const Organizations: React.FC = () => {
  return (
    <Switch>
      <ProtectedRoute component={List} exact={true} path="/organizations" />
      <ProtectedRoute component={Create} exact={true} path="/organizations/create" />
      <ProtectedRoute component={Candidates} exact={false} path="/organizations/candidates" />
      <ProtectedRoute component={Members} exact={false} path="/organizations/:id/members" />
      <ProtectedRoute component={Jobs} exact={false} path="/organizations/:id/jobs" />
      <ProtectedRoute component={Edit} exact={true} path="/organizations/:id/edit" />
      <ProtectedRoute component={Profile} exact={true} path="/organizations/:id" />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Organizations;
