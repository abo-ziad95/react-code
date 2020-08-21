import _ from "lodash";
import React from "react";
import config from "../config";
import useGetRequest from "../hooks/api/useGetRequest";
import { ILocation } from "./location";
import { SessionContext } from "./session";

export interface IUser {
  family_name: string;
  full_name: string;
  given_name: number;
  id: string;
  preferences?: ILocation;
  sub: string;
  email?: string;
  phone_number?: string;
}

interface IAction {
  payload?: IUser | null;
  type: "SET_USER";
}

export interface IUserContext {
  dispatch: React.Dispatch<IAction>;
  state?: IUser | null;
}

const initialState: IUser | null | undefined = undefined;

const initialUserContext: IUserContext = {
  state: initialState,
  dispatch: () => {}
};

export const UserContext = React.createContext(initialUserContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: IUser | null | undefined, action: IAction) => {
  switch (action.type) {
    case "SET_USER":
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

const UserContextProvider: React.FC = props => {
  const session = React.useContext(SessionContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { get } = useGetRequest();

  const getUser = async () => {
    if (_.isUndefined(session.state)) {
      return;
    }

    if (_.isNull(session.state)) {
      dispatch({ payload: null, type: "SET_USER" });
      return;
    }

    const { data, status } = await get(`${config.api}/users/${session.state.sub}`);
    if (status === 200) {
      dispatch({ payload: data.results, type: "SET_USER" });
    }
  };

  const callback = React.useCallback(getUser, [session.state]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return <UserContext.Provider value={{ state, dispatch }}>{props.children}</UserContext.Provider>;
};

export default UserContextProvider;
