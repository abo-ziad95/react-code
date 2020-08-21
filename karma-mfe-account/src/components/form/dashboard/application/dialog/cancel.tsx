import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";

interface IDialog {
  open: boolean;
  message: string;
  handleClose(): void;
  handleSubmit(event: React.MouseEvent): void;
}

/**
 * A React Functional Component that notifies the user if their selection is correct
 * @param props Properties passed in by the parent component
 */

const CancelInterview: React.FC<IDialog> = props => {
  return (
    <Dialog onClose={props.handleClose} open={props.open}>
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={props.handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={props.handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelInterview