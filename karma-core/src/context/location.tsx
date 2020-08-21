import React from "react";
import useReverseGeolocation from "../hooks/useReverseGeolocation";

export interface ICoords {
  lat: number;
  lng: number;
}

export interface ILocation {
  coordinates?: ICoords;
  address?: string;
}

interface IAction {
  payload?: ILocation;
  type: "SET_LOCATION";
}

export interface ILocationContext {
  dispatch: React.Dispatch<IAction>;
  state?: ILocation | null;
}

const initialState: ILocation | null | undefined = undefined;

const initialLocationContext: ILocationContext = {
  dispatch: () => {
    return;
  },
  state: initialState
};

export const LocationContext = React.createContext(initialLocationContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: ILocation | null | undefined, action: IAction) => {
  switch (action.type) {
    case "SET_LOCATION":
      return action.payload;
    default:
      return state;
  }
};

/**
 * A Context Provider wrapper to provided global state functionality
 * to its children
 * @param props Properties of a standard React Function Component
 */

const LocationContextProvider: React.FC = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const geoLocation = useReverseGeolocation();

  const setLocation = () => {
    if (!state) {
      dispatch({ type: "SET_LOCATION", payload: geoLocation.results });
    }
  };

  const callback = React.useCallback(setLocation, [geoLocation.results]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return (
    <LocationContext.Provider value={{ state, dispatch }}>
      {props.children}
    </LocationContext.Provider>
  );
};

export default LocationContextProvider;
