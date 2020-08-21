import * as React from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from '../../../components/protectedRoute';
import NotFound from "../../notFound";
import Applicants from "./applicants";
import Create from "./create";
import Edit from "./edit";
import List from "./list";
import Profile from "./profile";

const Jobs: React.FC = () => {
  return (
    <Switch>
      <ProtectedRoute component={List} exact={true} path="/organizations/:id/jobs" />
      <ProtectedRoute component={Create} exact={true} path="/organizations/:id/jobs/create" />
      <ProtectedRoute component={Profile} exact={true} path="/organizations/:id/jobs/:jobId" />
      <ProtectedRoute component={Applicants} exact={true} path="/organizations/:id/jobs/:jobId/applicants" />
      <ProtectedRoute component={Edit} exact={true} path="/organizations/:id/jobs/:jobId/edit" />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Jobs;
