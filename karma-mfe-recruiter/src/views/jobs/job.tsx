import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import PeopleIcon from "@material-ui/icons/People";
import PictureInPictureIcon from "@material-ui/icons/PictureInPicture";
import React from "react";
import useReactRouter from "use-react-router";
import { GET_CANDIDATES } from "../../graphql/candidates";
import { GET_JOB } from "../../graphql/jobs";

interface IProps {
  count?: Number;
}
interface IJob {
  [key: string]: any;
}
/**
 * Actions component return icon button with link
 */
const Actions: React.FC<IProps> = props => {
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string; jobId: string };
  const id = params.organizationId;
  const jobId = params.jobId;
  const { handleClick } = useHistoryPush();

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick(`/organizations/${id}/jobs/${jobId}/candidates/board`)}
        id={"view-candidates-board"}
      >
        <Tooltip title="View Candidates Board">
          <PictureInPictureIcon />
        </Tooltip>
      </IconButton>
      <IconButton
        onClick={handleClick(`/organizations/${id}/jobs/${jobId}/candidates`)}
        id={"view-candidates"}
      >
        <Tooltip title="View Candidates">
          <Badge badgeContent={props.count} max={19} color={"primary"}>
            <PeopleIcon />
          </Badge>
        </Tooltip>
      </IconButton>
    </React.Fragment>
  );
};

/**
 * ContentPlaceholder return fragment with placeholders
 */
const ContentPlaceholder: React.FC = () => (
  <React.Fragment>
    <Placeholder variant="text" />
    <Placeholder variant="text" />
    <Placeholder variant="text" width="80%" />
  </React.Fragment>
);

/**
 * Job component renders job info with action button to see candidates for this job
 */
const Job = () => {
  const { match } = useReactRouter();
  const { organizationId, jobId } = match.params as { organizationId: string; jobId: string };
  const variables = { variables: { id: jobId } };
  const query = useApolloQuery(GET_JOB);
  const queryCandidates = useApolloQuery(GET_CANDIDATES);
  const [job, setJob] = React.useState<IJob | undefined>();
  const [count, setCount] = React.useState();

  const effect = () => {
    query.execute(variables);
    queryCandidates.execute({ variables: { job: jobId } });
  };
  React.useEffect(effect, []);

  const setCountState = () => {
    if (queryCandidates.data && queryCandidates.data.queryKarmaCandidatesByJobDateCreatedIndex) {
      setCount(queryCandidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items.length);
    }
  };
  React.useEffect(setCountState, [queryCandidates.data]);

  const setJobState = () => {
    if (query.data && query.data.getKarmaJobs) {
      setJob(query.data.getKarmaJobs);
    }
  };
  React.useEffect(setJobState, [query.data]);

  const breadcrumbs = [
    { primary: "Organizations", path: "/organizations" },
    {
      primary: job && job.organization.name ? job.organization.name : "",
      path: "/organizations/" + organizationId
    },
    { primary: "Jobs", path: "/organizations/" + organizationId + "/jobs" },
    { primary: job && job.title ? job.title : "" }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader
              title={job && job.title ? job.title : <Placeholder variant="text"/>}
              subheader={
                job && job.organization.name ? (
                  job.organization.name
                ) : (
                  <Placeholder variant="text"/>
                )
              }
              action={
                !queryCandidates.loading ? (
                  <Actions count={count}/>
                ) : (
                  <Placeholder variant="circle" height={48} width={48} style={{marginLeft: 12}}/>
                )
              }
            />
            <Divider/>
            <CardContent>
              {query.loading ? <ContentPlaceholder/> :
                job && job.description ? (<div dangerouslySetInnerHTML={{__html: job.description}}/>) :
                  "No job description"}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Job;
