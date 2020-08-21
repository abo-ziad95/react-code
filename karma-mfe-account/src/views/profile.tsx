import Breadcrumbs, { IBreadcrumb } from "@hatech/karma-core/components/breadcrumbs";
import { UserContext } from "@hatech/karma-core/context/user";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useSetHead from "@hatech/karma-core/hooks/useSetHead";
import Grid from "@material-ui/core/Grid";
import React from "react";
import Criteria from "../components/form/profile/criteria";
import Qualifications from "../components/form/profile/qualifications";
import Resume from "../components/form/profile/resume";
import { GET_CANDIDATE_PROFILE } from "../graphql/candidate/profile";
import { useStyles } from "./application";

const Profile: React.FC = () => {
  const classes = useStyles();
  useSetHead({ title: "Candidate Profile" });
  const user = React.useContext(UserContext);
  const queryCandidate = useApolloQuery(GET_CANDIDATE_PROFILE);
  const [candidate, setCandidate] = React.useState();

  const getCandidate = () => {
    if (user.state) {
      const variables = { id: user.state.identity.sub };
      queryCandidate.execute({ variables });
    }
  };
  React.useEffect(getCandidate, [user.state]);

  const setCandidateState = () => {
    const candidateData =
      queryCandidate.data && queryCandidate.data.getKarmaCandidateProfiles;
    if (candidateData) {
      setCandidate(candidateData);
    }
  };
  React.useEffect(setCandidateState, [queryCandidate.data]);

  const breadcrumbs: IBreadcrumb[] = [
    {
      path: `/`,
      primary: `Dashboard`
    }
  ];

  breadcrumbs.push({ primary: "Profile" });

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className={classes.breadcrumbs}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Criteria candidate={candidate} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Qualifications candidate={candidate} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Resume />
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
