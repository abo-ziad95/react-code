import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";
import React from "react";
import useReactRouter from "use-react-router";
import {GET_JOBS} from "../../graphql/jobs";
import {GET_ORGANIZATION} from "../../graphql/organization";

interface IJob {
  [key: string]: any;
}

interface IResults {
  items: IJob[];
  nextToken?: string;
}

interface IQueryResult {
  queryKarmaJobsByOrganizationDateCreatedIndex: IResults;
}

interface IFetchMoreOptions {
  fetchMoreResult?: IQueryResult;
  variables?: Record<string, any> | undefined;
}

/**
 * JobList component renders list of jobs for specific organization
 */
const JobList: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string };
  const organizationId = params.organizationId;
  const query = useApolloQuery(GET_JOBS);
  const [jobs, setJobs] = React.useState<IJob[] | undefined>();
  const organization = useApolloQuery(GET_ORGANIZATION);

  const effect = () => {
    const variables = { organization: organizationId };
    query.execute({ variables });
    organization.execute({ variables: { id: organizationId } });
  };
  React.useEffect(effect, []);

  const setJobsState = () => {
    if (query.data && query.data.queryKarmaJobsByOrganizationDateCreatedIndex) {
      setJobs(query.data.queryKarmaJobsByOrganizationDateCreatedIndex.items);
    }
  };
  React.useEffect(setJobsState, [query.data]);

  const fetchMore = () => {
    const variables = {
      after: query.data.queryKarmaJobsByOrganizationDateCreatedIndex.nextToken
    };

    const updateQuery = (previousQueryResult: IQueryResult, options: IFetchMoreOptions) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.queryKarmaJobsByOrganizationDateCreatedIndex.items = [
        ...previousQueryResult.queryKarmaJobsByOrganizationDateCreatedIndex.items,
        ...options.fetchMoreResult.queryKarmaJobsByOrganizationDateCreatedIndex.items
      ];

      return options.fetchMoreResult;
    };

    const fetchMoreOptions = { variables, updateQuery };
    query.fetchMore(fetchMoreOptions);
  };

  const breadcrumbs = [
    { primary: "Organizations", path: "/organizations" },
    {
      primary: organization.data ? organization.data.getKarmaOrganizations.name : "",
      path: "/organizations/" + organizationId
    },
    { primary: "Jobs" }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader title="Jobs" />
            <Divider />
            <List>
              {_.isUndefined(jobs) &&
                [1, 2, 3].map(value => (
                  <ListItem key={value} divider={true}>
                    <ListItemText primary={<Placeholder variant="text" />} />
                  </ListItem>
                ))}
              {!_.isUndefined(jobs) && _.isEmpty(jobs) && (
                <ListItem>
                  <ListItemText primary="No jobs to display" />
                </ListItem>
              )}
              {jobs &&
                jobs.map((job: IJob, index: number) => (
                  <ListItem
                    button={true}
                    divider={true}
                    key={index}
                    onClick={handleClick(`/organizations/${organizationId}/jobs/${job.id}`)}
                    id={`job-${job.id}`}
                  >
                    <ListItemText primary={job.title} />
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
        <Grid item={true} style={{ textAlign: "center" }}>
          {query.data && query.data.queryKarmaJobsByOrganizationDateCreatedIndex && (
            <Button
              color="primary"
              variant="outlined"
              disabled={!Boolean(query.data.queryKarmaJobsByOrganizationDateCreatedIndex.nextToken)}
              onClick={fetchMore}
              id={"load-more"}
            >
              Load More
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default JobList;
