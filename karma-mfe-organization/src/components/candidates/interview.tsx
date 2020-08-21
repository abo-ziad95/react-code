import { AlertsContext } from "@hatech/karma-core/context/alerts";
import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import React from "react";
import useReactRouter from "use-react-router";
import uuid from "uuid";
import { CandidateContext } from "../../context/candidate";
import { OrganizationContext } from "../../context/organization";
import {GET_CANDIDATE} from "../../graphql/candidates";
import { CREATE_INTERVIEW, GET_INTERVIEWS } from "../../graphql/interviews";
import { IInterview } from "./types";

interface IProps {
  open: boolean;
  id?: string;
  handleCloseDialog(): void;
}

/**
 * Interview component renders popup with date picker field to create in interview
 * effect handle Close Dialog popup and add new interview to the list
 * interviewEffect handle if we has tow interviews in the same time and throw error
 */

const Interview: React.FC<IProps> = props => {
  const organization = React.useContext(OrganizationContext);
  const candidate = React.useContext(CandidateContext);
  const alerts = React.useContext(AlertsContext);
  const notification = React.useContext(NotificationContext);
  const { match } = useReactRouter();
  const params = match.params as { candidateId: string };
  const refetchQuery = () => [{query: GET_CANDIDATE, variables: { id: params.candidateId }}];
  const mutation = useApolloMutation(CREATE_INTERVIEW, {refetchQueries: refetchQuery()});
  const query = useApolloQuery(GET_INTERVIEWS);
  const interview = useTextField("interviewDate", "Date & Time");

  const confirmMutation = () => {
    if (mutation.data) {
      props.handleCloseDialog();
      notification.dispatch({
        payload: {
          message: "Interview invitation sent"
        },
        type: "ADD_NOTIFICATION",
      });
    }
    interview.setValue('');
  };
  React.useEffect(confirmMutation, [mutation.data]);

  const interviewEffect = () => {
    let filteredInterviews = [];
    if(query.data && query.data.listKarmaInterviews && query.data.listKarmaInterviews.items){
      filteredInterviews = query.data.listKarmaInterviews.items.filter((item: IInterview) =>
        item.status !== 'deleted'
      );
    }

    if (!query.data || !organization.state) {
      return;
    }

    if (!candidate.state) {
      alerts.dispatch({
        payload: {
          body: "Unable to determine candidate"
        },
        type: "ADD_ALERT"
      });
      return;
    }

    if (!interview.value) {
      notification.dispatch({
        payload: {
          message: "An interview date and time must be selected"
        },
        type: "ADD_NOTIFICATION",
      });
      return;
    }

    if (
      filteredInterviews &&
      filteredInterviews.length
    ) {
      notification.dispatch({
        payload: {
          message: `You have an interview in this time ,Please choose other time`
        },
        type: "ADD_NOTIFICATION",
      });
      return;
    }

    const input = {
      applicant: candidate.state.applicant.id,
      datetime: interview.value,
      id: uuid.v4(),
      job: candidate.state.job.id,
      organization: organization.state.id,
      status: "pending"
    };
    const variables = { input };
    mutation.execute({ variables });
  };
  React.useEffect(interviewEffect, [query.data]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!organization.state) {
      alerts.dispatch({
        payload: {
          body: "Unable to determine organization"
        },
        type: "ADD_ALERT",
      });
      return;
    }

    if (!interview.value) {
      notification.dispatch({
        payload: {
          message: "An interview date and time must be selected"
        },
        type: "ADD_NOTIFICATION",
      });
      return;
    }
    const checkIfDateBefore = moment(interview.value , "YYYY-MM-DDTHH:mm").isBefore(moment())
    if(checkIfDateBefore) {
      notification.dispatch({
        payload: {
          message: "The Date does not have to be in the past"
        },
        type: "ADD_NOTIFICATION",
      });
      return;
    }

    const variables = {
      filter: {
        datetime: {
          between: [
            moment(interview.value)
              .subtract(50, "minutes")
              .format("YYYY-MM-DDTHH:mm"),
            moment(interview.value)
              .add(50, "minutes")
              .format("YYYY-MM-DDTHH:mm")
          ]
        },
        organization: { eq: organization.state.id },
        status: { notContains: 'deleted' },
      }
    };
    query.execute({ variables });
  };

  return (
    <Dialog onClose={props.handleCloseDialog} open={props.open}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogContent>
          <TextField
            {...interview.attributes}
            type="datetime-local"
            autoFocus={true}
            InputLabelProps={{
              shrink: true
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" id="submit" type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Interview;
