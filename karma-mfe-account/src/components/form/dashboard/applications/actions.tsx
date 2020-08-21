import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import React from "react";
import { IApplication } from "../../../types";

interface IView {
  application?: IApplication;
}

interface IDelete {
  application?: IApplication;
  handleOpen: (
    application?: IApplication
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cancelIcon: {
      color: theme.palette.secondary.light,
      fontSize: theme.spacing(3)
    },
    viewIcon: {
      color: theme.palette.primary.light,
      fontSize: theme.spacing(3.5)
    }
  })
);

export const View: React.FC<IView> = props => {
  const { handleClick } = useHistoryPush();
  const applicationId = props.application && props.application.id;
  const classes = useStyles({});

  return (
    <Tooltip title="View Application">
      <IconButton
        id="application-view-button"
        onClick={handleClick(`/application/${applicationId}/status`)}
      >
        <EyeIcon className={classes.viewIcon} />
      </IconButton>
    </Tooltip>
  );
};

export const Withdraw: React.FC<IDelete> = props => {
  const classes = useStyles({});
  const application = props.application;

  return (
    <Tooltip title="Withdraw Application">
      <IconButton
        id="application-withdraw-button"
        onClick={props.handleOpen(application)}
      >
        <CancelIcon className={classes.cancelIcon} />
      </IconButton>
    </Tooltip>
  );
};
