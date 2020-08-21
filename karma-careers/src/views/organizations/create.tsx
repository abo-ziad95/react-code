import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import Layout from "../../components/layout/index";
import Menu from "./menu";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import usePostRequest from "../../hooks/api/usePostRequest";
import useTextField from "../../hooks/form/useTextField";

const Create: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const { post } = usePostRequest();
  const { push } = useHistoryPush();
  const nameTextField = useTextField("name", "Company Name");
  const addressTextField = useTextField("address", "Street Address");
  const cityTextField = useTextField("city", "City");
  const stateTextField = useTextField("state", "State");
  const zipTextField = useTextField("zip", "Zip");

  const breadcrumbs = [
    { primary: "Organizations", path: "/organizations" },
    { primary: "Create an Organization" }
  ];

  const handleSubmit = async () => {
    const body = {
      name: nameTextField.value,
      address: addressTextField.value,
      city: cityTextField.value,
      state: stateTextField.value,
      zip: zipTextField.value
    };
    const url = "https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/organizations";
    const { status } = await post(url, {}, body);
    if (status === 201) {
      push("/organizations");
    }
  };

  return (
    <Layout menuComponent={<Menu />} title="Create a new organization">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title="Create an Organization" />
              <Divider />
              <CardContent>
                <div className="wrapper">
                  <Grid container={true} spacing={3} justify="center">
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...nameTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...addressTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField {...cityTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={2} lg={2} xl={2}>
                      <TextField {...stateTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={4} lg={4} xl={4}>
                      <TextField {...zipTextField.attributes} />
                    </Grid>
                  </Grid>
                </div>
                <CardActions>
                  <Button onClick={handleClick(`/organizations`)} color="primary">
                    Cancel
                  </Button>
                  <Button color="primary" onClick={handleSubmit} variant="contained">
                    Submit
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Create;
