import useSetHead from "@hatech/karma-core/hooks/useSetHead";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import useReactRouter from "use-react-router";
import Breadcrumbs, { IBreadcrumb } from "../components/breadcrumbs";
import { IJob, JobsContext } from "../context/jobs";

const JobSingle: React.FC = () => {
  const { state } = React.useContext(JobsContext);
  const { location, match } = useReactRouter();
  const { id } = match.params as { id: string };
  const jobs = state.filter((job: IJob) => job.id === id);
  const job = jobs[0];
  const setHead = useSetHead({ title: "Job" });

  React.useEffect(() => {
    if (job) {
      setHead({ title: job.title });
    }
  }, [job, setHead]);

  const breadcrumbs: IBreadcrumb[] = [
    {
      primary: `Jobs`,
      path: `/list${location.search}`
    }
  ];

  if (job) {
    breadcrumbs.push({ primary: job.title });
  }

  return (
    <div className="wrapper">
      <Grid container={true} justify="center" spacing={3}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <Paper>
            {job && (
              <div style={{ padding: 36 }}>
                <Typography variant="h4">{job.title}</Typography>
                <Typography variant="h6">{job.company}</Typography>
                <Typography variant="caption" gutterBottom={true}>
                  {job.city}, {job.state} {job.zip}
                </Typography>
                <Divider />
                <Toolbar disableGutters={true}>
                  <Button
                    variant="contained"
                    color="primary"
                    // onClick={}
                  >
                    Apply Now
                  </Button>
                </Toolbar>
                <div
                  style={{ padding: 12 }}
                  dangerouslySetInnerHTML={{ __html: job.description || "" }}
                />
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default JobSingle;
