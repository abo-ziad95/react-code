import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import {CardContent} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import React from "react";
import CandidatesChart from "../components/dashboard/candidatesChart";
import CandidatesPieChart from "../components/dashboard/candidatesPieChart";
import DashboardCounters from "../components/dashboard/dashboardCounters";
import JobsBarChart from "../components/dashboard/jobsBarChart";
import JobsChart from "../components/dashboard/jobsChart";
import { OrganizationContext } from "../context/organization";
/**
 * Profile component return Profile organization with charts components
 */
const Profile: React.FC = () => {
  const organization = React.useContext(OrganizationContext);
  const breadcrumbs = [
    { primary: organization.state ? organization.state.name : "" }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </Grid>

          <Grid item={true} xs={12} sm={2} md={2} lg={2} xl={2}>
            <DashboardCounters/>
          </Grid>
          <Grid item={true} xs={12} sm={5} md={5} lg={5} xl={5}>
            <Card style={{ width: "100%" }}>
              <CardHeader title="Candidates" />
              <Divider />
              <CardContent>
                <CandidatesPieChart />
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} sm={5} md={5} lg={5} xl={5}>
            <Card style={{ width: "100%" }}>
              <CardHeader title="Jobs" />
              <Divider />
              <CardContent>
                <JobsBarChart/>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} sm={6} md={6} lg={6} xl={6}>
            <CandidatesChart/>
          </Grid>
          <Grid item={true} xs={12} sm={6} md={6} lg={6} xl={6}>
            <JobsChart/>
          </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
