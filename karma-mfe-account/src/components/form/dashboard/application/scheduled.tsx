import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Cancel from "@material-ui/icons/Cancel";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { UPDATE_CANDIDATE_INTERVIEWS } from "../../../../graphql/candidate/interviews";
import { IApplication, IInterview } from "../../../types";
import CancelInterview from "./dialog/cancel";

interface IProps {
  application?: IApplication;
  interviews?: IInterview[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cancelIcon: {
      color: theme.palette.primary.main
    },
    listItemText: {
      color: theme.palette.primary.light,
      marginLeft: theme.spacing(2)
    }
  })
);

/**
 * A React Functional Component that displays a list of all the interview times a candidate has been offered for a specific job
 */

const Scheduled: React.FC<IProps> = props => {
  const notifications = React.useContext(NotificationContext);
  const classes = useStyles();
  const updateInterview = useApolloMutation(UPDATE_CANDIDATE_INTERVIEWS);
  const [available, setAvailable] = React.useState<IInterview[]>();
  const [open, setOpen] = React.useState(false);
  const [scheduled, setScheduled] = React.useState<IInterview[]>();
  const [selected, setSelected] = React.useState();

  const setInterviews = () => {
    if (props.interviews) {
      const availableInterviews = props.interviews.filter(
        (interview: IInterview) => interview.status === "pending"
      );
      setAvailable(availableInterviews);

      const scheduledInterviews = props.interviews.filter(
        (interview: IInterview) => interview.status === "accepted"
      );
      setScheduled(scheduledInterviews);
    }
  };
  React.useEffect(setInterviews, [props.interviews]);

  const mutationEffect = () => {
    if (updateInterview.data) {
      handleNotifications("Interview Canceled");
    }
  };
  React.useEffect(mutationEffect, [updateInterview.data]);

  const handleNotifications = (message: any) => {
    notifications.dispatch({
      payload: {
        message
      },
      type: "ADD_NOTIFICATION"
    });
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleCancelInterview = (interview?: IInterview) => (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (!interview) {
      return;
    }
    setOpen(!open);
    setSelected(interview);
  };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (selected) {
      const variables = { input: { id: selected.id, status: "canceled" } };
      updateInterview.execute({ variables });
    }
    handleClose();
  };

  return (
    <React.Fragment>
      {props.interviews && !_.isEmpty(scheduled) && (
        <List>
          {scheduled &&
            scheduled.map((interview, index) => {
              return (
                <ListItem key={index} divider={true}>
                  <ListItemText
                    className={classes.listItemText}
                    primary={moment(interview.datetime).format(
                      "h:mm a on dddd MMMM Do, YYYY"
                    )}
                  />
                  <ListItemIcon>
                    <Tooltip title="Cancel Interview">
                      <IconButton onClick={handleCancelInterview(interview)}>
                        <Cancel className={classes.cancelIcon} />
                      </IconButton>
                    </Tooltip>
                  </ListItemIcon>
                </ListItem>
              );
            })}
        </List>
      )}

      {props.interviews && _.isEmpty(available) && _.isEmpty(scheduled) && (
        <ListItem>
          <ListItemText primary={`You have no upcoming interviews`} />
        </ListItem>
      )}

      <CancelInterview
        open={open}
        message={`Are you sure you want to cancel the interview at ${moment(
          selected && selected.datetime
        ).format("h:mm a on dddd, MMMM Do, YYYY")}?`}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </React.Fragment>
  );
};

export default Scheduled;
