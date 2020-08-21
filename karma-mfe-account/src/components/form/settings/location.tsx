import { AlertsContext } from "@hatech/karma-core/context/alerts";
import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import { createMuiTheme } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import { ThemeProvider } from "@material-ui/styles";
import _ from "lodash";
import React from "react";
import { ProfileContext } from "../../../context/profile";
import { UPDATE_PROFILE } from "../../../graphql/user/profile";
import PlacesAutoComplete, {
  IPlacesAutoComplete
} from "../../google/placesAutoComplete";
import { CardPlaceholder } from "../../placeholders";
import { IAddress } from "../../types";
import Address from "./address";

const override = createMuiTheme({
  overrides: {
    MuiCardHeader: {
      action: {
        display: "flex",
        flex: 1,
        maxWidth: 500,
        width: 350
      },
      title: {
        display: "inline-flex",
        flex: 1
      }
    }
  }
});

/**
 * A React Functional Component that displays ta list of the candidates saved addresses
 * @param props
 */

const Location: React.FC = () => {
  const alerts = React.useContext(AlertsContext);
  const notifications = React.useContext(NotificationContext);
  const profile = React.useContext(ProfileContext);
  const updateProfile = useApolloMutation(UPDATE_PROFILE);
  const [addresses, setAddresses] = React.useState<IAddress[]>([]);

  const setAddressState = () => {
    if (profile.state && profile.state.addresses) {
      setAddresses(
        _.sortBy(profile.state.addresses, address => address.default !== true)
      );
    }
  };
  React.useEffect(setAddressState, [profile.state]);

  const mutationEffect = () => {
    if (updateProfile.data) {
      handleNotifications("Profile Updated");
    }
  };
  React.useEffect(mutationEffect, [updateProfile.data]);

  const handleAlerts = (title?: string, body?: any) => {
    alerts.dispatch({
      payload: {
        body,
        title
      },
      type: "ADD_ALERT"
    });
  };

  const handleNotifications = (message: any) => {
    notifications.dispatch({
      payload: {
        message
      },
      type: "ADD_NOTIFICATION"
    });
  };

  const handleTypeNameDelete = () => {
    if (addresses) {
      const newAddresses = addresses.map(address => {
        delete address.__typename;
        delete address.coordinates.__typename;
        return address;
      });
      setAddresses(newAddresses);
    }
  };

  const handleSelect = async (payload: IPlacesAutoComplete) => {
    if (!profile.state) {
      handleAlerts("Error", "No user is logged in");
      return;
    }

    if (!payload.address) {
      return;
    }

    const existingAddresses = profile.state && profile.state.addresses;

    const address = {
      address: payload.address,
      coordinates: payload.coordinates,
      default: !addresses.length ? true : false
    };

    const params = {
      addresses: existingAddresses
        ? [...existingAddresses, address]
        : [address],
      id: profile.state.id
    };

    if (addresses.length >= 5) {
      handleAlerts("Sorry", "You Can only have a total of five addresses");
      return;
    }

    handleTypeNameDelete();
    addresses.push(address);
    setAddresses(addresses);
    const variables = { input: params };
    updateProfile.execute({ variables });
  };

  const resetAddresses = (newAddresses: IAddress[]) => {
    if (!newAddresses) {
      return;
    }
    setAddresses(newAddresses);
  };

  return (
    <React.Fragment>
      {!profile.state && <CardPlaceholder content={true} />}
      {profile.state && (
        <Card>
          <ThemeProvider theme={override}>
            <CardHeader
              title={`Preferred Location`}
              action={<PlacesAutoComplete handleSelect={handleSelect}/>}
            />
          </ThemeProvider>
          <Divider />
          <CardContent>
            {!_.isEmpty(addresses) &&
              addresses.map((address, index) => {
                return (
                  <Address
                    resetAddresses={resetAddresses}
                    address={address}
                    key={index}
                  />
                );
              })}
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
};

export default Location;
