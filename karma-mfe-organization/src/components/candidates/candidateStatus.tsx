import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import {IconButton, MenuItem} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Menu from "@material-ui/core/Menu/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {UPDATE_CANDIDATE} from "../../graphql/candidates";
import {ICandidate} from "../../views/candidates/board";
interface IProps {
  candidate: ICandidate;
}

/**
 * CandidateStatus component renders menu with tow options deny candidate or view profile
 */

const CandidateStatus: React.FC<IProps> = props => {
  const [anchorEl, setAnchorEl] = React.useState();
  const notification = React.useContext(NotificationContext);
  const updateStatus = useApolloMutation(UPDATE_CANDIDATE);
  const [open, setOpen] = React.useState(false);
  const { handleClick } = useHistoryPush();

  const updateStatusEffect = () => {
    if (updateStatus.data) {
      notification.dispatch({
        payload: {
          message: "Status has been updated"
        },
        type: "ADD_NOTIFICATION",
      });
    }
  };
  React.useEffect(updateStatusEffect, [updateStatus.data]);

  const warningMessage = () => {
    if (updateStatus.data) {
      notification.dispatch({
        payload: {
          message: "Status has been updated"
        },
        type: "ADD_NOTIFICATION",
      });
    }
  };
  React.useEffect(warningMessage, [updateStatus.data]);

  const handleOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setAnchorEl(null);
  };
  const handleSubmit = (status: string) => async (event: React.FormEvent) => {
    event.preventDefault();
    const variables = {
      input: {
        id: props.candidate.id,
        status
      }
    };
    handleCloseDialog();
    await updateStatus.execute({ variables });
  };

  return (
    <React.Fragment>
      <IconButton id="handleMenu" color="primary" size="small" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClick(`${props.candidate.id}`)}>View Profile</MenuItem>
        <MenuItem id="deny-candidate" onClick={handleOpenDialog} value={"Denied"}>Deny Candidate</MenuItem>
      </Menu>
      <Dialog onClose={handleCloseDialog} open={open}>
        <form onSubmit={handleSubmit("Denied")}>
          <DialogTitle>Are you sure to deny this Candidate?</DialogTitle>
          <DialogActions>
            <Button color="primary" type="submit" id="submit">
              Yes
            </Button>
            <Button color="primary" id="cancel" onClick={handleCloseDialog}>
              No
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default CandidateStatus;
