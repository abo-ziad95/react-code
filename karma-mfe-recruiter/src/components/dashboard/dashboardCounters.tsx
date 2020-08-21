import React from "react";
import {GET_ALL_CANDIDATES} from "../../graphql/candidates";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import {Card} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {GET_ALL_JOBS} from "../../graphql/jobs";
import CardMedia from "@material-ui/core/CardMedia";
import Placeholder from "@hatech/karma-core/components/placeholder";

interface ICandidate {
  id: string;
  date_created: string;
  status: string;
}

interface IJob {
  id: string;
  date_created: string;
  date: any;
}

const useStyles = makeStyles({
  title: {
    fontSize: 44,
    textAlign: 'center',
    paddingBottom: 0,
    marginBottom: 0,
  },
  pos: {
    paddingBottom: 0,
    textAlign: 'center',
  },
});

/**
 * DashboardCounters component renders  cards which shows number of posted jobs,
 * applied candidates and hired candidates
 */
const DashboardCounters = () => {
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

  if (candidatesQuery.data && candidatesQuery.data.listKarmaCandidates &&
    candidatesQuery.data.listKarmaCandidates.items) {
    candidates = candidatesQuery.data.listKarmaCandidates.items;
  }
  if (jobsQuery.data &&  jobsQuery.data.listKarmaJobs &&
    jobsQuery.data.listKarmaJobs.items) {
    jobs = jobsQuery.data.listKarmaJobs.items;
  }

  return (
    <div>
      <Card>
        <CardMedia>
          {candidatesQuery.loading ? <Placeholder variant="text"/> :
            <Typography className={classes.title} color="textPrimary" gutterBottom>
              {jobs.length}
            </Typography>
          }
          <Typography className={classes.pos} color="textSecondary">
            posted jobs
          </Typography>
        </CardMedia>
      </Card>
      <div style={{paddingTop: 10}}>
        <Card>
          <CardMedia>
            {candidatesQuery.loading ? <Placeholder variant="text"/> :
              <Typography className={classes.title} color="textPrimary" gutterBottom>
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
        <Card>
          <CardMedia>
            {candidatesQuery.loading ? <Placeholder variant="text"/> :
              <Typography className={classes.title} color="textPrimary" gutterBottom>
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