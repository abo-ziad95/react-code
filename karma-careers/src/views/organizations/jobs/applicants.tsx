import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Storage } from "aws-amplify";
import _ from "lodash";
import moment from "moment";
import * as React from "react";
import { FaDownload } from "react-icons/fa";
import useReactRouter from "use-react-router";
import Breadcrumbs from "../../../components/breadcrumbs";
import Layout from "../../../components/layout/index";
import ApplicationList from "../../../components/list";
import { AlertsContext } from "../../../context/alerts";
import { IJob } from "../../../context/job";
import { IApplication } from "../../../context/types";
import useGetRequest from "../../../hooks/api/useGetRequest";
import useGetOrganization from "../../../hooks/useGetOrganization";
import MuiDrawer from "../../jobs/details";
import Menu from "../menu";

const useGetApplicants = () => {
  const [applicants, setApplicants] = React.useState([]);
  const { match } = useReactRouter();
  const { get, loading } = useGetRequest();
  const { jobId } = match.params as { jobId: string };

  const getApplicants = async () => {
    const params = { job: jobId };
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/applicants`;
    const { data, status } = await get(url, { params });
    if (status === 200) {
      setApplicants(data.results);
    }
  };

  const callback = React.useCallback(getApplicants, [jobId]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return { applicants, loading };
};

/**
 * Custom Hook to retrieve Job by id.
 * @param id ID of Job set be react-router path params
 */

const useGetJob = () => {
  const [job, setJob] = React.useState<IJob>();
  const { get } = useGetRequest();
  const { match } = useReactRouter();
  const { jobId } = match.params as { jobId: string };

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

const Applicants: React.FC = () => {
  const organization = useGetOrganization();
  const alerts = React.useContext(AlertsContext);
  const job = useGetJob();
  const { applicants, loading } = useGetApplicants();
  const { match } = useReactRouter();
  const { id, jobId } = match.params as { id: string; jobId: string };

  const breadcrumbs = [
    {
      primary: organization ? organization.name : "",
      path: `/organizations/${organization ? organization.id : undefined}`
    },
    { primary: "Jobs", path: `/organizations/${id}/jobs` },
    {
      primary: job ? job.title : "",
      path: job ? `/organizations/${id}/jobs/${jobId}` : undefined
    },
    { primary: "Applicants" }
  ];

  const handleAppClick = (id: string, resume: string) => async () => {
    // We are probably going to use this Id later
    console.log(id);
    try {
      const file = await Storage.get(resume);
      window.open(file as string, "_blank");
    } catch (error) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: error
        }
      });
    }
  };

  const listItems = applicants.map((application: IApplication) => {
    return {
      avatar: (
        <Avatar>
          {application.title ? application.title.charAt(0) : undefined}
        </Avatar>
      ),
      primary: application.given_name + " " + application.family_name,
      secondary:
        "Applied: " + moment(application.date_created).format("MMM DD, YYYY"),
      secondaryAction: application.resume && (
        <Tooltip title="Download Resume">
          <IconButton
            onClick={handleAppClick(application.id, application.resume)}
          >
            <FaDownload />
          </IconButton>
        </Tooltip>
      )
    };
  });

  return (
    <Layout
      menuComponent={<Menu />}
      title={
        organization && job
          ? organization.name + " | " + job.title + " | Applicants"
          : undefined
      }
    >
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12}>
            <Card>
              <CardHeader title="Applicants" />
              <Divider />
              <CardContent>
                {loading && (
                  <Container style={{ textAlign: "center" }}>
                    <CircularProgress />
                  </Container>
                )}
                {!loading && _.isEmpty(listItems) && (
                  <Container style={{ textAlign: "center" }}>
                    No applicants yet.
                  </Container>
                )}
                {!loading && <ApplicationList items={listItems} />}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <MuiDrawer disableApplyButton={true} />
    </Layout>
  );
};

export default Applicants;
