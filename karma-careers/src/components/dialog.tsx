import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";

interface IProps {
  body: React.ReactNode;
  open: boolean;
  title: React.ReactNode;
  handleCancel?: () => void;
  handleConfirm?: () => void;
}

/**
 * React Function Component that renders
 * Material-UI Dialog
 * @param props React Function Component parameters
 */

const MuiDialog = (props: IProps) => {
  const [open, setOpen] = React.useState(props.open);

  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const toggleOpen = () => {
    if (props.handleCancel) {
      props.handleCancel();
    }
    setOpen(!open);
  };

  const handleConfirm = () => {
    if (props.handleConfirm) {
      props.handleConfirm();
    }
    toggleOpen();
  };

  return (
    <Dialog open={open} onClose={toggleOpen}>
      <DialogTitle className="capitalize">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.body}</DialogContentText>
      </DialogContent>
      {!props.handleConfirm && (
        <DialogActions>
          <Button color="primary" onClick={toggleOpen}>
            Close
          </Button>
        </DialogActions>
      )}
      {props.handleConfirm && (
        <DialogActions>
          <Button color="primary" onClick={toggleOpen}>
            Close
          </Button>
          <Button color="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MuiDialog;
