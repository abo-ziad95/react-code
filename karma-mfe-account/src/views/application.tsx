import Breadcrumbs, { IBreadcrumb } from "@hatech/karma-core/components/breadcrumbs";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useSetHead from "@hatech/karma-core/hooks/useSetHead";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";
import React from "react";
import useReactRouter from "use-react-router";
import Interviews from "../components/form/dashboard/application/interviews";
import Job from "../components/form/dashboard/application/job";
import Stepper from "../components/form/dashboard/application/stepper";
import { IApplication, IInterview, IJob } from "../components/types";
import { GET_CANDIDATE_APPLICATION } from "../graphql/candidate/applications";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumbs: {
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(2),
    }
  })
);

/**
 * A React Functional Component that displays a view of a candidates application status, interview times, resumes and job information
 */

const Application: React.FC = () => {
  const classes = useStyles();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };
  const setHead = useSetHead({ title: "Application Status" });
  const queryApplication = useApolloQuery(GET_CANDIDATE_APPLICATION);
  const [application, setApplication] = React.useState<IApplication>();
  const [interviews, setInterviews] = React.useState<IInterview[]>([]);
  const [job, setJob] = React.useState<IJob>();

  const getApplication = () => {
    if (id) {
      const variables = { id };
      queryApplication.execute({ variables });
    }
  };
  React.useEffect(getApplication, [id]);

  const setApplicationState = () => {
    const applicationData =
      queryApplication.data && queryApplication.data.getKarmaCandidates;
    if (applicationData) {
      setApplication(applicationData);
      const interviewData = applicationData.interviews.filter(
        (interview: IInterview) => interview.job.id === applicationData.job.id
      );
      setInterviews(_.sortBy(interviewData, interview => interview.datetime));
      setJob(applicationData.job);
      setHead({ title: applicationData.job.title });
    }
  };
  React.useEffect(setApplicationState, [queryApplication.data]);

  const breadcrumbs: IBreadcrumb[] = [
    {
      path: `/`,
      primary: `Dashboard`,
    }
  ];

  if (job) {
    breadcrumbs.push({ primary: job.title });
  }

  return (
    <div className="wrapper">
      <Grid container={true} justify="center" spacing={3}>
        <Grid item={true} xs={12}>
          <div className={classes.breadcrumbs}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          <Stepper application={application} job={job} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Interviews application={application} interviews={interviews} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Job application={application} job={job} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Application;
