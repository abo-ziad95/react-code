import { UserContext } from "@hatech/karma-core/context/user";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import React from "react";
import { GET_PROFILE } from "../graphql/user/profile";

export interface ICoords {
  lat: number;
  lng: number;
}

export interface IAddress {
  address: string;
  coordinates: ICoords;
  default?: boolean;
  type?: string;
}

export interface IProfile {
  address?: string;
  addresses?: IAddress[];
  email_verified: "true" | "false";
  email: string;
  family_name: string;
  full_name: string;
  given_name: string;
  id: string;
  phone_number?: string;
  phone_number_verified?: "true" | "false";
  status: "active" | "inactive";
  sub: string;
  user_status:
    | "ARCHIVED"
    | "COMPROMISED"
    | "CONFIRMED"
    | "FORCE_CHANGE_PASSWORD"
    | "RESET_REQUIRED"
    | "UNCONFIRMED"
    | "UNKNOWN";
}

interface IAction {
  payload?: IProfile;
  type: "SET_PROFILE";
}

export interface IProfileContext {
  dispatch: React.Dispatch<IAction>;
  state?: IProfile | null;
}

const initialState: IProfile | null | undefined = undefined;

const initialProfileContext: IProfileContext = {
  state: initialState,
  dispatch: () => {}
};

export const ProfileContext = React.createContext(initialProfileContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: IProfile | null | undefined, action: IAction) => {
  switch (action.type) {
    case "SET_PROFILE":
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

const ProfileContextProvider: React.FC = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const user = React.useContext(UserContext);
  const userId = user.state && user.state.identity.sub;
  const profile = useApolloQuery(GET_PROFILE);
  const profileResults = profile.data && profile.data.getKarmaUserProfiles;

  const effect = () => {
    if (userId) {
      profile.execute({ variables: { id: userId } });
    }

    if (profileResults) {
      dispatch({
        type: "SET_PROFILE",
        payload: profileResults
      });
    }
  };
  React.useEffect(effect, [profileResults, userId]);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileContextProvider;
