import { Menu, MenuItem } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";
import _ from "lodash";
import React from "react";
import { DrawerContext } from "../../../context/drawer";
import { UserContext } from "../../../context/user";
import useHistoryPush from "../../../hooks/useHistoryPush";
import parseUrl from "../../../utils/parseUrl";

const useStyles = makeStyles({
  avatar: {
    background: "transparent",
    border: "#fff solid 2px",
    color: "#fff",
    height: 30,
    margin: "auto 12px auto 0",
    width: 30
  },
  menu: { alignItems: "center", display: "flex" }
});

/**
 * React Function Component that renders Header
 */

const ProfileMenu: React.FC = () => {
  const { protocal, domain } = parseUrl();
  const [anchorEl, setAnchorEl] = React.useState();
  const { dispatch } = React.useContext(UserContext);
  const classes = useStyles();
  const { handleClick } = useHistoryPush();
  const drawer = React.useContext(DrawerContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));
  const tablet = useMediaQuery(theme.breakpoints.only("sm"));
  const user = React.useContext(UserContext);
  let givenName;
  let givenNameInitial;
  let fullName;
  let dashboardUrl = `${protocal}account.${domain}`;

  if (user.state && user.state.identity) {
    givenName = user.state.identity.given_name;
    fullName = user.state.identity.full_name;
  }

  if (user.state && user.state.identity.organization) {
    dashboardUrl = `${protocal}organization.${domain}`;
  }

  const groups = user.state && user.state.identity["cognito:groups"];
  if (user.state && _.includes(groups, "recruiter")) {
    dashboardUrl = `${protocal}recruiter.${domain}`;
  }

  if (givenName && givenName.length > 2) {
    givenNameInitial = givenName.toUpperCase().charAt(0);
  }

  const toggleDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "main" });
  };

  const handleLogout = async (event: React.MouseEvent) => {
    dispatch({ type: "SIGN_OUT" });
    handleClose();
  };

  const handleOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.menu}>
      {(mobile || tablet) && (
        <IconButton onClick={toggleDrawer} color="inherit">
          <MenuIcon />
        </IconButton>
      )}
      {givenNameInitial && (
        <Avatar className={classes.avatar} onClick={handleOpen}>
          <Typography>{givenNameInitial}</Typography>
        </Avatar>
      )}
      {!givenNameInitial && !mobile && (
        <React.Fragment>
          <Button
            color="inherit"
            variant="text"
            onClick={handleClick(`${protocal}${domain}/contact`, true)}
          >
            Post Job
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleClick(`${protocal}auth.${domain}`, true)}
          >
            Login
          </Button>
        </React.Fragment>
      )}
      {!mobile && fullName && <Typography onClick={handleOpen}>{fullName}</Typography>}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClick(dashboardUrl, true)}>My Account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
