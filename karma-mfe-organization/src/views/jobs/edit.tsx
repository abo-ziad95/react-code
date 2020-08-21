import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import MuiDialog from "@hatech/karma-core/components/dialog";
import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useReactRouter from "use-react-router";
import uuid from "uuid";
import LocationAutoComplete, {
  IPlacesAutoComplete
} from "../../components/google/placesAutoComplete";
import Actions from "../../components/jobs/Actions";
import AddStep from "../../components/jobs/addStep";
import { IStep } from "../../components/jobs/droppable";
import HiringSteps from "../../components/jobs/hiringSteps";
import { OrganizationContext } from "../../context/organization";
import { DELETE_JOB, GET_JOB, UPDATE_JOB } from "../../graphql/jobs";
import { AlertsContext } from "@hatech/karma-core/context/alerts";


const steps = [
  {
    id: uuid.v4(),
    label: "Apply",
    priority: 0
  },
  {
    id: uuid.v4(),
    label: "Pre-Screen",
    priority: 1
  },
  {
    id: uuid.v4(),
    label: "Interview",
    priority: 2
  },
  {
    id: uuid.v4(),
    label: "Hired",
    priority: 3
  }
];
/**
 * Edit component return form to edit job
 */
const Edit: React.FC = () => {
  const alerts = React.useContext(AlertsContext);
  const [hiringSteps, setHiringSteps] = React.useState<IStep[]>(steps);
  const [submit, setSubmit] = React.useState(false);
  const [address, setAddress] = React.useState();
  const [status, setStatus] = React.useState('Active');
  const [jobType, setJobType] = React.useState('Full Time');
  const [coordinates, setCoordinates] = React.useState();
  const [description, setDescription] = React.useState();
  const organization = React.useContext(OrganizationContext);
  const notification = React.useContext(NotificationContext);
  const query = useApolloQuery(GET_JOB);
  const deleteJob = useApolloMutation(DELETE_JOB);
  const mutation = useApolloMutation(UPDATE_JOB);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const { handleClick } = useHistoryPush();
  const { match, history } = useReactRouter();
  const { jobId } = match.params as { jobId: string };

  const titleTextField = useTextField("title", "Job Title");

  const effect = () => {
    const options = {
      fetchPolicy: "network-only",
      variables: { id: jobId }
    };
    query.execute(options);
  };
  React.useEffect(effect, []);

  const setValues = () => {
    if (query.data && query.data.getKarmaJobs) {
      titleTextField.setValue(query.data.getKarmaJobs.title);
      if (query.data.getKarmaJobs.address) {
        setAddress(query.data.getKarmaJobs.address);
      }
      setDescription(query.data.getKarmaJobs.description);
      setStatus(query.data.getKarmaJobs.status);
      if (query.data.getKarmaJobs.jobType) {
        setJobType(query.data.getKarmaJobs.jobType);
      }
      if (!submit && query.data.getKarmaJobs.hiring_steps) {
        query.data.getKarmaJobs.hiring_steps.forEach((step: IStep) => {
          delete step.__typename;
        });
        const currentSteps = query.data.getKarmaJobs.hiring_steps;
        setHiringSteps(currentSteps);
      }
    }
  };
  React.useEffect(setValues, [query.data]);

  const deletedJobEffect = () => {
    if (deleteJob.data) {
      notification.dispatch({
        payload: {
          message: "Job has been deleted"
        },
        type: "ADD_NOTIFICATION"
      });
      history.push("/jobs");
    }
  };
  React.useEffect(deletedJobEffect, [deleteJob.data]);

  const updatedJobEffect = () => {
    if (mutation.data) {
      notification.dispatch({
        payload: {
          message: "Job has been updated"
        },
        type: "ADD_NOTIFICATION"
      });
    }
  };
  React.useEffect(updatedJobEffect, [mutation.data]);

  const handleDelete = () => {
    setOpenConfirm(true);
  };

  const cancelDelete = () => {
    setOpenConfirm(false);
  };

  const handleWysiwygChange = (value: string) => {
    setDescription(value);
  };

  const confirmDelete = async () => {
    const input = {
      id: jobId,
      status: "Deleted"
    };
    mutation.execute({ variables: { input } });
    history.push("/jobs");
  };

  const handleSelect = (payload: IPlacesAutoComplete) => {
    setAddress(payload.address);
    setCoordinates(payload.coordinates);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!address || !titleTextField.value) {
      alerts.dispatch({
        payload: {
          body: "Title and Location are required fields "
        },
        type: "ADD_ALERT"
      });
      return;
    }

    const input = {
      address,
      coordinates,
      description,
      hiring_steps: JSON.parse(JSON.stringify(hiringSteps)),
      id: jobId,
      jobType,
      status,
      title: titleTextField.value
    };
    setSubmit(true);
    mutation.execute({ variables: { input } });
  };

  const breadcrumbs = [
    {
      path: `/`,
      primary: organization.state ? organization.state.name : ""
    },
    { primary: "Jobs", path: `/jobs` },
    {
      path: `/jobs/${jobId}`,
      primary: titleTextField.value || ""
    },
    { primary: "Edit" }
  ];

  const changeStatusJob = (status:string) => {
    setStatus(status)
  };
  const changeJobType = (jobType:string) => {
    setJobType(jobType)
  };

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader title="Edit Job Posting" action={<Actions jobType={jobType}  changeJobType={changeJobType} status={status} changeStatusJob={changeStatusJob} />}/>
              <Divider />
              <CardContent>
                <div className="wrapper">
                  <Grid container={true} spacing={3} justify="center">
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...titleTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <LocationAutoComplete
                        handleSelect={handleSelect}
                        disableCurrentLocation={true}
                        value={address}
                      />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactQuill value={description || ""} onChange={handleWysiwygChange} />
                    </Grid>
                  </Grid>
                  {query.data && (
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Toolbar>
                        <Typography variant="body1">Hiring Steps</Typography>
                        <AddStep hiringSteps={hiringSteps} setHiringSteps={setHiringSteps} />
                      </Toolbar>
                      <HiringSteps hiringSteps={hiringSteps} setHiringSteps={setHiringSteps} />
                    </Grid>
                  )}
                </div>
                <CardActions>
                  <Button
                    id="linkToSingleJob"
                    onClick={handleClick(`/jobs/${jobId}`)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button id="submit" color="primary" type="submit" variant="contained">
                    Submit
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </form>
        </Grid>
        <Grid item={true} xs={12} style={{ textAlign: "center" }}>
          <MuiDialog
            body="Are you sure you want to delete this forever?"
            handleConfirm={confirmDelete}
            handleCancel={cancelDelete}
            open={openConfirm}
            title="This is permanent!"
          />
          <Button id="delete" onClick={handleDelete} color="primary">
            Delete Job
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Edit;
