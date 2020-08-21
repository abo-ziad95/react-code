import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import _ from "lodash";
import React from "react";
import { Chart } from 'react-google-charts';
import {OrganizationContext} from "../../context/organization";
import {GET_ALL_CANDIDATES} from "../../graphql/candidates";

interface ICandidate {
  id: string;
  date_created: string;
  status: string;
  job: IJob;
}

interface IJob {
  id: string;
  date_created: string;
  date: any;
  title: string;
  organization: IOrganization;
}
interface IOrganization {
  id: string;
}

/**
 * CandidatesPieChart component renders chart with data of job and applied candidates for this job
 */
const CandidatesPieChart = () => {

  const organization = React.useContext(OrganizationContext);
  const candidatesQuery = useApolloQuery(GET_ALL_CANDIDATES);
  let chartData: any = [["Job", "Count"], ["", 0]];
  let candidates: ICandidate[] = [];
  const effect = () => {
    const variables = {
      limit: 10000
    };
    candidatesQuery.execute({variables});
  };
  React.useEffect(effect, []);

  if (organization && organization.state && organization.state.id) {
    const organizationID = organization.state.id;
    if (candidatesQuery.data && candidatesQuery.data.listKarmaCandidates &&
      candidatesQuery.data.listKarmaCandidates.items) {
      candidates = candidatesQuery.data.listKarmaCandidates.items
        .filter((candidate: ICandidate) =>
          candidate.job && candidate.job.organization && candidate.job.organization.id === organizationID);
      chartData = _.chain(candidates)
        .groupBy("job.id")
        .map((value: any) => [value[0].job.title, value.length])
        .value();
      chartData.unshift(["Job", "Count"]);
    }
  }

  return (
    <div>
      <Chart
        width={"100%"}
        height={"300px"}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={chartData}
        rootProps={{ "data-testid": "1" }}
      />
    </div>
  );
};

export default CandidatesPieChart;
