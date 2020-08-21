import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import InboxIcon from "@material-ui/icons/Inbox";
import * as React from "react";
import useReactRouter from "use-react-router";
import Breadcrumbs from "../../../components/breadcrumbs";
import Layout from "../../../components/layout/index";
import { IJob } from "../../../context/job";
import useGetRequest from "../../../hooks/api/useGetRequest";
import useHistoryPush from "../../../hooks/router/useHistoryPush";
import useGetOrganization from "../../../hooks/useGetOrganization";
import Menu from "../menu";

interface IProfile {
  job?: IJob;
}

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

const JobProfile: React.FC<IProfile> = ({ job }) => {
  const { applicants } = useGetApplicants();
  const { handleClick } = useHistoryPush();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };
  const __html = job ? job.description : "";

  if (!job) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={job.title}
        action={
          <React.Fragment>
            <IconButton
              onClick={handleClick(
                `/organizations/${id}/jobs/${job.id}/applicants`
              )}
            >
              <Badge
                badgeContent={applicants.length}
                color="primary"
                invisible={applicants.length === 0}
              >
                <Tooltip title="View Applicants">
                  <InboxIcon />
                </Tooltip>
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleClick(`/organizations/${id}/jobs/${job.id}/edit`)}
            >
              <Tooltip title="Edit Job">
                <EditIcon color="primary" />
              </Tooltip>
            </IconButton>
          </React.Fragment>
        }
      />
      <Divider />
      <CardContent dangerouslySetInnerHTML={{ __html }} />
    </Card>
  );
};

const Profile: React.FC = () => {
  const job = useGetJob();
  const organization = useGetOrganization();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };
  const breadcrumbs = [
    {
      primary: organization ? organization.name : "",
      path: `/organizations/${organization ? organization.id : undefined}`
    },
    { primary: "Jobs", path: `/organizations/${id}/jobs` },
    { primary: job ? job.title : "" }
  ];

  return (
    <Layout
      menuComponent={<Menu />}
      title={
        organization && job ? organization.name + " | " + job.title : undefined
      }
    >
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <JobProfile job={job} />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Profile;
