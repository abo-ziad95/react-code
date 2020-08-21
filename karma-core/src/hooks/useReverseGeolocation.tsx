import axios from "axios";
import React from "react";
import { AlertsContext } from "../context/alerts";
import { ICoords } from "../context/location";
import { UserContext } from "../context/user";

interface ILocation {
  address?: string;
  coordinates?: ICoords;
}

const useReverseGeolocation = () => {
  const [location, setLocation] = React.useState<ILocation>();
  const user = React.useContext(UserContext);
  const alerts = React.useContext(AlertsContext);

  const reverseGeolocation = async (coordinates: ICoords) => {
    const latlng = `${coordinates.lat}, ${coordinates.lng}`;
    const params = { latlng };
    const url = process.env.REACT_APP_REST_API + "/geolocation";
    const { data, status } = await axios.get(url, { params });
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
      payload: {
        body: "Please set a location to search for a job",
        title: "Error"
      },
      type: "ADD_ALERT"
    });
  };

  const callback = React.useCallback(handlePosition, []);
  const alertCallback = React.useCallback(handleAlert, []);
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callback);
    }
  }, [callback, user.state, alertCallback]);

  return { results: location };
};

export default useReverseGeolocation;
