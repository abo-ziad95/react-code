import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";
import React from "react";
import InvivationStatus from "../../components/members/invitationStatus";
import Invite from "../../components/members/invite";
import { OrganizationContext } from "../../context/organization";
import { GET_INVITATIONS } from "../../graphql/members";

export interface IInvitation {
  [key: string]: any;
}

interface IResults {
  items: IInvitation[];
  nextToken?: string;
}

interface IQueryResult {
  listKarmaInvitations: IResults;
}

interface IFetchMoreOptions {
  fetchMoreResult?: IQueryResult;
  variables?: Record<string, any> | undefined;
}

/**
 * InvitationsList component renders list of members for specific organization
 */
const InvitationsList: React.FC = () => {
  const organization = React.useContext(OrganizationContext);
  const query = useApolloQuery(GET_INVITATIONS);
  const [invitations, setInvitations] = React.useState<IInvitation[] | undefined>();

  const getInvitations = () => {
    if (organization.state) {
      const variables = {
        filter: { organization: { eq: organization.state.id } }
      };
      query.execute({ variables });
    }
  };
  React.useEffect(getInvitations, [organization.state]);

  const setInvitationsState = () => {
    if (query.data && query.data.listKarmaInvitations) {
      setInvitations(query.data.listKarmaInvitations.items);
    }
  };
  React.useEffect(setInvitationsState, [query.data]);

  const fetchMore = () => {
    if (organization.state) {
      const variables = {
        filter: { organization: { eq: organization.state.id } },
        nextToken: query.data.listKarmaInvitations.nextToken
      };
      const updateQuery = (previousQueryResult: IQueryResult, options: IFetchMoreOptions) => {
        if (!options.fetchMoreResult) {
          return previousQueryResult;
        }

        options.fetchMoreResult.listKarmaInvitations.items = [
          ...previousQueryResult.listKarmaInvitations.items,
          ...options.fetchMoreResult.listKarmaInvitations.items
        ];

        return options.fetchMoreResult;
      };
      query.fetchMore({ variables, updateQuery });
    }
  };

  const breadcrumbs = [
    { primary: organization.state ? organization.state.name : "", path: "/" },
    { primary: "Members", path: "/members" },
    { primary: "Invitations" }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader title="Invitations" action={<Invite />} />
            <Divider />
            <List>
              {_.isUndefined(invitations) &&
                [1, 2, 3].map(value => (
                  <ListItem key={value} divider={true}>
                    <ListItemText primary={<Placeholder variant="text" />} />
                  </ListItem>
                ))}

              {!_.isUndefined(invitations) && !invitations.length && (
                <ListItem>
                  <ListItemText primary="No invitations to display" />
                </ListItem>
              )}

              {invitations &&
                invitations.map((invitation, index) => {
                  if(invitation.status === "revoked") { return null }
                  else { return (
                    <ListItem divider={true} key={index}>
                      <ListItemText primary={invitation.email} />
                      <ListItemSecondaryAction>
                        <InvivationStatus invitation={invitation} />
                      </ListItemSecondaryAction>
                    </ListItem>
                    )
                  }
                  }
                )}
            </List>
          </Card>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={12} xl={12} item={true} style={{ textAlign: "center" }}>
          {query.data && query.data.listKarmaInvitations && (
            <Button
              color="primary"
              variant="outlined"
              id="loadMore"
              disabled={!Boolean(query.data.listKarmaInvitations.nextToken)}
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

export default InvitationsList;
