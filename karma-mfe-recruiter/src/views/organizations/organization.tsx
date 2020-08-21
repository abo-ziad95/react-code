import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import {NotificationContext} from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import PeopleIcon from "@material-ui/icons/People";
import WorkIcon from "@material-ui/icons/Work";
import React from "react";
import useReactRouter from "use-react-router";
import OrganizationStatus from "../../components/organizations/status";
import TransactionsList from "../../components/organizations/transactions";
import {GET_JOBS} from "../../graphql/jobs";
import {GET_ORGANIZATION, GET_ORGANIZATION_MEMBERS, UPDATE_ORGANIZATION} from "../../graphql/organization";

interface IProps {
  jobsCount?: number;
  membersCount?: number;
}
interface IOrganization {
  [key: string]: any;
}
/**
 * Actions component return icon buttons with links
 */
const Actions: React.FC<IProps> = props => {
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string; jobId: string };
  const id = params.organizationId;
  const { handleClick } = useHistoryPush();

  return (
    <React.Fragment>
      <OrganizationStatus />
      <IconButton onClick={handleClick(`/organizations/${id}/members/`)} id={"view-members"}>
        <Tooltip title="View Members">
          <Badge badgeContent={props.membersCount} max={19} color={"primary"}>
            <PeopleIcon />
          </Badge>
        </Tooltip>
      </IconButton>
      <IconButton onClick={handleClick(`/organizations/${id}/jobs/`)} id={"view-jobs"}>
        <Tooltip title="View Jobs">
          <Badge badgeContent={props.jobsCount} max={19} color={"primary"}>
            <WorkIcon />
          </Badge>
        </Tooltip>
      </IconButton>
    </React.Fragment>
  );
};

/**
 * Organization component return organization info
 * Contains Actions component with button link to see all jobs and all members for this organization,
 * includes menu to change status
 */
const Organization = () => {
  const notification = React.useContext(NotificationContext);
  const {match} = useReactRouter();
  const params = match.params as { organizationId: string; jobId: string };
  const organizationId = params.organizationId;
  const organizationsQuery = useApolloQuery(GET_ORGANIZATION);
  const jobsQuery = useApolloQuery(GET_JOBS);
  const membersQuery = useApolloQuery(GET_ORGANIZATION_MEMBERS);
  const updateOrganization = useApolloMutation(UPDATE_ORGANIZATION);
  const [organization, setOrganization] = React.useState<IOrganization | undefined>();
  const [jobsCount, setJobsCount] = React.useState<number | undefined>();
  const [membersCount, setMembersCount] = React.useState<number | undefined>();

  const getOrganizationsData = () => {
    const variables = {variables: {id: organizationId}};
    organizationsQuery.execute(variables);
    jobsQuery.execute({variables: {organization: organizationId}});
    membersQuery.execute({variables: {organization: organizationId}});
  };
  React.useEffect(getOrganizationsData, []);

  const setOrganizationsState = () => {
    if (organizationsQuery.data && organizationsQuery.data.getKarmaOrganizations) {
      setOrganization(organizationsQuery.data.getKarmaOrganizations);
    }
  };
  React.useEffect(setOrganizationsState, [organizationsQuery.data]);

  const setJobsCountState = () => {
    if (jobsQuery.data && jobsQuery.data.queryKarmaJobsByOrganizationDateCreatedIndex &&
        jobsQuery.data.queryKarmaJobsByOrganizationDateCreatedIndex.items
    ) {
      setJobsCount(jobsQuery.data.queryKarmaJobsByOrganizationDateCreatedIndex.items.length);
    }
  };
  React.useEffect(setJobsCountState, [jobsQuery.data]);

  const setMembersCountState = () => {
    if (membersQuery.data && membersQuery.data.queryKarmaMembersByOrganizationUserIndex &&
        membersQuery.data.queryKarmaMembersByOrganizationUserIndex.items
    ) {
      setMembersCount(membersQuery.data.queryKarmaMembersByOrganizationUserIndex.items.length);
    }
  };
  React.useEffect(setMembersCountState, [membersQuery.data]);

  const updatedOrganizationEffect = () => {
    if (updateOrganization.data) {
      notification.dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "Organization has been updated"
        }
      });
    }
  };
  React.useEffect(updatedOrganizationEffect, [updateOrganization.data]);

  const breadcrumbs = [
    {primary: "Organizations", path: "/organizations"},
    {primary: organization && organization.name ? organization.name : ""}];

  return (
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader
                  title={
                    organization && organization.name ? organization.name :
                      organizationsQuery.loading ? <Placeholder variant="text"/> : ""
                    }
                  action={<Actions jobsCount={jobsCount} membersCount={membersCount}/>}
              />
              <Divider/>
              <CardContent>
                <List>
                  <ListItem divider={true}>
                    <ListItemIcon className={"list-item-first-column"}>
                      <ListItemText primary={"Address:"}/>
                    </ListItemIcon>
                    <ListItemText primary={organization && organization.address ?
                        organization.address : organizationsQuery.loading ? <Placeholder variant="text"/> : ""}/>
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemIcon className={"list-item-first-column"}>
                      <ListItemText primary={"City:"}/>
                    </ListItemIcon>
                    <ListItemText primary={organization && organization.city ?
                        organization.city : organizationsQuery.loading ? <Placeholder variant="text"/> : ""}/>
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemIcon className={"list-item-first-column"}>
                      <ListItemText primary={"State:"}/>
                    </ListItemIcon>
                    <ListItemText primary={organization && organization.state ?
                        organization.state : organizationsQuery.loading ? <Placeholder variant="text"/> : ""}/>
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemIcon className={"list-item-first-column"}>
                      <ListItemText primary={"ZIP:"}/>
                    </ListItemIcon>
                    <ListItemText primary={organization && organization.zip ?
                        organization.zip : organizationsQuery.loading ? <Placeholder variant="text"/> : ""}/>
                  </ListItem>
                </List>
              </CardContent>
              <Divider/>
            </Card>
          </Grid>
        </Grid>
        <Divider/>
        <TransactionsList/>
      </div>
  );
};

export default Organization;