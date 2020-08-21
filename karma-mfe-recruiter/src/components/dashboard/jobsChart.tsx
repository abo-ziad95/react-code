import React from "react";
import {Chart} from 'react-google-charts';
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import _ from 'lodash';
import {GET_ALL_JOBS} from "../../graphql/jobs";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import {Card} from "@material-ui/core";

interface IJob {
  id: string;
  date_created: string;
  date: any;
}

/**
 * JobsChart component renders graph of posted jobs and date posted
 * Shows number of posted jobs
 */
const JobsChart = () => {
  const jobsQuery = useApolloQuery(GET_ALL_JOBS);
  let jobs: IJob[] = [];
  let chartData: any = [["Date", "Number of created jobs"], [new Date(), 0]];
  let max: number = 0;
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
    jobs.map((job: IJob) => (
      job.date = new Date(job.date_created)
    ));

    jobs.sort((a: IJob, b: IJob) => a.date - b.date);
    chartData = _.chain(jobs).groupBy("date").map((value) => (
      [new Date(value[0].date_created), value.length])).value();
    max = 1.1 * Math.max.apply(Math, chartData.map((v: any) => v[1]));
    chartData.unshift(["Date", "Number of posted jobs"]);
  }

  return (
    <div style={{ paddingTop: 12 }}>
      <Card>
        <CardHeader
          title="Jobs"/>
        <Divider/>
        <Chart
          width={'100%'}
          height={'100%'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            // Use the same chart area width as the control for axis alignment.
            chartArea: {height: '80%', width: '90%'},
            hAxis: {slantedText: false},
            vAxis: {viewWindow: {min: 0, max: max}},
            legend: {position: 'none'},
          }}
          rootProps={{'data-testid': '2'}}
          chartPackages={['corechart', 'controls']}
          controls={[
            {
              controlType: 'ChartRangeFilter',
              options: {
                filterColumnIndex: 0,
                ui: {
                  chartType: 'LineChart',
                  chartOptions: {
                    chartArea: {width: '90%', height: '50%'},
                    hAxis: {baselineColor: 'none'},
                  },
                },
              },
              controlPosition: 'bottom',
              controlWrapperParams: {
                state: {
                  range: {start: new Date(2015, 1, 1), end: new Date()},
                },
              },
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default JobsChart;