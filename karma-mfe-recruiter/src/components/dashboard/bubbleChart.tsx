import React from "react";
import {Chart} from 'react-google-charts';
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import _ from 'lodash';
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import {GET_ALL_JOBS} from "../../graphql/jobs";

interface IOrganization {
  id: string;
  name: string;
  status: string;
}

interface IJob {
  id: string;
  date_created: string;
  organization: IOrganization;
  candidates: ICandidate[];
}
interface IInterview {
  id: string;
}

interface ICandidate {
  id: string;
  date_created: string;
  interviews: IInterview[];
}

/**
 * BubbleChart component
 * renders Correlation between posted jobs, applied candidates and interviews of active organizations
 */
const BubbleChart = () => {
  const jobsQuery = useApolloQuery(GET_ALL_JOBS);
  let jobs: IJob[] = [];
  let chartData: any = [["ID", "Jobs Posted", "Candidates Applied", "Organization", "Population"], ["", 0, 0, "", 0]];
  const effect = () => {
    const variables = {
      limit: 10000
    };
    jobsQuery.execute({ variables });
  };
  React.useEffect(effect, []);

  if (jobsQuery.data &&  jobsQuery.data.listKarmaJobs &&
    jobsQuery.data.listKarmaJobs.items)
  {
    jobs = jobsQuery.data.listKarmaJobs.items;
    /**
     * Creating chart data by filtering organizations by 'active' status,
     * grouping data by organization name and calculating the number of jobs, candidates
     * and interviews for each organization
     */
    chartData = _.chain(jobs.filter((job: IJob) => job.organization.status === "active"))
      .groupBy("organization.name")
      .map((value) => {
        let candidatesCount = 0;
        let interviewsCount = 0;
        value.map((item) => {
          //Calculation of number of interviews and candidates
          item.candidates.map((candidate) => (interviewsCount += candidate.interviews.length));
          return (candidatesCount += item.candidates.length);
        });
        return ([value[0].organization.name, value.length, candidatesCount, value[0].organization.name, interviewsCount]
        );
      })
      .value();

    chartData.unshift(["ID", "Jobs Posted", "Candidates Applied", "Organization", "Interviews"]);
  }

  return (
    <Card>
      <CardHeader title="Organizations Info" subheader={"Active organizations"}/>
      <Divider/>
      <Chart
        width={'100%'}
        height={'100%'}
        chartType="BubbleChart"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          title:
            'Correlation between posted jobs, applied candidates ' +
            'and interviews of organizations',
          hAxis: {title: 'Jobs Posted'},
          vAxis: {title: 'Candidates Applied'},
          bubble: {textStyle: {fontSize: 11}},
        }}
        rootProps={{'data-testid': '5'}}
      />
    </Card>
  );
};

export default BubbleChart;