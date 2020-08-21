import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import {Card} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {OrganizationContext} from "../../context/organization";
import {GET_ALL_CANDIDATES} from "../../graphql/candidates";
import {GET_ALL_JOBS} from "../../graphql/jobs";

interface ICandidate {
  id: string;
  date_created: string;
  status: string;
  job: IJob;
}

interface IJob {
  id: string;
  date_created: string;
  date: any;
  organization: IOrganization;
}
interface IOrganization {
  id: string;
}

const useStyles = makeStyles({
  pos: {
    paddingBottom: 0,
    textAlign: 'center',
  },
  title: {
    fontSize: 44,
    marginBottom: 0,
    paddingBottom: 0,
    textAlign: 'center',
  },
});

/**
 * DashboardCounters component renders  cards which shows number of posted jobs,
 * applied candidates and hired candidates
 */
const DashboardCounters = () => {
  const organization = React.useContext(OrganizationContext);
  const candidatesQuery = useApolloQuery(GET_ALL_CANDIDATES);
  const jobsQuery = useApolloQuery(GET_ALL_JOBS);
  const classes = useStyles();
  let candidates: ICandidate[] = [];
  let jobs: IJob[] = [];
  const effect = () => {
    const variables = {
      limit: 10000
    };
    jobsQuery.execute({ variables });
    candidatesQuery.execute({variables});
  };
  React.useEffect(effect, []);

  if (organization && organization.state && organization.state.id) {
    const organizationID = organization.state.id;
    if (candidatesQuery.data && candidatesQuery.data.listKarmaCandidates &&
      candidatesQuery.data.listKarmaCandidates.items) {
      candidates = candidatesQuery.data.listKarmaCandidates.items
        .filter((candidate: ICandidate) =>
          candidate.job && candidate.job.organization && candidate.job.organization.id === organizationID);
    }
    if (jobsQuery.data && jobsQuery.data.listKarmaJobs &&
      jobsQuery.data.listKarmaJobs.items) {
      jobs = jobsQuery.data.listKarmaJobs.items
        .filter((job: IJob) => job.organization.id === organizationID);
    }
  }

  return (
    <div>
      <Card style={{height: '128px'}}>
        <CardMedia>
          {candidatesQuery.loading ? <Placeholder variant="text"/> :
            <Typography className={classes.title} color="textPrimary" gutterBottom={true}>
              {jobs.length}
            </Typography>
          }
          <Typography className={classes.pos} color="textSecondary">
            posted jobs
          </Typography>
        </CardMedia>
      </Card>
      <div style={{paddingTop: 10}}>
        <Card style={{height: '128px'}}>
          <CardMedia>
            {candidatesQuery.loading ? <Placeholder variant="text"/> :
              <Typography className={classes.title} color="textPrimary" gutterBottom={true}>
                {candidates.length}
              </Typography>
            }
            <Typography className={classes.pos} color="textSecondary">
              applied candidates
            </Typography>
          </CardMedia>
        </Card>
      </div>
      <div style={{paddingTop: 10}}>
        <Card style={{height: '128px'}}>
          <CardMedia>
            {candidatesQuery.loading ? <Placeholder variant="text"/> :
              <Typography className={classes.title} color="textPrimary" gutterBottom={true}>
                {candidates.filter((candidate: ICandidate) => candidate.status === "Hired").length}
              </Typography>
            }
            <Typography className={classes.pos} color="textSecondary">
              hired
            </Typography>
          </CardMedia>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCounters;
