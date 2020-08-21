import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox";
import * as React from "react";
import useReactRouter from "use-react-router";
import Breadcrumbs from "../../../components/breadcrumbs";
import Layout from "../../../components/layout/index";
import JobList from "../../../components/list";
import { IJob } from "../../../context/job";
import useGetRequest from "../../../hooks/api/useGetRequest";
import useHistoryPush from "../../../hooks/router/useHistoryPush";
import useGetOrganization from "../../../hooks/useGetOrganization";
import Menu from "../menu";

const useGetJobs = () => {
  const [jobs, setJobs] = React.useState([]);
  const { get } = useGetRequest();
  const { handleClick } = useHistoryPush();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string; jobId: string };

  const getJobs = async () => {
    const params = { organization: id };
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/jobs`;
    const { data, status } = await get(url, { params });
    if (status === 200) {
      const jobs = data.results.filter((job: IJob) => job.organization === id);
      setJobs(jobs);
    }
  };

  const callback = React.useCallback(getJobs, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return jobs.map((job: IJob) => {
    return {
      avatar: <Avatar>{job.title ? job.title.charAt(0) : undefined}</Avatar>,
      primary: job.title,
      secondary: job.company,
      secondaryAction: (
        <IconButton
          onClick={handleClick(
            `/organizations/${id}/jobs/${job.id}/applicants`
          )}
        >
          <Badge
            badgeContent={job.applicant_total}
            color="primary"
            invisible={!Boolean(job.applicant_total)}
          >
            <Tooltip title="View Applicants">
              <InboxIcon />
            </Tooltip>
          </Badge>
        </IconButton>
      ),
      handleClick: handleClick(`/organizations/${id}/jobs/${job.id}`)
    };
  });
};

const List: React.FC = () => {
  const jobs = useGetJobs();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };
  const organization = useGetOrganization();
  const { handleClick } = useHistoryPush();
  const breadcrumbs = [
    {
      primary: organization ? organization.name : "",
      path: `/organizations/${organization ? organization.id : undefined}`
    },
    { primary: "Jobs" }
  ];

  return (
    <Layout
      menuComponent={<Menu />}
      title={organization ? organization.name + " | Jobs" : undefined}
    >
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12}>
            <Card>
              <CardHeader
                title="Jobs"
                action={
                  <Button
                    onClick={handleClick(`/organizations/${id}/jobs/create`)}
                  >
                    <AddIcon color="primary" /> Job Posting
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                <JobList items={jobs} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default List;
