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
import MuiDialog from "../../components/dialog";
import Layout from "../../components/layout/index";
import { AlertsContext } from "../../context/alerts";
import useDeleteRequest from "../../hooks/api/useDeleteRequest";
import usePutRequest from "../../hooks/api/usePutRequest";
import useTextField from "../../hooks/form/useTextField";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import useGetOrganization from "../../hooks/useGetOrganization";
import Menu from "./menu";

const Edit: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const { _delete } = useDeleteRequest();
  const { put } = usePutRequest();
  const alerts = React.useContext(AlertsContext);
  const { push } = useHistoryPush();
  const organization = useGetOrganization();
  const cityTextField = useTextField("city", "City", organization ? organization.city : "");
  const nameTextField = useTextField("name", "Company Name", organization ? organization.name : "");
  const stateTextField = useTextField("state", "State", organization ? organization.state : "");
  const addressTextField = useTextField(
    "address",
    "Street Address",
    organization ? organization.address : ""
  );
  const zipTextField = useTextField("zip", "Zip", organization ? organization.zip : "");

  const breadcrumbs = [
    {
      primary: organization ? organization.name : "",
      path: organization ? `/organizations/${organization.id}` : undefined
    },
    { primary: "Edit" }
  ];

  const handleDelete = () => {
    setOpenConfirm(true);
  };

  const cancelDelete = () => {
    setOpenConfirm(false);
  };

  const confirmDelete = async () => {
    if (!organization) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: "Unable to determine organization selected"
        }
      });
      return;
    }

    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/organizations/${
      organization.id
    }`;
    const { status } = await _delete(url);
    if (status === 200) {
      push("/organizations");
    }
  };

  const handleSubmit = async () => {
    if (!organization) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: "Unable to determine organization selected"
        }
      });
      return;
    }

    const body = {
      city: cityTextField.value,
      name: nameTextField.value,
      state: stateTextField.value,
      address: addressTextField.value,
      zip: zipTextField.value
    };
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/organizations/${
      organization.id
    }`;
    await put(url, {}, body);
    push("/organizations");
  };

  return (
    <Layout menuComponent={<Menu />} title={organization ? organization.name + " | Edit" : undefined}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title="Edit Organization" />
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
                  {organization && (
                    <Button
                      onClick={handleClick(`/organizations/${organization.id}`)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button color="primary" onClick={handleSubmit} variant="contained">
                    Submit
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} style={{ textAlign: "center" }}>
            <MuiDialog
              body="Are you sure you want to delete this forever?"
              handleConfirm={confirmDelete}
              handleCancel={cancelDelete}
              open={openConfirm}
              title="This is permanent!"
            />
            <Button onClick={handleDelete} color="primary">
              Delete this Organization
            </Button>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Edit;
