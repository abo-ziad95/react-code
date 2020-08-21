import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import { ListItemSecondaryAction, Tooltip } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import ListIcon from "@material-ui/icons/List";
import _ from "lodash";
import React from "react";
import Invite from "../../components/members/invite";
import { OrganizationContext } from "../../context/organization";
import { GET_MEMBERS, UPDATE_MEMBER } from "../../graphql/members";

export interface IMember {
  [key: string]: any;
}

const Actions: React.FC = () => {
  const { handleClick } = useHistoryPush();
  return (
    <React.Fragment>
      <IconButton id="linkToInvitations" onClick={handleClick(`/members/invitations`)}>
        <Tooltip title="Show List of Invitations">
          <ListIcon />
        </Tooltip>
      </IconButton>
      <Invite />
    </React.Fragment>
  );
};
/**
 * Members component return list of Members
 * Switch component changes the status of member
 */
const Members: React.FC = () => {
  const organization = React.useContext(OrganizationContext);
  const query = useApolloQuery(GET_MEMBERS);
  const updateMember = useApolloMutation(UPDATE_MEMBER);
  const [members, setMembers] = React.useState<IMember[] | undefined>();

  const getMembers = () => {
    if (organization.state) {
      const variables = { organization: organization.state.id };
      query.execute({ variables });
    }
  };
  React.useEffect(getMembers, [organization.state]);

  const setMembersState = () => {
    if (query.data && query.data.queryKarmaMembersByOrganizationUserIndex) {
      setMembers(query.data.queryKarmaMembersByOrganizationUserIndex.items);
    }
  };
  React.useEffect(setMembersState, [query.data]);

  const handleChange = (member: IMember) => () => {
    if (!organization.state) {
      return;
    }
    const status = member.status === "active" ? "inactive" : "active";
    const input = { id: member.id, status };
    const variables = { input };
    updateMember.execute({ variables });
  };

  const breadcrumbs = [
    { primary: organization.state ? organization.state.name : "", path: "/" },
    { primary: "Members" }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader title="Members" action={<Actions />} />
            <Divider />
            <CardContent>
              <List>
                {_.isUndefined(members) &&
                  [1, 2, 3].map(value => (
                    <ListItem key={value} divider={true}>
                      <ListItemText primary={<Placeholder variant="text" />} />
                    </ListItem>
                  ))}
                {!_.isUndefined(members) && !members.length && (
                  <ListItem>
                    <ListItemText primary="No members to display" />
                  </ListItem>
                )}
                {members &&
                  members.map((member, index) => (
                    <ListItem divider={true} key={index}>
                      <ListItemText primary={member.user.full_name} secondary={member.status} />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={member.status === "active"}
                          color="primary"
                          onClick={handleChange(member)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Members;
