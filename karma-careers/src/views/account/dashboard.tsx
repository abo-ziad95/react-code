import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import _ from "lodash";
import moment from "moment";
import * as React from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import Layout from "../../components/layout/index";
import ApplicationList from "../../components/list";
import AccountMenu from "../../components/menu/account";
import { DrawerContext } from "../../context/drawer";
import { JobContext } from "../../context/job";
import { IApplication } from "../../context/types";
import { UserContext } from "../../context/user";
import useGetRequest from "../../hooks/api/useGetRequest";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import MuiDrawer from "../jobs/details";

const useGetApplications = () => {
  const user = React.useContext(UserContext);
  const [applications, setApplications] = React.useState([]);
  const { get, loading } = useGetRequest();

  const getApplications = async () => {
    if (!user.state) {
      return;
    }

    const params = { sub: user.state.sub };
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/applicants`;
    const { data, status } = await get(url, { params });
    if (status === 200) {
      setApplications(data.results);
    }
  };

  const callback = React.useCallback(getApplications, [user.state]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return { applications, loading };
};

const Dashboard: React.FC = () => {
  const drawer = React.useContext(DrawerContext);
  const job = React.useContext(JobContext);
  const { handleClick } = useHistoryPush();
  const { applications, loading } = useGetApplications();
  const { get } = useGetRequest();
  const breadcrumbs = [{ primary: "Applications" }];

  const handleAppClick = (id: string) => async () => {
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/jobs/${id}`;
    const { data, status } = await get(url);
    if (status === 200) {
      drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "job" });
      job.dispatch({ type: "SET_JOB", payload: data.results });
    }
  };

  const listItems = applications.map((application: IApplication) => {
    return {
      avatar: (
        <Avatar>
          {application.title ? application.title.charAt(0) : undefined}
        </Avatar>
      ),
      handleClick: handleAppClick(application.job),
      primary: application.title,
      secondary: (
        <React.Fragment>
          {application.company} <br />
          Applied: {moment(application.date_created).format("MMM DD, YYYY")}
        </React.Fragment>
      )
    };
  });

  return (
    <Layout menuComponent={<AccountMenu />} title="Account Dashboard">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12}>
            <Card>
              <CardHeader title="My Applications" />
              <Divider />
              <CardContent>
                {loading && (
                  <Container style={{ textAlign: "center" }}>
                    <CircularProgress />
                  </Container>
                )}
                {!loading && _.isEmpty(listItems) && (
                  <Container style={{ textAlign: "center" }}>
                    It appears you have not applied for any jobs.
                    <Link onClick={handleClick("/jobs/search")}>
                      Click Here
                    </Link>{" "}
                    to begin you search
                  </Container>
                )}
                {!loading && <ApplicationList items={listItems} />}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <MuiDrawer disableApplyButton={true} />
    </Layout>
  );
};

export default Dashboard;
