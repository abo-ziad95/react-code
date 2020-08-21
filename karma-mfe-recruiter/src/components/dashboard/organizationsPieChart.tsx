import React from "react";
import {Chart} from 'react-google-charts';
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import _ from 'lodash';
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import {GET_ORGANIZATIONS_LIST} from "../../graphql/organisationsList";
import {capitalize} from "@material-ui/core/utils";

interface IOrganization {
  id: string;
  status: string;
}

/**
 * OrganizationsPieChart component renders circle diagram of organizations split by status
 * Shows number of organizations
 */
const OrganizationsPieChart = () => {
  const organizationsQuery = useApolloQuery(GET_ORGANIZATIONS_LIST);
  let organizations: IOrganization[] = [];
  let chartData: any = [["Status", "Count"], ["", 0]];
  const effect = () => {
    const variables = {
      limit: 10000
    };
    organizationsQuery.execute({ variables });
  };
  React.useEffect(effect, []);

  if (organizationsQuery.data &&  organizationsQuery.data.listKarmaOrganizations &&
    organizationsQuery.data.listKarmaOrganizations.items)
  {
    organizations = organizationsQuery.data.listKarmaOrganizations.items;
    chartData = _.chain(organizations).groupBy("status").map((value) => (
      [capitalize(value[0].status), value.length])).value();
    chartData.unshift(["Status", "Count"]);
  }

  return (
    <Card>
      <CardHeader
        title="Organizations"
        subheader={`Number of organizations: ${organizationsQuery.loading ? "" : organizations.length}`}/>
      <Divider/>
      <Chart
        width={'100%'}
        height={'100%'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          legend: 'none',
          pieSliceText: 'label',
          title: 'Active Organizations',
          pieStartAngle: 0,
        }}
        rootProps={{'data-testid': '4'}}
      />
    </Card>
  );
};

export default OrganizationsPieChart;