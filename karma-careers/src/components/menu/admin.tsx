import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Auth } from "aws-amplify";
import * as React from "react";
import useHistoryPush from "../../hooks/router/useHistoryPush";

/**
 * React Function Component that renders Material-UI List
 * to server as a admin menu
 */

const AdminMenu: React.FC = () => {
  const { handleClick, push } = useHistoryPush();

  const signOut = async () => {
    Auth.signOut();
    push("/?signout");
  };

  return (
    <List style={{ minWidth: 240, color: "black" }}>
      <ListItem button={true} divider={true} onClick={handleClick("/candidates")}>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/organizations")}>
        <ListItemText primary="Organizations" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/jobs")}>
        <ListItemText primary="Jobs" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/users")}>
        <ListItemText primary="Users" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={signOut}>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
};

export default AdminMenu;
