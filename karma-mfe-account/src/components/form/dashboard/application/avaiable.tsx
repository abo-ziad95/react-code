import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";
import React from "react";
import { UPDATE_CANDIDATE_INTERVIEWS } from "../../../../graphql/candidate/interviews";
import { IApplication, IInterview } from "../../../types";
import SelectInterview from "./dialog/select";

interface IProps {
  application?: IApplication;
  interviews?: IInterview[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(1)
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

const Available: React.FC<IProps> = props => {
  const notifications = React.useContext(NotificationContext);
  const classes = useStyles({});
  const updateInterview = useApolloMutation(UPDATE_CANDIDATE_INTERVIEWS);
  const [interviewTimes, setInterviewTimes] = React.useState<IInterview[]>();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState();

  const setInterviewTimesState = () => {
    if (props.interviews) {
      const interviews = props.interviews.filter(
        (interview: IInterview) => interview.status === "pending"
      );
      setInterviewTimes(interviews);
    }
  };
  React.useEffect(setInterviewTimesState, [props.interviews]);

  const mutationEffect = () => {
    if (updateInterview.data) {
      handleNotifications(`Interview Set`);
    }
  }
  React.useEffect(mutationEffect, [updateInterview.data]);

  const handleNotifications = (message: any) => {
    notifications.dispatch({
      payload: {
        message
      },
      type: "ADD_NOTIFICATION"
    });
  };

  const handleSelectedTime = (event: React.ChangeEvent<any>) => {
    if (!event.target.value) {
      return;
    }
    setSelected(event.target.value);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setOpen(!open);
  };

  const handleAccept = () => {
    if (interviewTimes) {
      const acceptedInterview = interviewTimes.filter(interview => {
        return interview.id === selected;
      });
      const params = {
        datetime: acceptedInterview[0].datetime,
        id: acceptedInterview[0].id,
        status: "accepted"
      };
      updateInterview.execute({ variables: { input: params } });
    }
  };

  const handleDeny = () => {
    if (interviewTimes) {
      const deniedInterview = interviewTimes.filter(
        (interview: IInterview) => interview.id !== selected
      );
      deniedInterview.map((interviewTime: IInterview) => {
        return updateInterview.execute({
          variables: { input: { id: interviewTime.id, status: "denied" } }
        });
      });
    }
  };

  const handleSubmit = async (event: React.MouseEvent) => {
    handleAccept();
    handleDeny();
    setOpen(!open);
  };

  return (
    <List dense={true}>
      {!_.isEmpty(interviewTimes) && (
        <React.Fragment>
          <ListItem button={true} onClick={handleOpen}>
            <ListItemText
              className={classes.listItemText}
              primary={"You Have Been Invited To An Interview"}
              secondary={"Please Click Here"}
            />
          </ListItem>
          <SelectInterview
            handleClose={handleClose}
            handleSelectedTime={handleSelectedTime}
            handleSubmit={handleSubmit}
            interviews={interviewTimes}
            open={open}
            value={selected}
          />
        </React.Fragment>
      )}
    </List>
  );
};

export default Available;
