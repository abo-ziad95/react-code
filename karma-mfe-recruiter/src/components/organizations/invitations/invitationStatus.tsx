import {NotificationContext} from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import useReactRouter from "use-react-router";
import {GET_INVITATIONS, UPDATE_INVITATION} from "../../../graphql/invitations";

interface IAnchorEl {
  index?: number | null;
  anchorEl: any;
}
interface IInvitation {
  [key: string]: any;
}
interface IProps {
  index: number;
  invitation: IInvitation;
}
/**
 * InvitationStatus component returns Invitation status info
 * with menu button to change status
 */
const InvitationStatus: React.FC<IProps> = props => {
  const [anchorEl, setAnchorEl] = React.useState<IAnchorEl>({index: null, anchorEl: null});
  const notification = React.useContext(NotificationContext);
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string; jobId: string };
  const organizationId = params.organizationId;
  const variables = {
    organization: organizationId
  };
  const refetchQuery = () => [{query: GET_INVITATIONS, variables: variables}];
  const updateInvitation = useApolloMutation(UPDATE_INVITATION, {refetchQueries: refetchQuery()});

  const handleStatusChange = (id: string) => () => {
    const input = {
      id: id,
      status: "revoked"
    };

    const variables = { input };
    updateInvitation.execute({ variables: variables });
    setAnchorEl({index: null,  anchorEl: null});
  };

  const updateInvitationEffect = () => {
    if (updateInvitation.data) {
      notification.dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "Invitation has been updated"
        }
      });
    }
  };
  React.useEffect(updateInvitationEffect, [updateInvitation.data]);

  function handleClick(index: number | null, event: React.MouseEvent)
  {
    setAnchorEl({index: index,  anchorEl: event.currentTarget});
  }

  function handleClose() {
    setAnchorEl({index: null,  anchorEl: null});
  }

  return (
    <React.Fragment>
      <Button aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={(event) => handleClick(props.index, event)}
              color="primary"
              size="small"
              id={`invitation-status-${props.invitation.id}`}
      >
        {props.invitation.status}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl.anchorEl}
        open={Boolean(anchorEl.anchorEl) && anchorEl.index === props.index}
        keepMounted
        onClose={handleClose}
      >
        <MenuItem onClick={handleStatusChange(props.invitation.id)}
                  className="capitalize"
                  id={`invitation-status-withdraw-${props.invitation.id}`}
        >
          Withdraw invitation
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default InvitationStatus;
