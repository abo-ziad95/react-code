import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import Layout from "../components/layout";
import useHistoryPush from "../hooks/router/useHistoryPush";

const style: React.CSSProperties = {
  height: "50vh",
  textAlign: "center"
};

const NotFound: React.FC = () => {
  const { handleClick } = useHistoryPush();

  return (
    <Layout menuComponent={<div />}>
      <div className="wrapper">
        <Grid container={true} justify="center" alignItems="center" style={style}>
          <Grid item={true}>
            <Typography variant="h2" gutterBottom={true}>
              Whoops!!!
            </Typography>
            <Typography variant="h4" gutterBottom={true}>
              The page your are looking for has been moved or does not exist.
            </Typography>
            <Button color="primary" onClick={handleClick("/")}>
              Return to Homepage
            </Button>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default NotFound;
