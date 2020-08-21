import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import { MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu/Menu";
import React from "react";
import { UPDATE_INVITATION } from "../../graphql/members";
import { IInvitation } from "../../views/members/invitations";

interface IProps {
  invitation: IInvitation;
}
/**
 * InvitationStatus component returns Invitation status info
 * with menu button to change status
 */
const InvivationStatus: React.FC<IProps> = props => {
  const [anchorEl, setAnchorEl] = React.useState();
  const notification = React.useContext(NotificationContext);
  const updateInvitation = useApolloMutation(UPDATE_INVITATION);

  const updateInvitationEffect = () => {
    if (updateInvitation.data) {
      notification.dispatch({
        payload: {
          message: "Invitation has been updated"
        },
        type: "ADD_NOTIFICATION",
      });
    }
  };
  React.useEffect(updateInvitationEffect, [updateInvitation.data]);

  const handleOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (status: string) => () => {
    setAnchorEl(null);
    const variables = {
      input: { id: props.invitation.id, status }
    };
    updateInvitation.execute({ variables });
  };

  return (
    <React.Fragment>
      <Button id="handleMenu" color="primary" size="small" onClick={handleOpen}>
        {props.invitation.status}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem id='pending' onClick={handleClick("Pending")}>Pending</MenuItem>
        <MenuItem id='accepted' onClick={handleClick("Accepted")}>Accepted</MenuItem>
        <MenuItem id='revoked' onClick={handleClick("revoked")}>Revoked</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default InvivationStatus;
