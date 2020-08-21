import { CognitoUser } from "@aws-amplify/auth";
import { HubCapsule } from "@aws-amplify/core/lib/Hub";
import { Auth, Hub } from "aws-amplify";
import axios from "axios";
import React from "react";
import { AlertsContext } from "./alerts";
import _ from "lodash";

export interface ISession {
  "cognito:groups"?: string[];
  auth_time: number;
  exp: number;
  iat: number;
  sub: string;
  username: string;
  refreshSession(): void;
}

interface IAction {
  payload?: ISession | null;
  type: "SET_SESSION";
}

export interface ISessionContext {
  dispatch: React.Dispatch<IAction>;
  state?: ISession | null;
}

const initialState: ISession | null | undefined = undefined;

const initialSessionContext: ISessionContext = {
  state: initialState,
  dispatch: () => {}
};

export const SessionContext = React.createContext(initialSessionContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: ISession | null | undefined, action: IAction) => {
  switch (action.type) {
    case "SET_SESSION":
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

const SessionContextProvider: React.FC = props => {
  const alerts = React.useContext(AlertsContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const refreshSession = async () => {
    try {
      const session = await Auth.currentSession();
      const user: CognitoUser = await Auth.currentAuthenticatedUser();
      user.refreshSession(session.getRefreshToken(), async (error, session) => {
        if (error) {
          console.log(error);
          return;
        }
        await validateSession();
      });
    } catch (error) {
      alerts.dispatch({
        type: "ADD_ALERT",
        payload: {
          title: "Error",
          body: error
        }
      });
    }
  };

  const validateSession = async () => {
    try {
      const session = await Auth.currentSession();
      axios.defaults.headers.common = {
        Authorization: session.getIdToken().getJwtToken()
      };
      const token = session.getAccessToken();
      const payload = token.decodePayload() as ISession;
      payload.refreshSession = refreshSession;
      dispatch({ type: "SET_SESSION", payload });
    } catch (error) {
      dispatch({ type: "SET_SESSION", payload: null });
      // Mute error
    }
  };

  const callback = React.useCallback(validateSession, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  React.useEffect(() => {
    const handleHub = (data: HubCapsule) => {
      if (data.payload.event === "signIn") {
        callback();
        return Hub.remove("auth", handleHub);
      }
    };
    Hub.listen("auth", handleHub);
  }, [callback]);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {!_.isUndefined(state) && props.children}
    </SessionContext.Provider>
  );
};

export default SessionContextProvider;
