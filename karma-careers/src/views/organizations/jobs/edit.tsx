import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useReactRouter from "use-react-router";
import Breadcrumbs from "../../../components/breadcrumbs";
import MuiDialog from "../../../components/dialog";
import Layout from "../../../components/layout/index";
import { AlertsContext } from "../../../context/alerts";
import { IJob } from "../../../context/job";
import useDeleteRequest from "../../../hooks/api/useDeleteRequest";
import useGetRequest from "../../../hooks/api/useGetRequest";
import usePutRequest from "../../../hooks/api/usePutRequest";
import useTextField from "../../../hooks/form/useTextField";
import useHistoryPush from "../../../hooks/router/useHistoryPush";
import Menu from "../menu";
import useGetOrganization from "../../../hooks/useGetOrganization";

/**
 * Custom Hook to retrieve Job by id.
 * @param id ID of Job set be react-router path params
 */

const useGetJob = () => {
  const [job, setJob] = React.useState<IJob>();
  const { get } = useGetRequest();
  const { match } = useReactRouter();
  const { jobId } = match.params as { id: string; jobId: string };

  const getJobs = async () => {
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/jobs/${jobId}`;
    const { data, status } = await get(url);
    if (status === 200) {
      setJob(data.results);
    }
  };

  const callback = React.useCallback(getJobs, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return job;
};

const Edit: React.FC = () => {
  const organization = useGetOrganization();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const { handleClick } = useHistoryPush();
  const alerts = React.useContext(AlertsContext);
  const { push } = useHistoryPush();
  const { _delete } = useDeleteRequest();
  const { put } = usePutRequest();
  const job = useGetJob();
  const [wysiwyg, setWysiwyg] = React.useState();
  const cityTextField = useTextField("city", "City", job ? job.city : "");
  const stateTextField = useTextField("state", "State", job ? job.state : "");
  const titleTextField = useTextField("title", "Job Title", job ? job.title : "");
  const zipTextField = useTextField("zip", "Zip", job ? job.zip : "");
  const addressTextField = useTextField("address", "Street Address", job ? job.address : "");

  const handleDelete = () => {
    setOpenConfirm(true);
  };

  const cancelDelete = () => {
    setOpenConfirm(false);
  };

  React.useEffect(() => {
    if (job) {
      setWysiwyg(job.description);
    }
  }, [job]);

  const handleWysiwygChange = (value: string) => {
    setWysiwyg(value);
  };

  const confirmDelete = async () => {
    if (!job) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: "Unable to determine job selected"
        }
      });
      return;
    }

    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/jobs/${job.id}`;
    const { status } = await _delete(url);
    if (status === 200) {
      push(`/organizations/${id}/jobs`);
    }
  };

  const handleSubmit = async () => {
    if (!job) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: "Unable to determine job selected"
        }
      });
      return;
    }

    const body = {
      title: titleTextField.value,
      address: addressTextField.value,
      city: cityTextField.value,
      state: stateTextField.value,
      zip: zipTextField.value,
      description: wysiwyg
    };
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/jobs/${job.id}`;
    const { status } = await put(url, {}, body);

    if (status === 200) {
      push(`/organizations/${id}/jobs`);
    }
  };

  const breadcrumbs = [
    {
      primary: organization ? organization.name : "",
      path: `/organizations/${organization ? organization.id : undefined}`
    },
    { primary: "Jobs", path: `/organizations/${id}/jobs` },
    {
      primary: job ? job.title : "",
      path: job ? `/organizations/${id}/jobs/${job.id}` : undefined
    },
    { primary: "Edit" }
  ];

  return (
    <Layout
      menuComponent={<Menu />}
      title={organization && job ? organization.name + " | " + job.title + " | Edit" : undefined}
    >
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title="Edit Job Posting" />
              <Divider />
              <CardContent>
                <div className="wrapper">
                  <Grid container={true} spacing={3} justify="center">
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...titleTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...addressTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField {...cityTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={2} lg={2} xl={2}>
                      <TextField {...stateTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={4} lg={4} xl={4}>
                      <TextField {...zipTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactQuill value={wysiwyg || ""} onChange={handleWysiwygChange} />
                    </Grid>
                  </Grid>
                </div>
                <CardActions>
                  <Button
                    onClick={handleClick(`/organizations/${id}/jobs/${job ? job.id : ""}`)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button color="primary" onClick={handleSubmit} variant="contained">
                    Submit
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} style={{ textAlign: "center" }}>
            <MuiDialog
              body="Are you sure you want to delete this forever?"
              handleConfirm={confirmDelete}
              handleCancel={cancelDelete}
              open={openConfirm}
              title="This is permanent!"
            />
            <Button onClick={handleDelete} color="primary">
              Delete this Job
            </Button>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Edit;
