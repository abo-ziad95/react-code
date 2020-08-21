import { CognitoUser } from "@aws-amplify/auth";
import { HubCapsule } from "@aws-amplify/core/lib/Hub";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { Auth, Hub } from "aws-amplify";
import React, { useCallback } from "react";
import { AlertsContext } from "./alerts";

interface IIdentity {
  [key: string]: any;
}

interface IUser {
  identity: IIdentity;
  refreshSession?: () => Promise<void>;
  session: CognitoUserSession;
}

interface IAction {
  payload?: IUser | null;
  type: "SET_USER" | "SIGN_OUT";
}

export interface IUserContext {
  dispatch: React.Dispatch<IAction>;
  state: IUser | null | undefined;
}

const initialState: IUser | null | undefined = undefined;

const initialUserContext: IUserContext = {
  dispatch: () => {
    return;
  },
  state: initialState
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
    case "SIGN_OUT":
      Auth.signOut();
      return state;
    default:
      return state;
  }
};

/**
 * A Context Provider wrapper to provided global state functionality to its children
 * @param props Properties of a standard React Function Component
 */

const UserContextProvider: React.FC = props => {
  const alerts = React.useContext(AlertsContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const refreshSession = async () => {
    try {
      const session = await Auth.currentSession();
      const user: CognitoUser = await Auth.currentAuthenticatedUser();
      user.refreshSession(session.getRefreshToken(), async error => {
        if (error) {
          console.log(error);
          return;
        }
        await validateSession();
      });
    } catch (error) {
      alerts.dispatch({
        payload: {
          body: error,
          title: "Error"
        },
        type: "ADD_ALERT"
      });
    }
  };

  const validateSession = async () => {
    try {
      const session = await Auth.currentSession();
      const identity = session.getIdToken().decodePayload();
      const payload = { identity, refreshSession, session };
      dispatch({ type: "SET_USER", payload });
    } catch (error) {
      console.log(error);
      dispatch({ type: "SET_USER", payload: null });
      // Mute error
    }
  };

  const callback = useCallback(validateSession, []);

  React.useEffect(() => {
    callback();
  }, [callback]);

  React.useEffect(() => {
    const handleHub = (data: HubCapsule) => {
      switch (data.payload.event) {
        case "signIn":
          callback();
          break;
        case "signOut":
          window.location.href = "/";
          break;
        default:
        // mute event
      }
    };
    Hub.listen("auth", handleHub);
  }, [callback]);

  return <UserContext.Provider value={{ state, dispatch }}>{props.children}</UserContext.Provider>;
};

export default UserContextProvider;
