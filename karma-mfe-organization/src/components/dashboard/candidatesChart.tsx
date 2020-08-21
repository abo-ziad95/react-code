import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import _ from 'lodash';
import React from "react";
import {Chart} from 'react-google-charts';
import {OrganizationContext} from "../../context/organization";
import {GET_ALL_CANDIDATES} from "../../graphql/candidates";

interface ICandidate {
  id: string;
  date_created: string;
  status: string;
  job: IJob;
  date: any;
}

interface IJob {
  id: string;
  date_created: string;
  date: any;
  organization: IOrganization;
}
interface IOrganization {
  id: string;
}

/**
 * CandidatesChart component renders graph of applied candidates and date of application
 * Shows number of applied candidates
 */
const CandidatesChart = () => {
  const organization = React.useContext(OrganizationContext);
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

  if (organization && organization.state && organization.state.id) {
    const organizationID = organization.state.id;
    if (candidatesQuery.data && candidatesQuery.data.listKarmaCandidates &&
      candidatesQuery.data.listKarmaCandidates.items && (candidatesQuery.data.listKarmaCandidates.items.length !== 0)) {
      candidates = candidatesQuery.data.listKarmaCandidates.items
        .filter((candidate: ICandidate) =>
          candidate.job && candidate.job.organization && candidate.job.organization.id === organizationID);
      candidates.map((candidate: ICandidate) => (
        candidate.date = new Date(candidate.date_created)
      ));

      candidates.sort((a: ICandidate, b: ICandidate) => a.date - b.date);

      if (!_.isEmpty(candidates)) {
        chartData = _.chain(candidates).groupBy("date").map((value) => (
          [new Date(value[0].date_created), value.length])).value();
        max = 1.1 * Math.max.apply(Math, chartData.map((v: any) => v[1]));
        chartData.unshift(["Date", "Number of applied candidates"]);
      }
    }
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
            legend: {position: 'none'},
            vAxis: {viewWindow: {min: 0, max}},

          }}
          rootProps={{'data-testid': '1'}}
          chartPackages={['corechart', 'controls']}
          controls={[
            {
              controlPosition: 'bottom',
              controlType: 'ChartRangeFilter',
              controlWrapperParams: {
                state: {
                  range: {start: new Date(2015, 1, 1), end: new Date()},
                },
              },
              options: {
                filterColumnIndex: 0,
                ui: {
                  chartOptions: {
                    chartArea: {width: '90%', height: '50%'},
                    hAxis: {baselineColor: 'none'},
                  },
                  chartType: 'LineChart',
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