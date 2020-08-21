import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { IResume } from "../../../types";
import { Delete, Download } from "./action";
import Confirmation from "./dialog";

interface IResumeList {
  open: boolean;
  resume?: IResume;
  resumes: IResume[];
  handleOpen: (
    resume?: IResume
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleClose: () => void;
  handleDelete: (resumeId?: string) => (event: React.MouseEvent) => void;
}

/**
 * A React Functional Component that displays the candidates saved resumes
 */

const ResumeList: React.FC<IResumeList> = props => {
  return (
    <List>
      {props.resumes.map((resume, index) => (
        <ListItem divider={true} key={index}>
          <ListItemText primary={resume.name} />
          <ListItemIcon>
            <Download resume={resume} />
          </ListItemIcon>
          <ListItemIcon>
            <Delete handleOpen={props.handleOpen} resume={resume} />
          </ListItemIcon>
        </ListItem>
      ))}
      <Confirmation
        open={props.open}
        message={`Are you sure you want to delete ${props.resume &&
          props.resume.name}?`}
        resume={props.resume}
        handleOpen={props.handleOpen}
        handleClose={props.handleClose}
        handleDelete={props.handleDelete}
      />
    </List>
  );
};

export default ResumeList;
