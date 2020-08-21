import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { IApplication } from "../../../types";

interface IDialog {
  open: boolean;
  message: string;
  application?: IApplication;
  handleDelete: (
    application?: IApplication
  ) => (event: React.MouseEvent) => void;
  handleClose: () => void;
}

/**
 * A React Functional Component that notifies the user if the item they're interacting with is correct
 * @param props Properties passed in by the parent component
 */

const WithdrawApplication: React.FC<IDialog> = props => {
  return (
    <Dialog onClose={props.handleClose} open={props.open}>
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id="dialog-cancel-button"
          variant="outlined"
          color="secondary"
          size="small"
          onClick={props.handleClose}
        >
          Cancel
        </Button>
        <Button
          id="dialog-submit-button"
          variant="outlined"
          color="primary"
          size="small"
          onClick={props.handleDelete(props.application)}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WithdrawApplication
