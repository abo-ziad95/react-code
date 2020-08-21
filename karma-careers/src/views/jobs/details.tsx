import { Container, Divider, Toolbar, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from "@material-ui/icons/Close";
import * as React from "react";
import { DrawerContext } from "../../context/drawer";
import { JobContext } from "../../context/job";

interface IProps {
  disableApplyButton?: boolean;
}

/**
 * React Function Component that renders basic container for Job details
 */

const Job: React.FC<IProps> = props => {
  const drawer = React.useContext(DrawerContext);
  const job = React.useContext(JobContext);
  const toggleDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "apply" });
  };

  if (!job.state) {
    return null;
  }

  return (
    <div style={{ padding: 12 }}>
      <Typography variant="h4">{job.state.title}</Typography>
      <Typography variant="h6">{job.state.company}</Typography>
      <Typography variant="caption" gutterBottom={true}>
        {job.state.city}, {job.state.state} {job.state.zip}
      </Typography>
      <Divider />
      <Toolbar disableGutters={true}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleDrawer}
          disabled={Boolean(props.disableApplyButton)}
        >
          Apply Now
        </Button>
      </Toolbar>
      <div
        style={{ paddingTop: 24 }}
        dangerouslySetInnerHTML={{ __html: job.state.description || "" }}
      />
    </div>
  );
};

/**
 * React Function Component that renders Material-UI Drawer
 * to display Job details
 */

const MuiDrawer: React.FC<IProps> = props => {
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
        <CloseIcon onClick={toggleDrawer} />
      </Toolbar>
      <Container maxWidth="sm">
        <Job disableApplyButton={props.disableApplyButton} />
      </Container>
    </Drawer>
  );
};

export default MuiDrawer;
