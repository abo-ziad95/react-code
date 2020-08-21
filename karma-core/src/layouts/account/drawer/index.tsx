import Drawer from "@material-ui/core/Drawer";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import { DrawerContext } from "../../../context/drawer";
import Menu from "./menu";

const useStyles = makeStyles(theme => ({
  drawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  tabletDrawerClosed: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    width: theme.spacing(7) + 1,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  drawerPaper: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  tabletDrawerPaperOpen: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  tabletDrawerPaperClosed: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    }),
    width: theme.spacing(7) + 1
  }
}));

const MuiDrawer: React.FC = () => {
  const drawer = React.useContext(DrawerContext);
  const classes = useStyles();
  const theme = useTheme();
  const open = drawer.state === "main";
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));
  const tablet = useMediaQuery(theme.breakpoints.only("sm"));
  const variant = mobile ? "temporary" : "permanent";

  const closeDrawer = () => {
    drawer.dispatch({ type: "CLOSE_DRAWER" });
  };

  let drawerClass = classes.drawer;
  let paperClass = classes.drawerPaper;

  if (tablet) {
    drawerClass = open ? classes.drawer : classes.tabletDrawerClosed;
    paperClass = open ? classes.tabletDrawerPaperOpen : classes.tabletDrawerPaperClosed;
  }

  return (
    <Drawer
      classes={{ paper: paperClass }}
      className={drawerClass}
      onClose={closeDrawer}
      open={open}
      variant={variant}
    >
      <Menu />
    </Drawer>
  );
};

export default MuiDrawer;
