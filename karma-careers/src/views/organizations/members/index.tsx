import * as React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../../notFound";
import List from "./list";
import ProtectedRoute from '../../../components/protectedRoute';

const Members: React.FC = () => {
  return (
    <Switch>
      <ProtectedRoute component={List} exact={true} path="/organizations/:id/members" />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Members;
