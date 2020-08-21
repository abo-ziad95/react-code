import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import _ from "lodash";
import React from "react";
import Button from "@material-ui/core/Button";
import useReactRouter from "use-react-router";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import {GET_CANDIDATES} from "../../graphql/candidates";
import {GET_JOB} from "../../graphql/jobs";

interface IApplicant {
  [key: string]: any;
}

interface IResults {
  items: IApplicant[];
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
 * CandidatesList return all candidates for specific organization
 */
const CandidatesList: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string; jobId: string };
  const jobId = params.jobId;
  const organizationId = params.organizationId;
  let candidatesQuery = useApolloQuery(GET_CANDIDATES);
  let loading = candidatesQuery.loading;
  let jobQuery = useApolloQuery(GET_JOB);
  let candidates, job, nextToken: number | undefined;
  let name: React.ReactNode = <Placeholder variant="text" />;
  let jobTitle: React.ReactNode = <Placeholder variant="text" />;

  const effect = () => {
    const variables = {
      job: jobId
    };
    candidatesQuery.execute({ variables });
    jobQuery.execute({ variables: { id: jobId } });
  };
  React.useEffect(effect, []);

  const fetchMore = () => () => {
    const variables = {
      after: nextToken
    };

    const updateQuery = (previousQueryResult: IQueryResult, options: IFetchMoreOptions) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.queryKarmaCandidatesByJobDateCreatedIndex.items = [
        ...previousQueryResult.queryKarmaCandidatesByJobDateCreatedIndex.items,
        ...options.fetchMoreResult.queryKarmaCandidatesByJobDateCreatedIndex.items
      ];

      return options.fetchMoreResult;
    };

    candidatesQuery.fetchMore({ variables, updateQuery });
  };

  if (candidatesQuery.data && candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex) {
    candidates = candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex.items
      ? candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex.items
      : [];
    nextToken = candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex.nextToken
      ? candidatesQuery.data.queryKarmaCandidatesByJobDateCreatedIndex.nextToken
      : "";
  }

  if (jobQuery.data && jobQuery.data.getKarmaJobs) {
    job = jobQuery.data.getKarmaJobs ? jobQuery.data.getKarmaJobs : "";
  }

  if (!_.isUndefined(job) && !_.isEmpty(job)) {
    name = job.organization.name;
    jobTitle = job.title;
  }

  const breadcrumbs = [
    { primary: "Organizations", path: "/organizations" },
    { primary: name, path: "/organizations/" + organizationId },
    { primary: "Jobs", path: "/organizations/" + organizationId + "/jobs" },
    { primary: jobTitle, path: "/organizations/" + organizationId + "/jobs/" + jobId },
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
            <List>
              {_.isUndefined(candidates) &&
                loading &&
                [1, 2, 3].map(value => (
                  <ListItem key={value} divider={true}>
                    <ListItemText primary={<Placeholder variant="text" />} />
                  </ListItem>
                ))}
              {_.isEmpty(candidates) && !loading && (
                <ListItem>
                  <ListItemText primary="No candidates to display" />
                </ListItem>
              )}
              {candidates &&
                candidates.map((candidate: IApplicant, index: number) => (
                  <ListItem
                    button={true}
                    divider={true}
                    key={index}
                    onClick={handleClick(
                      `/organizations/${organizationId}/jobs/${jobId}/candidates/${candidate.id}`
                    )}
                    id={`candidate-${candidate.id}`}
                  >
                    <ListItemText primary={candidate.applicant && candidate.applicant.full_name} />
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
        <Grid item={true} style={{ textAlign: "center" }}>
          <Button
            color="primary"
            variant="outlined"
            disabled={!Boolean(nextToken)}
            onClick={fetchMore}
            id={"load-more"}
          >
            Load More
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CandidatesList;
