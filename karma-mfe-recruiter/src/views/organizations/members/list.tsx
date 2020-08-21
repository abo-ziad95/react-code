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
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";
import React from "react";
import useReactRouter from "use-react-router";
import AddInvitation from "../../../components/organizations/invitations/addInvitation";
import {GET_ORGANIZATION, GET_ORGANIZATION_MEMBERS} from "../../../graphql/organization";
import InvitationCount from "../../../components/organizations/invitations/invitationCount";
import MemberStatus from "../../../components/organizations/members/memberStatus";

interface IMember {
  [key: string]: any;
}
interface IOrganization {
  [key: string]: any;
}
interface IResults {
  items: IMember[];
  nextToken?: string;
}
interface IQueryResult {
  queryKarmaMembersByOrganizationUserIndex: IResults;
}
interface IFetchMoreOptions {
  fetchMoreResult?: IQueryResult;
  variables?: Record<string, any> | undefined;
}
/**
 * Actions component returns Add invitation and InvitationCount buttons
 */
const Actions: React.FC = () => {
  return (
    <React.Fragment>
      <InvitationCount/>
      <AddInvitation/>
    </React.Fragment>
  );
};
/**
 * MembersList component renders list of members for specific organization
 */
const MembersList: React.FC = () => {
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string };
  const organizationId = params.organizationId;
  const membersQuery = useApolloQuery(GET_ORGANIZATION_MEMBERS);
  const organizationsQuery = useApolloQuery(GET_ORGANIZATION);
  const [members, setMembers] = React.useState<IMember[] | undefined>();
  const [organization, setOrganization] = React.useState<IOrganization | undefined>();

  const getMembersData = () => {
    const variables = {
      organization: organizationId
    };
    membersQuery.execute({ variables });
    organizationsQuery.execute({ variables: { id: organizationId } });
  };
  React.useEffect(getMembersData, []);

  const setMembersState = () => {
    if (membersQuery.data && membersQuery.data.queryKarmaMembersByOrganizationUserIndex &&
        membersQuery.data.queryKarmaMembersByOrganizationUserIndex.items
    ) {
      setMembers(membersQuery.data.queryKarmaMembersByOrganizationUserIndex.items);
    }
  };
  React.useEffect(setMembersState, [membersQuery.data]);

  const setOrganizationsState = () => {
    if (organizationsQuery.data && organizationsQuery.data.getKarmaOrganizations) {
      setOrganization(organizationsQuery.data.getKarmaOrganizations);
    }
  };
  React.useEffect(setOrganizationsState, [organizationsQuery.data]);

  const fetchMore = () => {
    const variables = {
      after: membersQuery.data.queryKarmaMembersByOrganizationUserIndex.nextToken
    };

    const updateQuery = (previousQueryResult: IQueryResult, options: IFetchMoreOptions) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.queryKarmaMembersByOrganizationUserIndex.items = [
        ...previousQueryResult.queryKarmaMembersByOrganizationUserIndex.items,
        ...options.fetchMoreResult.queryKarmaMembersByOrganizationUserIndex.items
      ];

      return options.fetchMoreResult;
    };

    const fetchMoreOptions = { variables, updateQuery };
    membersQuery.fetchMore(fetchMoreOptions);
  };

  const breadcrumbs = [
    { primary: "Organizations", path: "/organizations" },
    { primary: organization && organization.name ? organization.name : "", path: "/organizations/" + organizationId },
    { primary: "Members" }
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
              title="Members"
              action={members ? (<Actions/>) : (
                <Placeholder variant="circle" height={48} width={48} style={{marginLeft: 12}}/>
              )}
            />
            <Divider/>
            <List>
              {_.isUndefined(members) &&
              [1, 2, 3].map(value => (
                <ListItem key={value} divider={true}>
                  <ListItemText primary={<Placeholder variant="text"/>}/>
                </ListItem>
              ))}
              {_.isEmpty(members) && !membersQuery.loading && (
                <ListItem>
                  <ListItemText primary="No members to display"/>
                </ListItem>
              )}
              {members && members.map((member: IMember, index: number) => (
                <ListItem button={false} divider={true} key={index} id={`member-${member.id}`}>
                  <ListItemText primary={member.user.full_name}/>
                  <MemberStatus member={member}/>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid item={true} style={{textAlign: "center"}}>
          {membersQuery.data && membersQuery.data.queryKarmaMembersByOrganizationUserIndex &&
          <Button
              color="primary"
              variant="outlined"
              disabled={!Boolean(membersQuery.data.queryKarmaMembersByOrganizationUserIndex.nextToken)}
              onClick={fetchMore}
              id={"load-more"}
          >
              Load More
          </Button>
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default MembersList;
