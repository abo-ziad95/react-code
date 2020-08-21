import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import { AlertsContext } from "@hatech/karma-core/context/alerts";
import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import { createStyles, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Storage } from "aws-amplify";
import moment from "moment";
import React, { useState } from "react";
import uuid from "uuid";
import Loader from "../../assets/images/dual-loader.svg";
import LocationAutoComplete, { IPlacesAutoComplete } from "../../components/google/placesAutoComplete";
import TransactionsList from "../../components/transactions/transactions";
import { IOrganization, OrganizationContext } from "../../context/organization";
import { CREATE_LOGO, DELETE_ORGANIZATION_LOGO, UPDATE_ORGANIZATION } from "../../graphql/organization";

interface IKey {
  key?: string;
}
/**
 * Edit component return form to edit organization
 */
const useStyles = makeStyles(() =>
  createStyles({
    logoImg: {
      backgroundColor: "white",
      border: "0px solid transparent",
      borderRadius: "100%",
      height: "100px",
      position: "absolute",
      width: "100px",
    },
    logoWrap: {
      alignItems: "center",
      backgroundColor: "#eee",
      borderRadius: "100%",
      color: "#fff",
      display: "flex",
      fontFamily: "sans-serif",
      height: "100px",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      textTransform: "uppercase",
      width: "100px",
    },
  })
);
const Edit: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const alerts = React.useContext(AlertsContext);
  const notification = React.useContext(NotificationContext);
  const organization = React.useContext(OrganizationContext);
  const [profile, setProfile] = React.useState(
    organization.state || ({} as IOrganization)
  );
  const nameTextField = useTextField("name", "Company Name", profile.name);
  const createLogo = useApolloMutation(CREATE_LOGO);
  const updateKarmaOrganization = useApolloMutation(UPDATE_ORGANIZATION);
  const deleteLogo = useApolloMutation(DELETE_ORGANIZATION_LOGO);
  const [logoSrc, setLogoSrc] = useState();
  const [file, setFile] = useState();
  const classes = useStyles();
  const [address, setAddress] = React.useState();
  const [coordinates, setCoordinates] = React.useState();

  const effect = () => {
    if (organization.state && updateKarmaOrganization.data) {
      notification.dispatch({
        payload: {
          message: "Organization has been updated"
        },
        type: "ADD_NOTIFICATION",
      });
    }
  };
  React.useEffect(effect, [updateKarmaOrganization.data]);

  const organizationEffect = () => {
    if (organization.state) {
      getLogo();
      setFile(organization.state.file);
      setProfile(organization.state);
    }
  };
  React.useEffect(organizationEffect, [organization.state]);

  const getLogo = async () => {
    if (organization.state && organization.state.file && organization.state.file.name) {
      try {
        const logo =  await Storage.get(organization.state.file.name);
        setLogoSrc(logo);
      }catch (e) {
        setLogoSrc(null);
      }
    }
  };

  const breadcrumbs = [
    {
      path: `/`,
      primary: profile.name || "",
    },
    { primary: "Settings" }
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!organization) {
      alerts.dispatch({
        payload: {
          body: "Unable to determine organization selected",
          title: "Error",
        },
        type: "ADD_ALERT",
      });
      return;
    }

    if (!address || !nameTextField.value) {
      alerts.dispatch({
        payload: {
          body: "All fields are required",
          title: "Error",
        },
        type: "ADD_ALERT",
      });
      return;
    }


    try {
      if (organization && organization.state) {
        const input = {
          address,
          coordinates,
          file: {
            id: file.id,
            name: file.name,
          },
          id: organization.state.id,
          name: nameTextField.value,
        };
        const variables = { input };
        updateKarmaOrganization.execute({ variables });
      }
    } catch (error) {
      alerts.dispatch({
        payload: {
          body: error.message || error,
          title: "Error",
        },
        type: "ADD_ALERT",
      });
    }
  };
  const handleDelete = async () => {
    try {
      const removed = await Storage.remove(file.name);
      setFile(removed);
      const variables = { input: { id: file.id } };
      deleteLogo.execute({ variables });
      setLogoSrc("");
    } catch (error) {
      alerts.dispatch({
        payload: {
          body: error.message || error,
          title: "Error",
        },
        type: "ADD_ALERT",
      });
    }
  };
  const handleFieldChange = () => async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const openedFile = e.target.files[0];
        if (openedFile && organization.state) {
          setLogoSrc(Loader);
          const id = uuid.v4();
          const extension = openedFile.name.split(".").pop();
          const params = {
            date_created: moment().format(),
            file: id + "." + extension,
            id,
            name: openedFile.name,
            user: organization.state.id
          };
          const variables = { input: params };
          createLogo.execute({ variables });
          const config = {
            contentType: openedFile.type,
            level: 'public',
          };
          const response: IKey = await Storage.put(params.name, openedFile, config);
          if (response && response.key) {
            const imgUrl = await Storage.get(response.key);
            setLogoSrc(imgUrl);
          }
          setFile({ name: params.name, id: params.id});
          notification.dispatch({
            payload: {
              message: "In order to save logo, click 'Submit'"
            },
            type: "ADD_NOTIFICATION",
          });
        }
      }
    } catch (e) {
      setLogoSrc(null);
      notification.dispatch({
        payload: {
          message: "Something went wrong"
        },
        type: "ADD_NOTIFICATION",
      });
    }
  };

  const handleSelect = (payload: IPlacesAutoComplete) => {
    setAddress(payload.address);
    setCoordinates(payload.coordinates);
  };

  return (
    <div className="wrapper">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader title="Edit Organization" />
              <Divider />
              <CardContent>
                <div className="wrapper">
                  <div className={classes.logoWrap}>
                    <input
                      className={"logoInput"}
                      type="file"
                      onChange={handleFieldChange()}
                      name="name"
                    />
                    <p>Logo</p>
                    {logoSrc && (
                      <img
                        className={classes.logoImg}
                        src={logoSrc}
                        alt="Logo"
                      />
                    )}
                  </div>
                  <Button
                    color="primary"
                    size="medium"
                    onClick={handleDelete}
                    variant="contained"
                    disabled={!logoSrc}
                  >
                    Delete Logo
                  </Button>
                  <Grid container={true} spacing={3} justify="center">
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...nameTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <LocationAutoComplete
                        handleSelect={handleSelect}
                        disableCurrentLocation={true}
                        value={profile.address}
                      />
                    </Grid>
                  </Grid>
                </div>
                <CardActions>
                  {organization && (
                    <Button
                      id="cancel"
                      onClick={handleClick(`/`)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    id="submit"
                    color="primary"
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
      <TransactionsList/>
    </div>
  );
};

export default Edit;
