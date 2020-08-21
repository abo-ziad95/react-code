import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import * as React from "react";
import MuiBreadcrumbs from "../../components/breadcrumbs";
import PlacesAutoComplete, {
  IPlacesAutoComplete
} from "../../components/google/placesAutoComplete";
import Layout from "../../components/layout";
import AccountMenu from "../../components/menu/account";
import config from "../../config";
import { AlertsContext } from "../../context/alerts";
import { UserContext } from "../../context/user";
import usePutRequest from "../../hooks/api/usePutRequest";
import { Button } from "@material-ui/core";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import useGetRequest from "../../hooks/api/useGetRequest";

const useGetPreferences = () => {
  const user = React.useContext(UserContext);
  const [preferences, setPreferences] = React.useState();
  const { get } = useGetRequest();

  const getApplications = async () => {
    if (!user.state) {
      return;
    }
    const id = user.state.sub;
    const url = `${config.api}/users/${id}/preferences`;
    const { data, status } = await get(url);
    if (status === 200) {
      setPreferences(data.results);
    }
  };

  const callback = React.useCallback(getApplications, [user.state]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return preferences;
};

const Preferences: React.FC = () => {
  const preferences = useGetPreferences();
  const { handleClick } = useHistoryPush();
  const alerts = React.useContext(AlertsContext);
  const user = React.useContext(UserContext);
  const { put } = usePutRequest();
  const breadcrumbs = [{ primary: "Preferences" }];
  
  const handleSelect = (payload: IPlacesAutoComplete) => {
    handleSubmit(payload);
  };

  const handleSubmit = async (payload: IPlacesAutoComplete) => {
    if (!user.state) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: "Unable to determine user"
        }
      });
      return;
    }

    const newPreferences = { ...preferences, ...payload };
    const url = `${config.api}/users/${user.state.sub}/preferences`;
    await put(url, {}, newPreferences);
  };

  return (
    <Layout menuComponent={<AccountMenu />} title="Account Preferences">
      <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title="Preferences" />
              <Divider />
              <CardContent>
                <div className="wrapper">
                  <Grid container={true} spacing={3} justify="center">
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <PlacesAutoComplete
                        value={preferences ? preferences.address : undefined}
                        handleSelect={handleSelect}
                      />
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title="Account Type" />
              <Divider />
              <CardContent>
                <div className="wrapper">
                  <Grid container={true} spacing={3} justify="center">
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClick("/organizations/create")}
                      >
                        Convert to Organization
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Preferences;
