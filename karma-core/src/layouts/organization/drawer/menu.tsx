import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import BusinessIcon from "@material-ui/icons/Business";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import LockIcon from "@material-ui/icons/Lock";
import PeopleIcon from "@material-ui/icons/People";
import PersonPinCircleIcon from "@material-ui/icons/PersonPinCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import WorkIcon from "@material-ui/icons/Work";
import React from "react";
import { DrawerContext } from "../../../context/drawer";
import useHistoryPush from "../../../hooks/useHistoryPush";

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar
}));

const MainMenu: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();
  const tablet = useMediaQuery(theme.breakpoints.only("sm"));
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const { handleClick } = useHistoryPush();
  const drawer = React.useContext(DrawerContext);
  const open = drawer.state === "main";

  const closeDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "main" });
  };

  return (
    <List>
      {!mobile && <ListItem className={classes.toolbar} />}
      {!tablet && <ListSubheader>Main</ListSubheader>}
      {tablet && (
        <ListItem button={true} onClick={closeDrawer} divider={true}>
          <ListItemIcon>
            <React.Fragment>
              {open && <ArrowLeft />}
              {!open && <ArrowRight />}
            </React.Fragment>
          </ListItemIcon>
        </ListItem>
      )}
      <ListItem button={true} divider={true} onClick={handleClick(`/`)}>
        <ListItemIcon>
          <BusinessIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick(`/jobs`)}>
        <ListItemIcon>
          <WorkIcon />
        </ListItemIcon>
        <ListItemText primary="Jobs" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/interviews")}>
        <ListItemIcon>
          <CalendarIcon />
        </ListItemIcon>
        <ListItemText primary="Interviews" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/candidates")}>
        <ListItemIcon>
          <PersonPinCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Candidates" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick(`/members`)}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Members" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/settings")}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/logout")}>
        <ListItemIcon>
          <LockIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
};

export default MainMenu;
