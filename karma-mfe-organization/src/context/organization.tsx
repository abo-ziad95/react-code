import { UserContext } from "@hatech/karma-core/context/user";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import React from "react";
import { GET_ORGANIZATION } from "../graphql/organization";

export interface IOrganization {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  logo: string;
  file: IFile;
}

interface IFile {
  name: string;
  id: string;
}

interface IAction {
  payload: IOrganization | null | undefined;
  type: "SET_ORGANIZATION" | "UNSET_ORGANIZATION";
}

export interface IOrganizationContext {
  dispatch: React.Dispatch<IAction>;
  state: IOrganization | null | undefined;
}

const initialState: IOrganization | null | undefined = undefined;

const initialOrganizationContext: IOrganizationContext = {
  dispatch: () => {
    return;
  },
  state: initialState
};

export const OrganizationContext = React.createContext(initialOrganizationContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: IOrganization | null | undefined, action: IAction) => {
  switch (action.type) {
    case "SET_ORGANIZATION":
      return action.payload;
    case "UNSET_ORGANIZATION":
      return null;
    default:
      return state;
  }
};

/**
 * A Context Provider wrapper to provided global state functionality
 * to its children
 * @param props Properties of a standard React Function Component
 */

const OrganizationContextProvider: React.FC = props => {
  const user = React.useContext(UserContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const organization = useApolloQuery(GET_ORGANIZATION);

  const effect = () => {
    if (user.state) {
      const variables = {
        id: user.state.identity.organization
      };
      organization.execute({ variables });
    }
  };
  React.useEffect(effect, [user.state]);

  React.useEffect(() => {
    if (organization.data && organization.data.getKarmaOrganizations) {
      dispatch({
        payload: organization.data.getKarmaOrganizations,
        type: "SET_ORGANIZATION"
      });
    }
  }, [organization.data]);

  return (
    <OrganizationContext.Provider value={{ state, dispatch }}>
      {props.children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContextProvider;
