import * as React from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "../../../components/protectedRoute";
import NotFound from "../../notFound";
import Search from "./search";

const Candidates: React.FC = () => {
  return (
    <Switch>
      <ProtectedRoute component={Search} exact={true} path="/organizations/candidates" />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Candidates;
