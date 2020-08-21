import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import useReactRouter from "use-react-router";
import ProgressStepper from "../../components/candidates/stepper";
import { GET_CANDIDATE } from "../../graphql/candidates";
import _ from "lodash";

interface ICandidate {
  [key: string]: any;
}
/**
 * Candidate component return candidate details info
 * Contains candidateStatus component to change status of a candidate
 */
const Candidate = () => {
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string; jobId: string; candidateId: string };
  const organizationId = params.organizationId;
  const jobId = params.jobId;
  const candidateId = params.candidateId;
  const query = useApolloQuery(GET_CANDIDATE);
  const [candidate, setCandidate] = React.useState<ICandidate | undefined>();

  const getCandidate = () => {
    query.execute({ variables: { id: candidateId } });
  };
  React.useEffect(getCandidate, []);

  const setCandidateState = () => {
    if (query.data && query.data.getKarmaCandidates) {
      setCandidate(query.data.getKarmaCandidates);
    }
  };
  React.useEffect(setCandidateState, [query.data]);

  const breadcrumbs = [
    { primary: "Organizations", path: "/organizations" },
    {
      primary:
        candidate && candidate.job && candidate.job.organization.name
          ? candidate.job.organization.name
          : "",
      path: "/organizations/" + organizationId
    },
    { primary: "Jobs", path: "/organizations/" + organizationId + "/jobs" },
    {
      primary: candidate && candidate.job && candidate.job.title ? candidate.job.title : "",
      path: "/organizations/" + organizationId + "/jobs/" + jobId
    },
    {
      primary: "Candidates",
      path: "/organizations/" + organizationId + "/jobs/" + jobId + "/candidates"
    },
    {
      primary:
        candidate && candidate.applicant && candidate.applicant.full_name
          ? candidate.applicant.full_name
          : ""
    }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <ProgressStepper />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader
              title={
                candidate && candidate.job && candidate.job.organization.name ? (
                  candidate.job.organization.name
                ) : (
                  <Placeholder variant="text" />
                )
              }
              subheader={
                candidate && candidate.job && candidate.job.title ? (
                  candidate.job.title
                ) : (
                  <Placeholder variant="text" />
                )
              }
            />
            <Divider />
            <CardContent>
              <List>
                <ListItem divider={true}>
                  <ListItemIcon className={"list-item-first-column"}>
                    <ListItemText primary={"Number:"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      query.loading ? <Placeholder variant="text" /> :
                        candidate && candidate.applicant && candidate.applicant.full_name ? (
                        candidate.applicant.phone_number) : ""}
                  />
                </ListItem>
                <ListItem divider={true}>
                  <ListItemIcon className={"list-item-first-column"}>
                    <ListItemText primary={"Email:"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={query.loading ? <Placeholder variant="text" /> :
                        candidate && candidate.applicant && candidate.applicant.email ? (
                        candidate.applicant.email) : ""}
                  />
                </ListItem>
                <ListItem divider={true}>
                  <ListItemIcon className={"list-item-first-column"}>
                    <ListItemText primary={"Address:"} />
                  </ListItemIcon>
                  {_.isUndefined(candidate) && (
                    <ListItemText primary={<Placeholder variant="text" />} />
                  )}
                  {candidate &&
                    candidate.applicant &&
                    candidate.applicant.addresses &&
                    candidate.applicant.addresses[0] &&
                    candidate.applicant.addresses[0].address && (
                      <ListItemText primary={candidate.applicant.addresses[0].address} />
                    )}
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Candidate;
