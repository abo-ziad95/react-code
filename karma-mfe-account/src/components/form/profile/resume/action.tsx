import { createStyles, makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Cancel";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import Tooltip from "@material-ui/core/Tooltip";
import { Storage } from "aws-amplify";
import React from "react";
import { IResume } from "../../../types";

interface IDownload {
  resume?: IResume;
}

interface IDelete {
  resume?: IResume;
  handleOpen: (
    resume?: IResume
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteIcon: {
      color: theme.palette.secondary.main,
      fontSize: theme.spacing(3)
    },
    downloadIcon: {
      color: theme.palette.primary.main,
      fontSize: theme.spacing(3.5)
    }
  })
);

export const Download: React.FC<IDownload> = props => {
  const classes = useStyles({});
  const resumeFile = props.resume && props.resume.file;

  const handleResumeView = async () => {
    if (!resumeFile) {
      return;
    }
    const file = await Storage.get(resumeFile);
    window.open(file as string, "_blank");
  };

  return (
    <IconButton onClick={handleResumeView}>
      <Tooltip title="Download Resume">
        <DownloadIcon className={classes.downloadIcon} />
      </Tooltip>
    </IconButton>
  );
};

export const Delete: React.FC<IDelete> = props => {
  const classes = useStyles({});
  const resume = props.resume;

  return (
    <IconButton onClick={props.handleOpen(resume)}>
      <Tooltip title="Delete Resume">
        <DeleteIcon className={classes.deleteIcon} />
      </Tooltip>
    </IconButton>
  );
};
