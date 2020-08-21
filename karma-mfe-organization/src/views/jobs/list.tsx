import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import { Badge } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Add";
import PeopleIcon from "@material-ui/icons/People";
import _ from "lodash";
import React, { useState } from "react";
import { OrganizationContext } from "../../context/organization";
import { GET_JOBS } from "../../graphql/jobs";
import { ICandidate } from "../candidates/board";

export interface IJob {
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

const Actions: React.FC = () => {
  const { handleClick } = useHistoryPush();

  return (
    <React.Fragment>
      <IconButton id="create-job-btn" onClick={handleClick(`/jobs/create`)}>
        <Tooltip title="Create Job">
          <EditIcon color="primary" />
        </Tooltip>
      </IconButton>
    </React.Fragment>
  );
};
/**
 * JobList component return list of jobs
 */
const JobList: React.FC = () => {
  const organization = React.useContext(OrganizationContext);
  const { handleClick } = useHistoryPush();
  const jobsQuery = useApolloQuery(GET_JOBS);
  const [jobs, setJobs] = React.useState<undefined | IResults>();
  const [name, setName] = useState();

  const effect = () => {
    if (organization.state) {
      const options = {
        variables: { organization: organization.state.id }
      };
      jobsQuery.execute(options);
      setName(organization.state.name);
    }
  };
  React.useEffect(effect, [organization.state]);

  const setJobsState = () => {
    if (
      jobsQuery.data &&
      jobsQuery.data.queryKarmaJobsByOrganizationDateCreatedIndex &&
      jobsQuery.data.queryKarmaJobsByOrganizationDateCreatedIndex.items
    ) {
      setJobs(jobsQuery.data.queryKarmaJobsByOrganizationDateCreatedIndex);
    }
  };
  React.useEffect(setJobsState, [jobsQuery.data]);

  const fetchMore = () => {
    const variables = {
      after:
        jobsQuery.data.queryKarmaJobsByOrganizationDateCreatedIndex.nextToken
    };

    const updateQuery = (
      previousQueryResult: IQueryResult,
      options: IFetchMoreOptions
    ) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.queryKarmaJobsByOrganizationDateCreatedIndex.items = [
        ...previousQueryResult.queryKarmaJobsByOrganizationDateCreatedIndex
          .items,
        ...options.fetchMoreResult.queryKarmaJobsByOrganizationDateCreatedIndex
          .items
      ];

      return options.fetchMoreResult;
    };
    jobsQuery.fetchMore({ variables, updateQuery });
  };

  const breadcrumbs = [
    { primary: name ? name : <Placeholder variant="text" />, path: "/" },
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
            <CardHeader title="Jobs" action={organization && <Actions />} />
            <Divider />
            <CardContent>
              <List id="candidates-list">
                {_.isUndefined(jobs) &&
                  [1, 2, 3].map(value => (
                    <ListItem key={value} divider={true}>
                      <ListItemText primary={<Placeholder variant="text" />} />
                    </ListItem>
                  ))}

                {jobs && jobs.items && !jobs.items.length && (
                  <ListItem>
                    <ListItemText primary="No jobs to display" />
                  </ListItem>
                )}

                {jobs &&
                  jobs.items.map((job: IJob, index: number) => {
                    const badgeContent = job.candidates.filter(
                      (candidate: ICandidate) =>
                        candidate.status !== "apply" &&
                        candidate.status !== "denied"
                    );
                    if (job.status === "Deleted") {
                      // This should be done in the query
                      return null;
                    }

                    return (
                      <ListItem
                        id={`list${index}`}
                        button={true}
                        divider={true}
                        key={index}
                      >
                        <ListItemText
                          id={`job-item`}
                          primary={job.title}
                          onClick={handleClick(`/jobs/${job.id}`)}
                        />
                        <IconButton
                          onClick={handleClick(`/jobs/${job.id}/candidates`)}
                        >
                          <Badge
                            max={19}
                            badgeContent={badgeContent.length}
                            color="primary"
                          >
                            <Tooltip title="View Applicants">
                              <PeopleIcon />
                            </Tooltip>
                          </Badge>
                        </IconButton>
                      </ListItem>
                    );
                  })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          item={true}
          style={{ textAlign: "center" }}
        >
          {jobs && (
            <Button
              color="primary"
              variant="outlined"
              disabled={!Boolean(jobs.nextToken)}
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

export default JobList;
