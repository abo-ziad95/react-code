import Drawer from "@material-ui/core/Drawer";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { Helmet } from "react-helmet";
import config from "../../config";
import { DrawerContext } from "../../context/drawer";
import Alerts from "../alerts";
import Appbar from "../appbar";

const drawerWidth = 340;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: 1301
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
 * React Function Component that renders layout for mobile views
 * @param props React Function Component parameters
 */

const Mobile: React.FC<IProps> = props => {
  const classes = useStyles();
  const drawer = React.useContext(DrawerContext);

  const toggleDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER" });
  };

  return (
    <div className={classes.root}>
      <Helmet>{props.title && <title>{config.title + " | " + props.title}</title>}</Helmet>
      <Appbar position="fixed" className={classes.appBar} />
      <Alerts />
      <Drawer
        classes={{ paper: classes.drawerPaper }}
        className={classes.drawer}
        onClose={toggleDrawer}
        open={drawer.state === "main"}
        variant="temporary"
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

export default Mobile;
