import { Coords } from "google-map-react";
import React from "react";

export interface IJob {
  address: string;
  applicant_total?: number;
  city: string;
  company: string;
  coordinates: Coords;
  description: string;
  id: string;
  organization: string;
  state: string;
  title: string;
  zip: string;
}

interface IAction {
  payload?: IJob;
  type: "SET_JOB";
}

export interface IJobContext {
  dispatch: React.Dispatch<IAction>;
  state?: IJob | null;
}

const initialState: IJob | undefined | null = undefined;

const initialJobContext: IJobContext = {
  state: initialState,
  dispatch: () => {}
};

export const JobContext = React.createContext(initialJobContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: IJob | undefined | null, action: IAction) => {
  switch (action.type) {
    case "SET_JOB":
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

const JobContextProvider: React.FC = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return <JobContext.Provider value={{ state, dispatch }}>{props.children}</JobContext.Provider>;
};

export default JobContextProvider;
