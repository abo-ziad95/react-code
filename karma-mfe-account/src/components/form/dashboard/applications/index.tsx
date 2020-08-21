import { NotificationContext } from "@hatech/karma-core/context/notifications";
import { UserContext } from "@hatech/karma-core/context/user";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import _ from "lodash";
import React from "react";
import { QUERY_CANDIDATE_APPLICATIONS, UPDATE_CANDIDATE_APPLICATION } from "../../../../graphql/candidate/applications";
import { QUERY_CANDIDATE_INTERVIEWS, UPDATE_CANDIDATE_INTERVIEWS } from "../../../../graphql/candidate/interviews";
import { CardPlaceholder, ListPlaceholder } from "../../../placeholders";
import { IApplication, IInterview } from "../../../types";
import ApplicationsList from "./list";
import Search from "./search";

/**
 * A React Functional Component that displays a list of all the jobs a candidate has applied for in table format
 * @param props Properties passed in by parent component
 */

const Applications: React.FC = () => {
  const user = React.useContext(UserContext);
  const notifications = React.useContext(NotificationContext);
  const queryApplications = useApolloQuery(QUERY_CANDIDATE_APPLICATIONS);
  const queryInterviews = useApolloQuery(QUERY_CANDIDATE_INTERVIEWS);
  const updateApplication = useApolloMutation(UPDATE_CANDIDATE_APPLICATION);
  const updateInterview = useApolloMutation(UPDATE_CANDIDATE_INTERVIEWS);
  const [application, setApplication] = React.useState<IApplication>();
  const [applications, setApplications] = React.useState<IApplication[]>([]);
  const [interviews, setInterviews] = React.useState<IInterview[]>([]);
  const [open, setOpen] = React.useState(false);

  const getState = () => {
    if (user.state) {
      const variables = { applicant: user.state.identity.sub };
      queryApplications.execute({ variables });
      queryInterviews.execute({ variables });
    }
  };
  React.useEffect(getState, [user.state]);

  const setApplicationState = () => {
    if (
      queryApplications.data &&
      queryApplications.data.queryKarmaCandidatesByApplicantDateCreatedIndex
    ) {
      const {
        items
      } = queryApplications.data.queryKarmaCandidatesByApplicantDateCreatedIndex;
      const applicationData = items.filter(
        (app: IApplication) =>
          app.job.status === "active" && app.status !== "withdrawn"
      );
      setApplications(applicationData);
    }
  };
  React.useEffect(setApplicationState, [queryApplications.data]);

  const setInterviewState = () => {
    if (
      queryInterviews.data &&
      queryInterviews.data.queryKarmaInterviewsByApplicantJobIndex
    ) {
      const {
        items
      } = queryInterviews.data.queryKarmaInterviewsByApplicantJobIndex;
      setInterviews(items);
    }
  };
  React.useEffect(setInterviewState, [queryInterviews.data]);

  const mutationEffect = () => {
    if (updateApplication.data) {
      handleNotifications(`Application Withdrawn`);
    }
  };
  React.useEffect(mutationEffect, [updateApplication.data]);

  const handleNotifications = (message: any) => {
    notifications.dispatch({
      payload: {
        message
      },
      type: "ADD_NOTIFICATION"
    });
  };

  const handleOpen = (applicationData?: IApplication) => (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!applicationData) {
      return;
    }
    setOpen(!open);
    setApplication(applicationData);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleCancel = (jobId?: string) => {
    if (!jobId) {
      return;
    }
    const filteredInterviews = interviews.filter(
      (interview: IInterview) => interview.job.id === jobId
    );
    if (!_.isEmpty(filteredInterviews)) {
      filteredInterviews.map((interview: IInterview) =>
        updateInterview.execute({
          variables: { input: { id: interview.id, status: "denied" } }
        })
      );
    }
  };

  const handleDelete = (applicationData?: IApplication) => (
    event: React.MouseEvent
  ) => {
    if (!applicationData) {
      return;
    }
    const applicationId = applicationData && applicationData.id;
    const jobId = applicationData && applicationData.job.id;
    setApplications(applications.filter(app => app.id !== applicationId));
    handleClose();
    handleCancel(jobId);
    const variables = { input: { id: applicationId, status: "withdrawn" } };
    updateApplication.execute({ variables });
  };

  return (
    <React.Fragment>
      {!queryApplications.data && (
        <CardPlaceholder content={<ListPlaceholder />} />
      )}
      {queryApplications.data && _.isEmpty(applications) && <Search />}

      {queryApplications.data && !_.isEmpty(applications) && (
        <ApplicationsList
          application={application}
          applications={applications}
          handleClose={handleClose}
          handleDelete={handleDelete}
          handleOpen={handleOpen}
          open={open}
        />
      )}
    </React.Fragment>
  );
};

export default Applications;
