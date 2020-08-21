import React from "react";

export interface INotification {
  open?: boolean;
  message?: React.ReactNode;
}

interface IAction {
  index?: number;
  payload: INotification;
  type: "ADD_NOTIFICATION" | "REMOVE_NOTIFICATION";
}

export interface INotificationContext {
  dispatch: React.Dispatch<IAction>;
  state: INotification[];
}

const initialState: INotification[] = [];

const initialNotificationContext: INotificationContext = {
  dispatch: () => {
    return;
  },
  state: initialState
};

export const NotificationContext = React.createContext(initialNotificationContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: INotification[] = initialState, action: IAction) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [...state, action.payload];
    case "REMOVE_NOTIFICATION":
      state[action.index as number].open = false;
      return [...state];
    default:
      return state;
  }
};

/**
 * A Context Provider wrapper to provided global state functionality to its children
 * @param props Properties of a standard React Function Component
 */

const NotificationContextProvider: React.FC = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
