import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Alerts from "../../components/alerts";
import Notifications from "../../components/notifications";
import Drawer from "./drawer";
import Header from "./header";

const useStyles = makeStyles(theme => ({
  content: { flexGrow: 1 },
  root: { display: "flex" },
  toolbar: theme.mixins.toolbar
}));

interface IProps {
  menu?: React.ReactNode;
}

/**
 * React Function Component that renders Global Layout
 * @param props React Function Component parameters
 */

const Search: React.FC<IProps> = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <Drawer menu={props.menu} />
      <Alerts />
      <Notifications />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Search;
