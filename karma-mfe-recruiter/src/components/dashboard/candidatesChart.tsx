import React from "react";
import {Chart} from 'react-google-charts';
import {GET_ALL_CANDIDATES} from "../../graphql/candidates";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import _ from 'lodash';
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";

interface ICandidate {
  id: string;
  date_created: string;
  date: any;
}

/**
 * CandidatesChart component renders graph of applied candidates and date of application
 * Shows number of applied candidates
 */
const CandidatesChart = () => {
  const candidatesQuery = useApolloQuery(GET_ALL_CANDIDATES);
  let candidates: ICandidate[] = [];
  let chartData: any = [["Date", "Number of created candidates"], [new Date(), 0]];
  let max: number = 0;
  const effect = () => {
    const variables = {
      limit: 10000
    };
    candidatesQuery.execute({ variables });
  };
  React.useEffect(effect, []);

  if (candidatesQuery.data &&  candidatesQuery.data.listKarmaCandidates &&
    candidatesQuery.data.listKarmaCandidates.items)
  {
    candidates = candidatesQuery.data.listKarmaCandidates.items;
    candidates.map((candidate: ICandidate) => (
      candidate.date = new Date(candidate.date_created)
    ));

    candidates.sort((a: ICandidate, b: ICandidate) => a.date - b.date);
    chartData = _.chain(candidates).groupBy("date").map((value) => (
      [new Date(value[0].date_created), value.length])).value();
    max = 1.1 * Math.max.apply(Math, chartData.map((v: any) => v[1]));
    chartData.unshift(["Date", "Number of applied candidates"]);
    console.log(max)
    console.log(max)
    console.log(max)
    console.log(max)
    console.log(max)
  }


  return (
    <div style={{ paddingTop: 12 }}>
      <Card>
        <CardHeader
          title="Candidates"/>
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
          rootProps={{'data-testid': '1'}}
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

export default CandidatesChart;