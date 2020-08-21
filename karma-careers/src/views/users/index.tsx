import * as React from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "../../components/protectedRoute";
import NotFound from "../notFound";
import List from "./list";
import Profile from "./profile";

const Users: React.FC = () => {
  return (
    <Switch>
      <ProtectedRoute component={List} exact={true} groups={["super_admin"]} path="/users" />
      <ProtectedRoute component={Profile} exact={true} path="/users/:id" />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Users;
