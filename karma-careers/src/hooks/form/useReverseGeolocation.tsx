import { Coords } from "google-map-react";
import _ from "lodash";
import * as React from "react";
import { AlertsContext } from "../../context/alerts";
import { UserContext } from "../../context/user";
import useGetRequest from "../api/useGetRequest";

interface ILocation {
  address?: string;
  coordinates?: Coords;
}

const useReverseGeolocation = () => {
  const [location, setLocation] = React.useState<ILocation>();
  const { get, cancelToken } = useGetRequest();
  const user = React.useContext(UserContext);
  const alerts = React.useContext(AlertsContext);

  const reverseGeolocation = async (coordinates: Coords) => {
    const latlng = `${coordinates.lat}, ${coordinates.lng}`;
    const params = { latlng };
    const url = "https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/geolocation";
    const { data, status } = await get(url, { params });
    if (status === 200) {
      const address = data.results[0].formatted_address;
      setLocation({ address, coordinates });
    }
  };

  const handlePosition = (position: Position) => {
    const coordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    reverseGeolocation(coordinates);
  };

  const handleAlert = () => {
    alerts.dispatch({
      type: "ADD_ALERT",
      payload: {
        title: "Error",
        body: "Please set a location to search for a job"
      }
    });
  };

  const callback = React.useCallback(handlePosition, []);
  const alertCallback = React.useCallback(handleAlert, []);
  React.useEffect(() => {
    if (user.state && user.state.preferences) {
      const { address, coordinates } = user.state.preferences;
      setLocation({ address, coordinates });
    } else if (navigator.geolocation && _.isNull(user.state)) {
      navigator.geolocation.getCurrentPosition(callback);
    } else if (navigator.geolocation && user.state && !user.state.preferences) {
      navigator.geolocation.getCurrentPosition(callback);
    } else if (!navigator.geolocation && !_.isUndefined(user.state)) {
      alertCallback();
    }
  }, [callback, user.state, alertCallback]);

  return { results: location, cancelToken };
};

export default useReverseGeolocation;
