import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import { Badge } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/People";
import PictureInPictureIcon from "@material-ui/icons/PictureInPicture";
import _ from "lodash";
import React, { useState } from "react";
import useReactRouter from "use-react-router";
import { ICandidate } from "../../context/candidate";
import { OrganizationContext } from "../../context/organization";
import { GET_CANDIDATES } from "../../graphql/candidates";
import { GET_JOB, UPDATE_JOB } from "../../graphql/jobs";

interface IProps {
  candidatesCount: number;
}

const Actions: React.FC<IProps> = props => {
  const { match } = useReactRouter();
  const { jobId } = match.params as { jobId: string };
  const { handleClick } = useHistoryPush();

  return (
    <React.Fragment>
      <IconButton id="view-candidates-board" onClick={handleClick(`/jobs/${jobId}/candidates/board`)}>
        <Tooltip title="View Candidates Board">
          <PictureInPictureIcon />
        </Tooltip>
      </IconButton>
      <IconButton onClick={handleClick(`/jobs/${jobId}/candidates`)}>
        <Badge max={19} badgeContent={props.candidatesCount} color="primary">
          <Tooltip title="View Applicants">
            <PeopleIcon />
          </Tooltip>
        </Badge>
      </IconButton>
      <IconButton id="edit-job" onClick={handleClick(`/jobs/${jobId}/edit`)}>
        <Tooltip title="Edit Job">
          <EditIcon color="primary" />
        </Tooltip>
      </IconButton>
    </React.Fragment>
  );
};

const ContentPlaceholder: React.FC = () => (
  <React.Fragment>
    <Placeholder variant="text" />
    <Placeholder variant="text" />
    <Placeholder variant="text" width="80%" />
  </React.Fragment>
);
/**
 * Job component return form to show information about this job
 */
const Job = () => {
  const organization = React.useContext(OrganizationContext);
  const { match } = useReactRouter();
  const { jobId } = match.params as { jobId: string };
  const job = useApolloQuery(GET_JOB);
  const notification = React.useContext(NotificationContext);
  const updateJob = useApolloMutation(UPDATE_JOB);
  const candidates = useApolloQuery(GET_CANDIDATES);
  const [content, setContent] = useState();
  const [title, setTitle] = useState();
  const [status, setStatus] = useState();
  const [actions, setActions] = useState();
  const [name, setName] = useState();

  const updatedJobEffect = () => {
    if (updateJob.data) {
      notification.dispatch({
        payload: {
          message: "Job has been updated"
        },
        type: "ADD_NOTIFICATION"
      });
    }
  };
  React.useEffect(updatedJobEffect, [updateJob.data]);

  const effect = () => {
    const variables = { id: jobId };
    candidates.execute({ variables: { job: jobId } });
    job.execute({ variables });
  };
  React.useEffect(effect, []);

  const jobEffect = () => {
    if (
      job.data &&
      job.data.getKarmaJobs &&
      candidates.data &&
      candidates.data.queryKarmaCandidatesByJobDateCreatedIndex &&
      organization.state
    ) {
      setTitle(job.data.getKarmaJobs.title);
      setContent(
        <div
          dangerouslySetInnerHTML={{
            __html: job.data.getKarmaJobs.description
          }}
        />
      );
      setStatus(job.data.getKarmaJobs.status);
      setName(organization.state.name);

      const filteredCandidates = candidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items.filter(
        (candidate: ICandidate) =>
          candidate.status !== "apply" && candidate.status !== "denied"
      );
      setActions(Number(filteredCandidates.length));
    }
  };
  React.useEffect(jobEffect, [job.data, candidates.data, organization.state]);

  const breadcrumbs = [
    { primary: name ? name : <Placeholder variant="text" />, path: "/" },
    { primary: "Jobs", path: "/jobs" },
    { primary: title }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader
              title={title ? title : <Placeholder variant="text" />}
              subheader={status}
              action={
                !_.isUndefined(actions) ? (
                  <Actions candidatesCount={actions} />
                ) : (
                  <Placeholder
                    variant="circle"
                    height={48}
                    width={48}
                    style={{ marginLeft: 12 }}
                  />
                )
              }
            />
            <Divider />
            {content ? (
              <CardContent>{content}</CardContent>
            ) : (
              <CardContent>
                <ContentPlaceholder />
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Job;
