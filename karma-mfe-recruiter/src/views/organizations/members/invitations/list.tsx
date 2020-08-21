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
import {GET_INVITATIONS} from "../../../../graphql/invitations";
import {GET_ORGANIZATION} from "../../../../graphql/organization";
import InvitationStatus from "../../../../components/organizations/invitations/invitationStatus";

interface IInvitation {
  [key: string]: string;
}
interface IOrganization {
  [key: string]: any;
}
interface IResults {
  items: IInvitation[];
  nextToken?: string;
}
interface IQueryResult {
  queryKarmaInvitationsByOrganizationEmailIndex: IResults;
}
interface IFetchMoreOptions {
  fetchMoreResult?: IQueryResult;
  variables?: Record<string, any> | undefined;
}

/**
 * InvitationsList component renders list of invitations for specific organization
 */
const InvitationsList: React.FC = () => {
  const {match} = useReactRouter();
  const params = match.params as { organizationId: string };
  const organizationId = params.organizationId;
  const invitationsQuery = useApolloQuery(GET_INVITATIONS);
  const organizationsQuery = useApolloQuery(GET_ORGANIZATION);
  const [invitations, setInvitations] = React.useState<IInvitation[] | undefined>();
  const [organization, setOrganization] = React.useState<IOrganization | undefined>();
  const variables = {
    organization: organizationId
  };

  const getInvitationsData = () => {
    invitationsQuery.execute({variables});
    organizationsQuery.execute({variables: {id: organizationId}});
  };
  React.useEffect(getInvitationsData, []);

  const setInvitationsState = () => {
    if (invitationsQuery.data &&
      invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex &&
      invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex.items
    ) {
      setInvitations(invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex.items);
    }
  };
  React.useEffect(setInvitationsState, [invitationsQuery.data &&
  invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex.items.filter(
    (item: IInvitation) => item.status === "pending").length]);

  const setOrganizationsState = () => {
    if (organizationsQuery.data && organizationsQuery.data.getKarmaOrganizations) {
      setOrganization(organizationsQuery.data.getKarmaOrganizations);
    }
  };
  React.useEffect(setOrganizationsState, [organizationsQuery.data]);

  const fetchMore = () => {
    const variables = {
      after: invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex.nextToken
    };

    const updateQuery = (previousQueryResult: IQueryResult, options: IFetchMoreOptions) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.queryKarmaInvitationsByOrganizationEmailIndex.items = [
        ...previousQueryResult.queryKarmaInvitationsByOrganizationEmailIndex.items,
        ...options.fetchMoreResult.queryKarmaInvitationsByOrganizationEmailIndex.items
      ];

      return options.fetchMoreResult;
    };

    const fetchMoreOptions = {variables, updateQuery};
    invitationsQuery.fetchMore(fetchMoreOptions);
  };

  const breadcrumbs = [
    {primary: "Organizations", path: "/organizations"},
    {primary: organization && organization.name ? organization.name : "", path: "/organizations/" + organizationId},
    {primary: "Members", path: "/organizations/"+ organizationId +"/members"},
    {primary: "Invitations"}
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader
              title="Invitations"/>
            <Divider/>
            <List>
              {_.isUndefined(invitations) &&
              [1, 2, 3].map(value => (
                <ListItem key={value} divider={true}>
                  <ListItemText primary={<Placeholder variant="text"/>}/>
                </ListItem>
              ))}
              {_.isEmpty(invitations && invitations.filter((invitation: IInvitation) =>
                invitation.status === "pending")) && !invitationsQuery.loading && (
                <ListItem>
                  <ListItemText primary="No invitations to display"/>
                </ListItem>
              )}
              {!_.isEmpty(invitations && invitations.filter((invitation: IInvitation) =>
                invitation.status === "pending")) && (
                <ListItem divider={true}>
                  <ListItemText primary={"Email"}/>
                </ListItem>
              )}
              {invitations && invitations.map((invitation: IInvitation, index: number) => {
                if (invitation.status !== "pending") {
                  return null;
                } else {
                  return (
                    <ListItem divider={true} key={index}>
                      <ListItemText primary={invitation.email}/>
                      <InvitationStatus index={index} invitation={invitation}/>
                    </ListItem>
                  );
                }
              })}
            </List>
          </Card>
        </Grid>
        <Grid item={true} style={{textAlign: "center"}}>
          {invitationsQuery.data && invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex &&
          <Button color="primary" variant="outlined"
                  disabled={!Boolean(
                    invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex.nextToken)}
                  onClick={fetchMore}>
              Load More
          </Button>
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default InvitationsList;
