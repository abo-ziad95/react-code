import Drawer from "@material-ui/core/Drawer";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import useReactRouter from "use-react-router";
import { DrawerContext } from "../../../context/drawer";
import Logo from "./logo";

const useStyles = makeStyles(theme => ({
  drawer: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    }),
    whiteSpace: "nowrap"
  },
  drawerPaper: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  tabletDrawerClosed: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    }),
    whiteSpace: "nowrap",
    width: theme.spacing(7) + 1
  },
  tabletDrawerPaperClosed: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    }),
    width: theme.spacing(7) + 1
  },
  tabletDrawerPaperOpen: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  }
}));

interface IProps {
  menu?: React.ReactNode;
}

const MuiDrawer: React.FC<IProps> = props => {
  const drawer = React.useContext(DrawerContext);
  const { location } = useReactRouter();
  const homepage = location.pathname === "/"
  const contact = location.pathname === "/contact"
  const classes = useStyles();
  const theme = useTheme();
  const open = drawer.state === "main";
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));
  const tablet = useMediaQuery(theme.breakpoints.only("sm"));
  const variant = mobile || homepage || contact ? "temporary" : "permanent";

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
      <Logo />
      {props.menu}
    </Drawer>
  );
};

export default MuiDrawer;
