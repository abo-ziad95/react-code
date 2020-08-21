import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { IResume } from "../../../types";

interface IDialog {
  open: boolean;
  message: string;
  resume?: IResume;
  handleOpen: (
    resume: IResume
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete: (resumeId?: string) => (event: React.MouseEvent) => void;
  handleClose: () => void;
}

/**
 * A React Functional Component that notifies the user if their selection is correct
 * @param props Properties passed in by the parent component
 */

const Confirmation: React.FC<IDialog> = props => {
  const resumeId = props.resume && props.resume.id;
  return (
    <Dialog onClose={props.handleOpen} open={props.open}>
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
          onClick={props.handleDelete(resumeId)}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirmation
