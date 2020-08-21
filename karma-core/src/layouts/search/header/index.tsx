import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import parseUrl from "../../../utils/parseUrl";
import Menu from "./menu";

const useStyles = makeStyles(theme => ({
  appBar: {
    boxShadow: "none",
    zIndex: theme.zIndex.drawer + 1
  },
  logo: { flex: 1 }
}));

/**
 * React Function Component that renders Header
 */

const Header: React.FC = () => {
  const { domain, protocal } = parseUrl();
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <div className={classes.logo}>
          <a href={`${protocal}${domain}`} style={{ textDecoration: "none" }}>
            <img
              src="https://karma-careers-uploads.s3-us-west-2.amazonaws.com/logo.png"
              alt="Karma Careers"
              height="24px"
            />
          </a>
        </div>
        <Menu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
