import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import * as React from "react";
import useHistoryPush from "../../hooks/router/useHistoryPush";

/**
 * React Function Component that renders Material-UI List
 * to server as a standard menu
 */

const StandardMenu: React.FC = () => {
  const { handleClick } = useHistoryPush();
  return (
    <List style={{ minWidth: 240, color: "black" }}>
      <ListItem button={true} divider={true} onClick={handleClick("/sign-up")}>
        <ListItemText primary="Create an Account" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/sign-in")}>
        <ListItemText primary="Login" />
      </ListItem>
    </List>
  );
};

export default StandardMenu;
