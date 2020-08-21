import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton/IconButton";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import uuid from "uuid";
import { OrganizationContext } from "../../context/organization";
import { GET_INVITATIONS, INVITE_MEMBER } from "../../graphql/members";

/**
 * Invite component renders text field to invite member via email
 * effect handle Alert message if Member invitation sent
 */

const Invite: React.FC = () => {
  const organization = React.useContext(OrganizationContext);
  const notification = React.useContext(NotificationContext);
  const emailTextField = useTextField("email", "Email");
  const refetchQuery = () => [{query: GET_INVITATIONS, variables: {
      filter: { organization: { eq: organization.state ? organization.state.id : ''} }
    }}];
  const inviteMember = useApolloMutation(INVITE_MEMBER, {refetchQueries: refetchQuery()});
  const [open, setOpen] = React.useState(false);

  const effect = () => {
    if (inviteMember.data && organization.state) {
      notification.dispatch({
        payload: {
          message: "Member invitation sent"
        },
        type: "ADD_NOTIFICATION",
      });
    }
  };
  React.useEffect(effect, [inviteMember.data]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    handleClose();
    if (!organization.state) {
      return;
    }

    if(emailTextField.value && emailTextField.value.length){
      const input = {
        email: emailTextField.value,
        id: uuid.v4(),
        organization: organization.state.id,
        status: "pending",
      };
      const variables = { input };
      inviteMember.execute({ variables });
    }
  };

  return (
    <React.Fragment>
      <IconButton id="addInvitation" title="Add Invitation" onClick={handleOpen}>
        <Tooltip title="Add Invitation">
          <AddIcon color="primary" />
        </Tooltip>
      </IconButton>
      <Dialog onClose={handleClose} open={open}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Invite member</DialogTitle>
          <DialogContent>
            <TextField {...emailTextField.attributes} autoFocus={true} type="email" />
          </DialogContent>
          <DialogActions>
            <Button id="submit" type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default Invite;
