import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import Alerts from "../../components/alerts";
import Notifications from "../../components/notifications";
import Footer from "./footer";
import Header from "./header";

const useStyles = makeStyles({
  container: { marginTop: 60 },
  paper: { padding: 12 }
});

/**
 * React Function Component that renders Global Layout
 * @param props React Function Component parameters
 */

const Authentication: React.FC = props => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Alerts />
      <Notifications />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center" className={classes.container}>
          <Grid item={true} xs={12} sm={7} md={5} lg={4} xl={3}>
            <Paper className={classes.paper}>
              <Header />
              {props.children}
              <Footer />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default Authentication;
