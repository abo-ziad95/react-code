import React from "react";

interface IAction {
  payload: IHead;
  type: "SET_HEAD";
}

export interface IHead {
  title: string;
}

export interface IHeadContext {
  dispatch: React.Dispatch<IAction>;
  state: IHead;
}

const initialState: IHead = { title: "Karma Careers" };

const initialHeadContext: IHeadContext = {
  dispatch: () => {
    return;
  },
  state: initialState
};

export const HeadContext = React.createContext(initialHeadContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: IHead, action: IAction) => {
  switch (action.type) {
    case "SET_HEAD":
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

const HeadContextProvider: React.FC = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  let title = process.env.REACT_APP_SITE_TITLE;

  if (title) {
    title += " | " + state.title;
  } else {
    title = state.title;
  }

  React.useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return <HeadContext.Provider value={{ state, dispatch }}>{props.children}</HeadContext.Provider>;
};

export default HeadContextProvider;
