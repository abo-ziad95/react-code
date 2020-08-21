import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import LockIcon from "@material-ui/icons/Lock";
import ProfileIcon from "@material-ui/icons/Person";
import PinDropRoundedIcon from "@material-ui/icons/PinDropRounded";
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";
import useHistoryPush from "../../../hooks/useHistoryPush";
import parseUrl from "../../../utils/parseUrl";

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar
}));

const Menu: React.FC = () => {
  const { domain, protocal } = parseUrl();
  const theme = useTheme();
  const classes = useStyles();
  const tablet = useMediaQuery(theme.breakpoints.only("sm"));
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const { handleClick } = useHistoryPush();

  return (
    <List>
      {!mobile && <ListItem className={classes.toolbar} />}
      {!tablet && <ListSubheader>Account Menu</ListSubheader>}
      <ListItem button={true} divider={true} onClick={handleClick("/")}>
        <ListItemIcon>
          <FolderSharedIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        button={true}
        divider={true}
        onClick={handleClick(`${protocal}${domain}/map`, true)}
      >
        <ListItemIcon>
          <PinDropRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Explore" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/profile")}>
        <ListItemIcon>
          <ProfileIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
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

export default Menu;
