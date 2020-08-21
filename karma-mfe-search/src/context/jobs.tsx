import { AlertsContext } from "@hatech/karma-core/context/alerts";
import axios, { AxiosRequestConfig } from "axios";
import { Coords } from "google-map-react";
import queryString from "query-string";
import React from "react";
import useReactRouter from "use-react-router";
import { LocationContext } from "./location";

export interface IJob {
  address?: string;
  city?: string;
  company: string;
  coordinates: Coords;
  description: string;
  id: string;
  state?: string;
  title: string;
  zip?: string;
}

interface IAction {
  payload: IJob[];
  type: "SET_JOBS" | "UNSET_JOBS";
}

export interface IJobsContext {
  dispatch: React.Dispatch<IAction>;
  state: IJob[];
}

const initialState: IJob[] = [];

const initialJobsContext: IJobsContext = {
  state: initialState,
  dispatch: () => {}
};

export const JobsContext = React.createContext(initialJobsContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: IJob[], action: IAction) => {
  switch (action.type) {
    case "SET_JOBS":
      return action.payload;
    case "UNSET_JOBS":
      return [];
    default:
      return state;
  }
};

/**
 * A Context Provider wrapper to provided global state functionality
 * to its children
 * @param props Properties of a standard React Function Component
 */

const JobsContextProvider: React.FC = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const location = React.useContext(LocationContext);
  const alerts = React.useContext(AlertsContext);
  const router = useReactRouter();
  const { search, distance } = queryString.parse(router.location.search);
  const config: AxiosRequestConfig = { params: { search, distance } };
  if (location.state && location.state.coordinates) {
    config.params.lng = location.state.coordinates.lng;
    config.params.lat = location.state.coordinates.lat;
  }

  const getJobs = async () => {
    try {
      const url = "https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/jobs";
      const { data } = await axios.get(url, config);
      dispatch({
        type: "SET_JOBS",
        payload: data.results
      });
    } catch (error) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          body: error.message
        }
      });
    }
  };

  const callback = React.useCallback(getJobs, [router.location.search, location.state]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return <JobsContext.Provider value={{ state, dispatch }}>{props.children}</JobsContext.Provider>;
};

export default JobsContextProvider;
