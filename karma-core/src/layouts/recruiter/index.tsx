import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import React from "react";
import Alerts from "../../components/alerts";
import DevAuthentication from "../../components/devAuthentication";
import Notifications from "../../components/notifications";
import { UserContext } from "../../context/user";
import parseUrl from "../../utils/parseUrl";
import Drawer from "./drawer";
import Header from "./header";

const useStyles = makeStyles(theme => ({
  content: { flexGrow: 1 },
  root: { display: "flex" },
  toolbar: theme.mixins.toolbar
}));

/**
 * React Function Component that renders Global Layout
 * @param props React Function Component parameters
 */

const Recruiter: React.FC = props => {
  const { protocal, domain } = parseUrl();
  const classes = useStyles();
  const user = React.useContext(UserContext);

  if (process.env.NODE_ENV === "development") {
    if (_.isNull(user.state)) {
      return <DevAuthentication />;
    }

    const devGroups = user.state && user.state.identity["cognito:groups"];
    if (user.state && !_.includes(devGroups, "recruiter")) {
      window.confirm("Your current user session is not a recruiter");
      return <DevAuthentication />;
    }
  }

  if (_.isNull(user.state)) {
    window.location.href = `${protocal}auth.${domain}`;
    return null;
  }

  const groups = user.state && user.state.identity["cognito:groups"];
  if (user.state && !_.includes(groups, "recruiter")) {
    window.location.href = `${protocal}auth.${domain}`;
    return null;
  }

  return (
    <div className={classes.root}>
      <Header />
      <Drawer />
      <Alerts />
      <Notifications />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Recruiter;
