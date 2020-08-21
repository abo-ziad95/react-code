import { ListItemAvatar } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import BusinessIcon from "@material-ui/icons/Business";
import LockIcon from "@material-ui/icons/Lock";
import PeopleIcon from "@material-ui/icons/People";
import PersonPinCircleIcon from "@material-ui/icons/PersonPinCircle";
import WorkIcon from "@material-ui/icons/Work";
import { Auth } from "aws-amplify";
import * as React from "react";
import { MemberContext } from "../../context/member";
import { SessionContext } from "../../context/session";
import useHistoryPush from "../../hooks/router/useHistoryPush";

const SuperAdminMenu: React.FC = () => {
  const { handleClick } = useHistoryPush();

  const signOut = async () => {
    await Auth.signOut();
    window.location.href = "/?signout";
  };

  return (
    <List style={{ minWidth: 240, color: "#545454" }}>
      <ListItem button={true} divider={true} onClick={handleClick(`/organizations`)}>
        <ListItemAvatar>
          <BusinessIcon />
        </ListItemAvatar>
        <ListItemText primary="Organizations" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/organizations/candidates")}>
        <ListItemAvatar>
          <PersonPinCircleIcon />
        </ListItemAvatar>
        <ListItemText primary="Candidates" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick(`/users`)}>
        <ListItemAvatar>
          <PeopleIcon />
        </ListItemAvatar>
        <ListItemText primary="Users" />
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

const OrganizationOwnerMenu: React.FC = () => {
  const member = React.useContext(MemberContext);
  const { handleClick } = useHistoryPush();

  const signOut = async () => {
    await Auth.signOut();
    window.location.href = "/?signout";
  };

  if (!member.state) {
    return null;
  }

  const organization = member.state.organization;

  return (
    <List style={{ minWidth: 240, color: "#545454" }}>
      <ListItem
        button={true}
        divider={true}
        onClick={handleClick(`/organizations/${organization}/jobs`)}
      >
        <ListItemAvatar>
          <WorkIcon />
        </ListItemAvatar>
        <ListItemText primary="Jobs" />
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleClick("/organizations/candidates")}>
        <ListItemAvatar>
          <PersonPinCircleIcon />
        </ListItemAvatar>
        <ListItemText primary="Candidates" />
      </ListItem>
      <ListItem
        button={true}
        divider={true}
        onClick={handleClick(`/organizations/${organization}/members`)}
      >
        <ListItemAvatar>
          <PeopleIcon />
        </ListItemAvatar>
        <ListItemText primary="Members" />
      </ListItem>
      <ListItem
        button={true}
        divider={true}
        onClick={handleClick(`/organizations/${organization}`)}
      >
        <ListItemAvatar>
          <BusinessIcon />
        </ListItemAvatar>
        <ListItemText primary="Settings" />
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

/**
 * React Function Component that renders Material-UI List
 * to server as a admin menu
 */

const Menu: React.FC = () => {
  const session = React.useContext(SessionContext);
  if (!session.state || !session.state["cognito:groups"]) {
    return null;
  } else if (session.state["cognito:groups"].indexOf("super_admin") !== -1) {
    return <SuperAdminMenu />;
  } else {
    return <OrganizationOwnerMenu />;
  }
};

export default Menu;
