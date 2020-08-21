import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import { AlertsContext } from "@hatech/karma-core/context/alerts";
import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
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
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import uuid from "uuid";
import LocationAutoComplete, {
  IPlacesAutoComplete
} from "../../components/google/placesAutoComplete";
import AddStep from "../../components/jobs/addStep";
import CreateActions from "../../components/jobs/CreateActions";
import { IStep } from "../../components/jobs/droppable";
import HiringSteps from "../../components/jobs/hiringSteps";
import { OrganizationContext } from "../../context/organization";
import { CREATE_JOB, CREATE_TRANSACTION } from "../../graphql/jobs";

const steps = [
  {
    id: uuid.v4(),
    label: "Apply",
    priority: 1
  },
  {
    id: uuid.v4(),
    label: "Pre-Screen",
    priority: 2
  },
  {
    id: uuid.v4(),
    label: "Interview",
    priority: 3
  },
  {
    id: uuid.v4(),
    label: "Hired",
    priority: 4
  }
];

const CreateJob: React.FC = () => {
  const [hiringSteps, setHiringSteps] = React.useState<IStep[]>(steps);
  const organization = React.useContext(OrganizationContext);
  const notification = React.useContext(NotificationContext);
  const alerts = React.useContext(AlertsContext);
  const { push, handleClick } = useHistoryPush();
  const titleTextField = useTextField("title", "Job Title");
  const [address, setAddress] = React.useState();
  const [coordinates, setCoordinates] = React.useState();
  const [description, setDescription] = React.useState();
  const createJob = useApolloMutation(CREATE_JOB);
  const createTransaction = useApolloMutation(CREATE_TRANSACTION);
  const [jobType, setJobType] = React.useState('Full Time');


  const handleWysiwygChange = (value: string) => {
    setDescription(value);
  };

  const effect = () => {
    if (createJob.data) {
      notification.dispatch({
        payload: {
          message: "A new job has been created"
        },
        type: "ADD_NOTIFICATION"
      });
      push("/jobs");
    }
  };
  React.useEffect(effect, [createJob.data]);

  const handleSelect = (payload: IPlacesAutoComplete) => {
    setAddress(payload.address);
    setCoordinates(payload.coordinates);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!organization.state) {
      alerts.dispatch({
        payload: {
          body: "Unable to determine organization"
        },
        type: "ADD_ALERT"
      });
      return;
    }

    if (!address || !titleTextField.value) {
      alerts.dispatch({
        payload: {
          body: "Title and Location are required fields "
        },
        type: "ADD_ALERT"
      });
      return;
    }

    const id = uuid.v4();

    const input = {
      address,
      coordinates,
      date_created: moment().format("YYYY-MM-DD"),
      description,
      hiring_steps: hiringSteps,
      id,
      jobType,
      organization: organization.state.id,
      status: 'Active',
      title: titleTextField.value
    };

    await createJob.execute({ variables: { input } });
    const transactionInput = {
      amount: 10,
      date_created: moment()
        .utc(false)
        .format("YYYY-MM-DDTHH:mm:ssZ"),
      description: 'Job Posted',
      id,
      organization: organization.state.id,
      type: "debit"
    };
    await createTransaction.execute({ variables: { input: transactionInput } });
  };

  const breadcrumbs = [
    {
      path: `/organizations/${organization.state ? organization.state.id : undefined}`,
      primary: organization.state ? organization.state.name : ""
    },
    { primary: "Jobs", path: `/jobs` },
    { primary: "Create" }
  ];

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
          <form id="submit" onSubmit={handleSubmit}>
            <Card>
              <CardHeader title="Create Job Post" action={<CreateActions jobType={jobType}  changeJobType={changeJobType}  />} />
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
                      />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactQuill value={description || ""} onChange={handleWysiwygChange} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Toolbar>
                        <Typography variant="body1">Hiring Steps</Typography>
                        <AddStep hiringSteps={hiringSteps} setHiringSteps={setHiringSteps} />
                      </Toolbar>
                      <HiringSteps hiringSteps={hiringSteps} setHiringSteps={setHiringSteps} />
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
              <CardActions>
                <Button id="linkToJobs" onClick={handleClick(`/jobs`)} color="primary">
                  Cancel
                </Button>
                <Button id="submitBtn" type="submit" color="primary" variant="contained">
                  Submit
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateJob;
