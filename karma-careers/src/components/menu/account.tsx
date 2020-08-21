import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import LockIcon from "@material-ui/icons/Lock";
import PinDropRoundedIcon from "@material-ui/icons/PinDropRounded";
import SettingsIcon from "@material-ui/icons/Settings";
import { Auth } from "aws-amplify";
import * as React from "react";
import useHistoryPush from "../../hooks/router/useHistoryPush";

/**
 * React Function Component that renders Material-UI List
 * to server as a account menu
 */

const AccountMenu: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const signOut = async () => {
    await Auth.signOut();
    window.location.href = "/?signout";
  };

  return (
    <List style={{ minWidth: 240, color: "#545454" }}>
      <ListItem button={true} divider={true} onClick={handleClick("/jobs")}>
        <ListItemAvatar>
          <PinDropRoundedIcon />
        </ListItemAvatar>
        <ListItemText primary="Search for Jobs" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/account")}>
        <ListItemAvatar>
          <FolderSharedIcon />
        </ListItemAvatar>
        <ListItemText primary="My Applications" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/account/preferences")}>
        <ListItemAvatar>
          <SettingsIcon />
        </ListItemAvatar>
        <ListItemText primary="Preferences" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={signOut}>
        <ListItemAvatar>
          <LockIcon />
        </ListItemAvatar>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
};

export default AccountMenu;
