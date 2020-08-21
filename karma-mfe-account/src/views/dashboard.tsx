import Breadcrumbs, { IBreadcrumb } from "@hatech/karma-core/components/breadcrumbs";
import useSetHead from "@hatech/karma-core/hooks/useSetHead";
import Grid from "@material-ui/core/Grid";
import React from "react";
import Applications from "../components/form/dashboard/applications";
import Interviews from "../components/form/dashboard/interviews";
import { useStyles } from "./application";

const Dashboard: React.FC = () => {
  const classes = useStyles();
  useSetHead({ title: "Candidate's Applications" });

  const breadcrumbs: IBreadcrumb[] = [
    {
      path: `/`,
      primary: `Dashboard`,
    }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className={classes.breadcrumbs}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Applications />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Interviews />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
