import React from "react";

export interface IAlert {
  body: React.ReactNode;
  open?: boolean;
  title: React.ReactNode;
}

interface IAction {
  index?: number;
  payload: IAlert;
  type: "ADD_ALERT" | "REMOVE_ALERT";
}

export interface IAlertsContext {
  dispatch: React.Dispatch<IAction>;
  state: IAlert[];
}

const initialState: IAlert[] = [];

const initialAlertsContext: IAlertsContext = {
  state: initialState,
  dispatch: () => {}
};

export const AlertsContext = React.createContext(initialAlertsContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: IAlert[] = initialState, action: IAction) => {
  switch (action.type) {
    case "ADD_ALERT":
      return [...state, action.payload];
    case "REMOVE_ALERT":
      state[action.index as number].open = false;
      return [...state];
    default:
      return state;
  }
};

/**
 * A Context Provider wrapper to provided global state functionality
 * to its children
 * @param props Properties of a standard React Function Component
 */

const AlertsContextProvider: React.FC = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <AlertsContext.Provider value={{ state, dispatch }}>{props.children}</AlertsContext.Provider>
  );
};

export default AlertsContextProvider;
