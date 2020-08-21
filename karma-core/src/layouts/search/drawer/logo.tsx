import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import React from "react";
import { DrawerContext } from "../../../context/drawer";

const useStyles = makeStyles(theme => ({
  avatar: { height: 80, margin: "24px auto 12px", width: 80 },
  logo: { textAlign: "center", textTransform: "uppercase", marginBottom: 24 },
  toolbar: theme.mixins.toolbar
}));

const Logo: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const tablet = useMediaQuery(theme.breakpoints.only("sm"));
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));
  const drawer = React.useContext(DrawerContext);
  const open = drawer.state === "main";

  const closeDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "main" });
  };

  if (tablet) {
    return (
      <List>
        <ListItem className={classes.toolbar} />
        <ListItem button={true} onClick={closeDrawer} divider={true}>
          <ListItemIcon>
            <React.Fragment>
              {open && <ArrowLeft />}
              {!open && <ArrowRight />}
            </React.Fragment>
          </ListItemIcon>
        </ListItem>
      </List>
    );
  }

  if (mobile) {
    return (
      <div>
        <Typography className={classes.logo}>Karma Careers</Typography>
        <Divider />
      </div>
    );
  }

  return <div className={classes.toolbar} />;
};

export default Logo;
