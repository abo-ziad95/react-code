import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import React from "react";
import useReactRouter from "use-react-router";
import {GET_INVITATIONS} from "../../../graphql/invitations";
import {IconButton} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge/Badge";
import ListIcon from "@material-ui/icons/List";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";

interface IInvitation {
  [key: string]: string;
}

/**
 * InvitationCount component returns button with badge that shows number of pending invitations
 */
const InvitationCount  = () => {
  const { handleClick } = useHistoryPush();
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string };
  const organizationId = params.organizationId;
  const [invitationsCount, setInvitationsCount] = React.useState<number | undefined>();
  const invitationsQuery = useApolloQuery(GET_INVITATIONS);

  const getInvitationsData = () => {
    invitationsQuery.execute({ variables: { organization: organizationId }});
  };
  React.useEffect(getInvitationsData, []);

  const setInvitationsCountState = () => {
    if (invitationsQuery.data &&
      invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex &&
      invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex.items
    ) {
      setInvitationsCount(invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex.items.filter(
        (item: IInvitation) => item.status === "pending").length);
    }
  };
  React.useEffect(setInvitationsCountState, [invitationsQuery.data &&
  invitationsQuery.data.queryKarmaInvitationsByOrganizationEmailIndex.items.length]);

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick(`/organizations/${organizationId}/members/invitations/`)}
        id={"list-of-invitations"}
      >
        <Tooltip title="Show List of Invitations">
          <Badge max={19} color={"primary"} badgeContent={invitationsCount}>
            <ListIcon />
          </Badge>
        </Tooltip>
      </IconButton>
    </React.Fragment>
  );
};

export default InvitationCount;
