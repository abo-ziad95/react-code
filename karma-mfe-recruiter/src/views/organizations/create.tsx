import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import React from "react";
import "react-quill/dist/quill.snow.css";
import uuid from "uuid";
import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import { CREATE_ORGANIZATION } from "../../graphql/organization";
import {GET_ORGANIZATIONS_LIST} from "../../graphql/organisationsList";

/**
 * CreateOrganization component return form to create organization
 */

const CreateOrganization: React.FC = () => {
  const { push, handleClick } = useHistoryPush();
  const notification = React.useContext(NotificationContext);
  const cityTextField = useTextField("city", "City");
  const stateTextField = useTextField("state", "State");
  const nameTextField = useTextField("name", "Organization Name");
  const zipTextField = useTextField("zip", "Zip");
  const addressTextField = useTextField("address", "Street Address");
  const variables = {
    input: {
      id: uuid.v4(),
      name: nameTextField.value,
      address: addressTextField.value,
      city: cityTextField.value,
      state: stateTextField.value,
      zip: zipTextField.value,
      status: "active"
    }
  };
  const refetchQuery = () => [{query: GET_ORGANIZATIONS_LIST}];
  const query = useApolloMutation(CREATE_ORGANIZATION, {refetchQueries: refetchQuery()});

  const effect = () => {
    if (query.data) {
      notification.dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "A new organization has been created"
        }
      });
      push("/organizations");
    }
  };
  React.useEffect(effect, [query.data]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    query.execute({ variables });
  };

  const breadcrumbs = [{ primary: "Organizations", path: `/organizations` }, { primary: "Create" }];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader title="Create Organization" />
              <Divider />
              <CardContent>
                <div className="wrapper">
                  <Grid container={true} spacing={3} justify="center">
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...nameTextField.attributes} required={true} />
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
                  <Button onClick={handleClick(`/organizations`)} color="primary" id={"cancel"}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" variant="contained" id={"submit"}>
                    Submit
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateOrganization;
