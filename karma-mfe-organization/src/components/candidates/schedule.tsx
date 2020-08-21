import Placeholder from "@hatech/karma-core/components/placeholder";
import {NotificationContext} from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import _ from "lodash";
import moment from "moment";
import React from "react";
import useReactRouter from "use-react-router";
import { CandidateContext } from "../../context/candidate";
import { UPDATE_INTERVIEW } from "../../graphql/interviews";
import Interview from "./interview";
import {IInterview} from "./types";
interface IProps {
  status?: string;
}

const Status: React.FC<IProps> = props => (
  <span className="capitalize">
    <strong>Status</strong>: {props.status}
  </span>
);

/**
 * Schedule component renders list of Interviews for specific applicant
 */

const Schedule: React.FC = () => {
  const notification = React.useContext(NotificationContext);
  const candidate = React.useContext(CandidateContext);
  const deleteInterview = useApolloMutation(UPDATE_INTERVIEW);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [interviews, setInterviews] = React.useState([]);
  const { match } = useReactRouter();
  const { jobId } = match.params as { jobId: string };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const candidatesEffect = () => {
    if(candidate.state && candidate.state.interviews){
      const filteredInterviews = candidate.state.interviews.filter((interview: IInterview) =>
       interview.job.id === jobId && interview.status !== 'deleted'
      );
      setInterviews(filteredInterviews)
    }
  };
  React.useEffect(candidatesEffect , [candidate.state])

  const handleDelete = (interviewId: string) => async () => {
    const input = { id: interviewId, status: 'deleted' };
    const variables = { input };
    const { data } = await deleteInterview.execute({ variables });
    if (data) {
      notification.dispatch({
        payload: {
          message: "Interview has been deleted"
        },
        type: "ADD_NOTIFICATION",
      });
    }
  };

  return (
    <Card>
      <CardHeader
        title="Interview Schedule"
        action={
          <IconButton id="addBtn" color="primary" onClick={handleOpenDialog}>
            <AddIcon color="primary" />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <List>
          {_.isUndefined(candidate.state) &&
            [1, 2, 3].map(value => (
              <ListItem key={value} divider={true}>
                <ListItemText primary={<Placeholder variant="text" />} />
              </ListItem>
            ))}
          {interviews && !interviews.length && (
            <ListItem>
              <ListItemText primary="No interviews to display" />
            </ListItem>
          )}
          {interviews && interviews.map((interview: IInterview, index: number) => {
              if(interview.job.id === jobId) { return (
                <ListItem divider={true} key={index}>
                  <ListItemText
                    id={"interviewsList"}
                    primary={moment(interview.datetime).format("MMMM DD, YYYY @ HH:mm A")}
                    secondary={<Status status={interview.status} />}
                  />
                  <ListItemText
                    primary={interview.job.title}
                  />
                  <ListItemSecondaryAction>
                    <IconButton id="cancelBtn" onClick={handleDelete(interview.id)}>
                      <CancelIcon color="disabled" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
              }
              else { return null }
            })}
        </List>
        <Interview open={openDialog} handleCloseDialog={handleCloseDialog} />
      </CardContent>
    </Card>
  );
};

export default Schedule;
