import Breadcrumbs, { IBreadcrumb } from "@hatech/karma-core/components/breadcrumbs";
import useSetHead from "@hatech/karma-core/hooks/useSetHead";
import Grid from "@material-ui/core/Grid";
import React from "react";
import About from "../components/form/settings/about";
import Location from "../components/form/settings/location";
import { useStyles } from "./application";

const Settings: React.FC = () => {
  const classes = useStyles();
  useSetHead({ title: "Candidate Settings" });
  const breadcrumbs: IBreadcrumb[] = [
    {
      path: `/`,
      primary: `Dashboard`,
    }
  ];
  
  breadcrumbs.push({ primary: "Settings" });

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className={classes.breadcrumbs}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <About />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Location />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
