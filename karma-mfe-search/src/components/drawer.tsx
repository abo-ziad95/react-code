import { DrawerContext } from "@hatech/karma-core/context/drawer";
import { Grid } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

/**
 * React Function Component that renders Material-UI Drawer
 * to display Job details
 */

const MuiDrawer: React.FC = props => {
  const drawer = React.useContext(DrawerContext);

  const toggleDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER" });
  };

  return (
    <Drawer
      anchor="right"
      style={{ zIndex: 1200 }}
      onClose={toggleDrawer}
      open={drawer.state === "job"}
      variant="temporary"
    >
      <Toolbar />
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={toggleDrawer}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Grid container={true} spacing={0} justify="center">
        <Grid item={true} xs={12}>
          {props.children}
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default MuiDrawer;
