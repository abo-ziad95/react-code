import React from "react";

interface IAction {
  payload?: string | null;
  type: "TOGGLE_DRAWER" | "CLOSE_DRAWER" | "OPEN_DRAWER";
}

export interface IDrawerContext {
  dispatch: React.Dispatch<IAction>;
  state?: string | null;
}

const initialState: string | null | undefined = undefined;

const initialDrawerContext: IDrawerContext = {
  dispatch: () => {
    return;
  },
  state: initialState
};

export const DrawerContext = React.createContext(initialDrawerContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: string | null | undefined, action: IAction) => {
  switch (action.type) {
    case "TOGGLE_DRAWER":
      return state === action.payload ? null : action.payload;
    case "CLOSE_DRAWER":
      return null;
    case "OPEN_DRAWER":
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

const DrawerContextProvider: React.FC = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <DrawerContext.Provider value={{ state, dispatch }}>{props.children}</DrawerContext.Provider>
  );
};

export default DrawerContextProvider;
