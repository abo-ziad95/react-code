import { Container, Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { Storage } from "aws-amplify";
import * as React from "react";
import InputMask from "react-input-mask";
import { AlertsContext } from "../../context/alerts";
import { DrawerContext } from "../../context/drawer";
import { JobContext } from "../../context/job";
import { UserContext } from "../../context/user";
import usePostRequest from "../../hooks/api/usePostRequest";
import useTextField from "../../hooks/form/useTextField";

const inputComponent = (props: string | object) => {
  return <InputMask mask="+1 (999) 999-9999" maskChar=" " {...props} />;
};

const Form: React.FC = () => {
  const { post } = usePostRequest();
  const drawer = React.useContext(DrawerContext);
  const user = React.useContext(UserContext);
  const alerts = React.useContext(AlertsContext);
  const job = React.useContext(JobContext);
  const firstNameTextField = useTextField(
    "firstName",
    "First Name",
    user.state ? user.state.given_name : undefined
  );
  const lastNameTextField = useTextField(
    "lastName",
    "Last Name",
    user.state ? user.state.family_name : undefined
  );
  const emailTextField = useTextField("email", "Email", user.state ? user.state.email : undefined);
  const phoneTextField = useTextField(
    "phoneNumber",
    "Phone Number",
    user.state ? user.state.phone_number : undefined
  );
  const resumeTextField = useTextField("resume", "Upload Resume");

  const progressCallback = (progress: ProgressEvent) => {
    console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
  };

  const handleSubmit = async () => {
    if (!job.state) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: "Unable to determine job selected"
        }
      });
      return;
    }

    if (!resumeTextField.files) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: "Please attach a resume to submit"
        }
      });
      return;
    }

    const config = {
      contentType: resumeTextField.files[0].type,
      progressCallback
    };
    await Storage.put(resumeTextField.files[0].name, resumeTextField.files[0], config);
    const url = "https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/applicants";
    const body = {
      company: job.state.company,
      email: emailTextField.value,
      family_name: lastNameTextField.value,
      given_name: firstNameTextField.value,
      job: job.state.id,
      phone_number: phoneTextField.value,
      resume: resumeTextField.files[0].name,
      sub: user.state ? user.state.sub : undefined,
      title: job.state.title
    };
    const { status } = await post(url, {}, body);

    if (status === 201) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Success!!!",
          body: `Congratualations, you've applied for the position of ${job.state.title} at ${
            job.state.company
          }`
        }
      });
      drawer.dispatch({ type: "TOGGLE_DRAWER" });
    }
  };

  const handleCancel = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "job" });
  };

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={12}>
          <TextField {...firstNameTextField.attributes} />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField {...lastNameTextField.attributes} />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField {...emailTextField.attributes} />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField {...phoneTextField.attributes} InputProps={{ inputComponent }} />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField
            {...resumeTextField.attributes}
            InputLabelProps={{ shrink: true }}
            type="file"
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="primary" onClick={handleCancel}>
            Back
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

/**
 * React Function Component that renders basic container for Job details
 */

const Apply: React.FC = () => {
  const job = React.useContext(JobContext);

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
      <Form />
    </div>
  );
};

/**
 * React Function Component that renders Material-UI Drawer
 * to display Job details
 */

const MuiDrawer: React.FC = () => {
  const drawer = React.useContext(DrawerContext);
  const toggleDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER" });
  };

  return (
    <Drawer
      anchor="right"
      style={{ zIndex: 1200 }}
      onClose={toggleDrawer}
      open={drawer.state === "apply"}
      variant="temporary"
    >
      <Toolbar />
      <Toolbar>
        <CloseIcon onClick={toggleDrawer} />
      </Toolbar>
      <Container maxWidth="sm">
        <Apply />
      </Container>
    </Drawer>
  );
};

export default MuiDrawer;
