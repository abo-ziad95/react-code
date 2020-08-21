import Drawer from "@material-ui/core/Drawer";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { Helmet } from "react-helmet";
import config from "../../config";
import Alerts from "../alerts";
import Appbar from "../appbar";

const drawerWidth = 340;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1
  },
  toolbar: theme.mixins.toolbar
}));

interface IProps {
  menuComponent: React.ReactNode;
  title?: string;
}

/**
 * React Function Component that renders layout for desktop views
 * @param props React Function Component parameters
 */

const Desktop: React.FC<IProps> = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Helmet>{props.title && <title>{config.title + " | " + props.title}</title>}</Helmet>
      <Appbar position="fixed" className={classes.appBar} />
      <Alerts />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        {props.menuComponent}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Desktop;
