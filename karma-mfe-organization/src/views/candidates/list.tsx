import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";
import React from "react";
import useReactRouter from "use-react-router";
import { ICandidate } from "../../context/candidate";
import { OrganizationContext } from "../../context/organization";
import { GET_CANDIDATES } from "../../graphql/candidates";
import { GET_JOB } from "../../graphql/jobs";

interface IResults {
  items: ICandidate[];
  nextToken?: string;
}

interface IQueryResult {
  queryKarmaCandidatesByJobDateCreatedIndex: IResults;
}

interface IFetchMoreOptions {
  fetchMoreResult?: IQueryResult;
  variables?: Record<string, any> | undefined;
}

/**
 * ApplicantsList component renders list of Applicants in specific job
 */

const ApplicantsList: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const job = useApolloQuery(GET_JOB);
  const organization = React.useContext(OrganizationContext);
  const candidatesQuery = useApolloQuery(GET_CANDIDATES);
  const [candidates, setCandidates] = React.useState<undefined | IResults>();
  const { match } = useReactRouter();
  const { jobId } = match.params as { jobId: string };

  const effect = () => {
    candidatesQuery.execute({ variables: { job: jobId } });
    job.execute({ variables: { id: jobId } });
  };
  React.useEffect(effect, []);

  const setCandidateState = () => {
    if (
      candidatesQuery.data &&
      candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex &&
      candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex.items
    ) {

      const filteredCandidates = {
        items: candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex.items.filter(
        (candidate: ICandidate) => candidate.status !== "apply" && candidate.status !== "denied")
      }
      setCandidates(filteredCandidates);
    }
  };
  React.useEffect(setCandidateState, [candidatesQuery.data]);

  const fetchMore = () => {
    const variables = {
      after:
        candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex.nextToken
    };

    const updateQuery = (
      previousQueryResult: IQueryResult,
      options: IFetchMoreOptions
    ) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.queryKarmaCandidatesByJobDateCreatedIndex.items = [
        ...previousQueryResult.queryKarmaCandidatesByJobDateCreatedIndex.items,
        ...options.fetchMoreResult.queryKarmaCandidatesByJobDateCreatedIndex
          .items
      ];

      return options.fetchMoreResult;
    };

    candidatesQuery.fetchMore({ variables, updateQuery });
  };

  const breadcrumbs = [
    {
      path: "/",
      primary: organization.state ? organization.state.name : <Placeholder variant="text" />,
    },
    { primary: "Jobs", path: "/jobs" },
    {
      path: job.data ? `/jobs/${job.data.getKarmaJobs.id}` : "",
      primary: job.data ? job.data.getKarmaJobs.title : "",
    },
    { primary: "Candidates" }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader title="Candidates" />
            <Divider />
            <CardContent>
              <List>
                {_.isUndefined(candidates) &&
                  [1, 2, 3].map(value => (
                    <ListItem key={value} divider={true}>
                      <ListItemText primary={<Placeholder variant="text" />} />
                    </ListItem>
                  ))}
                {candidates && !candidates.items.length && (
                  <ListItem>
                    <ListItemText primary="No candidates to display" />
                  </ListItem>
                )}
                {candidates &&
                  candidates.items &&
                  candidates.items.map(
                    (candidate: ICandidate, index: number) => (
                      <ListItem
                        id={`list-${index}`}
                        button={true}
                        divider={true}
                        key={index}
                        onClick={handleClick(
                          `/jobs/${jobId}/candidates/${candidate.id}`
                        )}
                      >
                        <ListItemText primary={candidate.applicant.full_name} />
                        <ListItemText primary={candidate.job.title} />
                      </ListItem>
                    )
                  )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ textAlign: "center" }}
        >
          {candidates && (
            <Button
              color="primary"
              variant="outlined"
              id="loadMore"
              disabled={!Boolean(candidates.nextToken)}
              onClick={fetchMore}
            >
              Load More
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ApplicantsList;
