import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { SessionContext } from "../context/session";
import { AlertsContext } from "../context/alerts";

interface IProps {
  exact?: boolean;
  component: React.FC;
  path: string;
  groups?: string[];
}

const ProtectedRoute: React.FC<IProps> = props => {
  const session = React.useContext(SessionContext);
  const alerts = React.useContext(AlertsContext);

  if (!session.state) {
    alerts.dispatch({
      type: "ADD_ALERT",
      payload: {
        title: "Error",
        body: "Sorry you must be logged in to view the request page"
      }
    });
    return <Redirect to="/" />;
  }

  if (props.groups) {
    const groups = session.state["cognito:groups"];
    if (!groups) {
      return <Redirect to="/" />;
    }

    const compare = props.groups.some(group => groups.includes(group));
    if (!compare) {
      return <Redirect to="/" />;
    }
  }

  return (
    <Route exact={props.exact} path={props.path} component={props.component} />
  );
};

export default ProtectedRoute;
