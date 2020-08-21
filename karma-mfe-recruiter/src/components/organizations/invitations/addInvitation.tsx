import {AlertsContext} from "@hatech/karma-core/context/alerts";
import {NotificationContext} from "@hatech/karma-core/context/notifications";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";
import uuid from "uuid";
import useReactRouter from "use-react-router";
import {CREATE_INVITATION, GET_INVITATIONS} from "../../../graphql/invitations";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import {IconButton} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";

/**
 * AddInvitation component return Dialog window with email input to invite person in organization
 */
const AddInvitation  = () => {
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string };
  const organizationId = params.organizationId;
  const alerts = React.useContext(AlertsContext);
  const notification = React.useContext(NotificationContext);
  const email = useTextField("email", "Email");
  const [openDialog, setOpenDialog] = React.useState(false);
  const variables = {
    organization: organizationId
  };

  const input = {
    id: uuid.v4(),
    organization: organizationId,
    status: "pending",
    email: email.value,
    type: "member"
  };
  const refetchQuery = () => [{query: GET_INVITATIONS, variables: variables}];
  const createInvitation = useApolloMutation(CREATE_INVITATION, {refetchQueries: refetchQuery()});

  const effect = () => {
    if (createInvitation.data) {
      handleCloseDialog();
      notification.dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "Invitation has been created"
        }
      });
    }
  };

  React.useEffect(effect, [createInvitation.data]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!organizationId) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          body: "Unable to determine organization"
        }
      });
      return;
    }

    const variables = { input };
    createInvitation.execute({ variables });
  };

  const errorMessage = () => {
    if (createInvitation.error) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          body: createInvitation.error.message
        }
      });
    }
  };
  React.useEffect(errorMessage, [createInvitation.error]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleOpenDialog} id={"add-invitation"}>
        <Tooltip title="Add Invitation">
          <AddIcon/>
        </Tooltip>
      </IconButton>
      <Dialog onClose={handleCloseDialog} open={openDialog}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Invitation</DialogTitle>
          <DialogContent>
            <TextField
              {...email.attributes}
              autoFocus={true}
              type="email"
              InputLabelProps={{shrink: true}}
              required={true}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" type="submit" id="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default AddInvitation;
