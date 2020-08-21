import Grid from "@material-ui/core/Grid";
import * as React from "react";
import SplashContent from "./splashContent";
import SplashVideo from "./splashVideo";

const style: React.CSSProperties = {
  height: "100vh",
  position: "relative",
  zIndex: 0
};

const Splash: React.FC = () => {
  return (
    <div className="wrapper">
      <Grid alignItems="center" container={true} justify="center" spacing={3} style={style}>
        <SplashVideo />
        <Grid item={true} xs={12} sm={10} md={8} lg={6} xl={4}>
          <SplashContent />
        </Grid>
      </Grid>
    </div>
  );
};

export default Splash;
