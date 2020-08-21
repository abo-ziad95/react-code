import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { IApplication } from "../../../types";
import { View, Withdraw } from "./actions";
import WithdrawApplication from "./dialog";

interface IAppList {
  application?: IApplication;
  applications: IApplication[];
  open: boolean;
  handleClose: () => void;
  handleDelete: (
    application?: IApplication
  ) => (event: React.MouseEvent) => void;
  handleOpen: (
    application?: IApplication
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * A React Functional Component that displays a list of all the jobs a candidate has applied for in table format
 * @param props Properties passed in by parent component
 */

const ApplicationsList: React.FC<IAppList> = props => {
  return (
    <Card>
      <CardHeader title="Applications" />
      <Divider />
      <CardContent>
        <List>
          {props.applications.map((application, index) => (
            <ListItem key={index} divider={true} id="application-list-item">
              <ListItemText
                primary={application.job.organization.name}
                secondary={application.job.title}
              />
              <ListItemIcon>
                <View application={application} />
              </ListItemIcon>
              <ListItemIcon>
                <Withdraw
                  application={application}
                  handleOpen={props.handleOpen}
                />
              </ListItemIcon>
            </ListItem>
          ))}
          <WithdrawApplication
            application={props.application}
            handleClose={props.handleClose}
            handleDelete={props.handleDelete}
            message={`Are you sure you want to Withdraw the application for ${props.application &&
              props.application.job.title}?`}
            open={props.open}
          />
        </List>
      </CardContent>
    </Card>
  );
};

export default ApplicationsList;
