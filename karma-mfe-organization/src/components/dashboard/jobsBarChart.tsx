import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import moment from "moment";
import React from "react";
import { Chart } from 'react-google-charts';
import {ICandidate} from "../../context/candidate";
import { OrganizationContext } from "../../context/organization";
import { GET_ALL_CANDIDATES } from "../../graphql/candidates";
import { GET_INTERVIEWS } from "../../graphql/interviews";
import { GET_ALL_JOBS } from "../../graphql/jobs";

/**
 * CandidatesChart component renders graph of applied candidates and date of application
 * Shows number of applied candidates
 */


const JobsBarChart = () => {
  const jobsQuery = useApolloQuery(GET_ALL_JOBS);
  const organization = React.useContext(OrganizationContext);
  const candidatesQuery = useApolloQuery(GET_ALL_CANDIDATES);
  const interviewsQuery = useApolloQuery(GET_INTERVIEWS);

  const [year, setYear] = React.useState(new Date().getFullYear() - 3);
  const [state, setState] = React.useState([
    ["Year", "Jobs", "Candidates", "Interviews"]
  ]);
  const effect = () => {
    if(new Date().getFullYear() >= year && organization.state){
      const variables = {
      filter: {
        date_created: { between: [`${year}-01-01`, `${year}-12-31`] },
        organization: { eq: organization.state ? organization.state.id : ''},

      },
      limit: 100000,
    };
      candidatesQuery.execute({variables});
      jobsQuery.execute({ variables });
      interviewsQuery.execute({ variables: {filter: {
            datetime: { between: [`${year}-01-01`, `${year}-12-31`] },
            organization: { eq: organization.state ? organization.state.id : ''},
          },
          limit: 100000,
        } });
    }
  };
  React.useEffect(effect, [organization.state, year]);

  const jobsQueryEffect = () => {
    if (organization && organization.state && organization.state.id) {
      const organizationID = organization.state.id;
    if(jobsQuery.data && jobsQuery.data.listKarmaJobs &&
      candidatesQuery.data && candidatesQuery.data.listKarmaCandidates &&
      interviewsQuery.data && interviewsQuery.data.listKarmaInterviews) {

      setState([
        ...state,
        [String(year),
          jobsQuery.data.listKarmaJobs.items.length,

          candidatesQuery.data.listKarmaCandidates.items
            .filter((candidate: ICandidate) => {
              if (candidate.job && candidate.job.organization && candidate.job.organization.id === organizationID &&
                Number(moment(candidate.date_created)
                .format("YYYY")) === year) {
                return candidate;
              } else {
                return null;
              }
            }).length,

          interviewsQuery.data.listKarmaInterviews.items.length]
      ]);
      setYear(year + 1)
    }}
  };
  React.useEffect(jobsQueryEffect, [jobsQuery.data, candidatesQuery.data, interviewsQuery.data]);

  return (
    <div>
      <Chart
        width={"100%"}
        height={"300px"}
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={state}
        options={{
          // Material design options
          chart: {
            subtitle: `Jobs, Candidates, and Interviews: ${new Date().getFullYear() - 3}-${new Date().getFullYear()}`,
            title: "Company Performance",
          }
        }}
        // For tests
        rootProps={{ "data-testid": "2" }}
      />
    </div>
  );
};

export default JobsBarChart;
