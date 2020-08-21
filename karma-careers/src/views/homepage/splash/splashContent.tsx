import Grid from "@material-ui/core/Grid";
import * as React from "react";
import Search from "./search";

const style: React.CSSProperties = {
  color: "#fff",
  textAlign: "center",
  textTransform: "uppercase"
};

const SplashContent: React.FC = () => {
  return (
    <Grid container={true} justify="center" spacing={3} style={style}>
      <Grid item={true} xs={12}>
        <Search />
      </Grid>
    </Grid>
  );
};

export default SplashContent;
