import * as React from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "../../components/protectedRoute";
import NotFound from "../notFound";
import Dashboard from "./dashboard";
import Preferences from "./preferences";

const Account: React.FC = () => {
  return (
    <Switch>
      <ProtectedRoute component={Dashboard} exact={true} path="/account" />
      <ProtectedRoute component={Preferences} exact={true} path="/account/preferences" />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Account;
