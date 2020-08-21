import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";

/**
 * React Function Component that renders layout Footer
 */

const Footer: React.FC = () => {
  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} style={{ textAlign: "center" }}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography align="center" variant="caption">
            Powered by Karma Careers, LLC © 2019
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Footer;
