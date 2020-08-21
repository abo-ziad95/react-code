import React from "react";
import useGetRequest from "../hooks/api/useGetRequest";
import { SessionContext } from "./session";

export interface IMember {
  full_name: string;
  id: string;
  organization: string;
  sub: string;
}

interface IAction {
  payload?: IMember;
  type: "SET_ORGANIZATION";
}

export interface IMemberContext {
  dispatch: React.Dispatch<IAction>;
  state?: IMember | null;
}

const initialState: IMember | null | undefined = undefined;

const initialMemberContext: IMemberContext = {
  state: initialState,
  dispatch: () => {}
};

export const MemberContext = React.createContext(initialMemberContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: IMember | null | undefined, action: IAction) => {
  switch (action.type) {
    case "SET_ORGANIZATION":
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

const MemberContextProvider: React.FC = props => {
  const session = React.useContext(SessionContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { get } = useGetRequest();

  const getMember = async () => {
    if (!session.state || !session.state["cognito:groups"]) {
      return;
    }

    if (
      session.state["cognito:groups"].indexOf("organization_owner") === -1 &&
      session.state["cognito:groups"].indexOf("organization_member") === -1
    ) {
      return;
    }
    
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/members/${
      session.state.sub
    }`;
    const { data, status } = await get(url);
    if (status === 200) {
      dispatch({ payload: data.results, type: "SET_ORGANIZATION" });
    }
  };

  const callback = React.useCallback(getMember, [session.state]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return (
    <MemberContext.Provider value={{ state, dispatch }}>{props.children}</MemberContext.Provider>
  );
};

export default MemberContextProvider;
