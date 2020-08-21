import {AlertsContext} from "@hatech/karma-core/context/alerts";
import {NotificationContext} from "@hatech/karma-core/context/notifications";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import {IconButton} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import React from "react";
import useReactRouter from "use-react-router";
import uuid from "uuid";
import {CREATE_TRANSACTION, GET_TRANSACTIONS} from "../../graphql/transactions";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";

/**
 * AddPoints component return Dialog window with input to add points to specific organization
 */
const AddPoints: React.FC = () => {
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string };
  const organizationId = params.organizationId;
  const alerts = React.useContext(AlertsContext);
  const notification = React.useContext(NotificationContext);
  const [open, setOpen] = React.useState(false);
  const points = useTextField("points", "Points");
  const variables = {
    organization: organizationId,
    first: 1000
  };
  const input = {
    id: uuid.v4(),
    date_created: moment()
        .utc(false)
        .format("YYYY-MM-DDTHH:mm:ssZ"),
    organization: organizationId,
    type: "credit",
    amount: Number(points.value)
  };
  const refetchQuery = () => [{query: GET_TRANSACTIONS, variables: variables}];
  const createTransaction = useApolloMutation(CREATE_TRANSACTION, {refetchQueries: refetchQuery()});

  const effect = () => {
    if (createTransaction.data) {
      handleClose();
      notification.dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "Points have been added"
        }
      });
    }
  };
  React.useEffect(effect, [createTransaction.data]);

  const errorMessage = () => {
    if (createTransaction.error) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          body: createTransaction.error.message
        }
      });
    }
  };
  React.useEffect(errorMessage, [createTransaction.error]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
    await createTransaction.execute({ variables });
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleOpen} id="add-points">
        <Tooltip title="Add Points">
          <AddIcon color="primary" />
        </Tooltip>
      </IconButton>
      <Dialog onClose={handleClose} open={open}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Points</DialogTitle>
          <DialogContent>
            <TextField
              {...points.attributes}
              autoFocus={true}
              type="number"
              InputLabelProps={{ shrink: true }}
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

export default AddPoints;
