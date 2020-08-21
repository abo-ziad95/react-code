import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import Grid from "@material-ui/core/Grid";
import React from "react";
import useReactRouter from "use-react-router";
import Profile from "../../components/candidates/profile";
import Schedule from "../../components/candidates/schedule";
import ProgressStepper from "../../components/candidates/stepper";
import CandidateContextProvider, { CandidateContext } from "../../context/candidate";
import { OrganizationContext } from "../../context/organization";
import { GET_JOB } from "../../graphql/jobs";

/**
 * Custom Hook to retrieve Applicant by id.
 */

const Details: React.FC = () => {
  const organization = React.useContext(OrganizationContext);
  const { match } = useReactRouter();
  const { jobId } = match.params as { jobId: string };
  const candidate = React.useContext(CandidateContext);
  const job = useApolloQuery(GET_JOB);
  const [title, setTitle] = React.useState();

  const effect = () => {
    job.execute({ variables: { id: jobId } });
  };
  React.useEffect(effect, []);

  const effectJob = () => {
    if (job.data && job.data.getKarmaJobs) {
      setTitle(job.data.getKarmaJobs.title)
    }
  };
  React.useEffect(effectJob, [job.data]);

  const breadcrumbs = [
    { primary: organization.state ? organization.state.name : <Placeholder variant="text" />, path: "/" },
    { primary: "Jobs", path: "/jobs" },
    { primary: title ? title : <Placeholder variant="text" width="60%" />, path: `/jobs/${jobId}` },
    { primary: candidate.state ? candidate.state.applicant.full_name : "" }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <ProgressStepper />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Profile />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Schedule />
        </Grid>
      </Grid>
    </div>
  );
};

const ProfileView = () => {
  return (
    <CandidateContextProvider>
      <Details />
    </CandidateContextProvider>
  );
};

export default ProfileView;
