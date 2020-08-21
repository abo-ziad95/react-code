import React from "react";
import CandidatesChart from "../../components/dashboard/candidatesChart";
import JobsChart from "../../components/dashboard/jobsChart";
import Grid from "@material-ui/core/Grid";
import OrganizationsPieChart from "../../components/dashboard/organizationsPieChart";
import BubbleChart from "../../components/dashboard/bubbleChart";
import DashboardCounters from "../../components/dashboard/dashboardCounters";

/**
 * Dashboard component renders Organizations Pie Chart,
 * Bubble Chart, CandidatesChart and JobsChart
 */
const Dashboard = () => {
  return (
    <div className="wrapper">
      <Grid container direction="row" spacing={3} justify="center" alignItems="stretch">
        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
          <DashboardCounters/>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
          <OrganizationsPieChart/>
        </Grid>
        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
          <BubbleChart/>
        </Grid>
      </Grid>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <CandidatesChart/>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <JobsChart/>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;