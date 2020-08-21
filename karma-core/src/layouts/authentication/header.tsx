import Grid from "@material-ui/core/Grid";
import React from "react";
import parseUrl from "../../utils/parseUrl";

/**
 * React Function Component that renders layout Header
 */

const Header: React.FC = () => {
  const { domain, protocal } = parseUrl();

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: "center" }}>
          <a href={`${protocal}${domain}`} style={{ textDecoration: "none" }}>
            <img
              src="https://karma-careers-uploads.s3-us-west-2.amazonaws.com/logo-dark.png"
              alt="Karma Careers"
              height="24px"
            />
          </a>
        </Grid>
      </Grid>
    </div>
  );
};

export default Header;
