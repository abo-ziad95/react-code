import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import React from "react";
import useReactRouter from "use-react-router";
import { GET_CANDIDATE } from "../graphql/candidates";

export interface ICandidate {
  [key: string]: any;
}

interface IAction {
  payload: ICandidate | null | undefined;
  type: "SET_CANDIDATE" | "UNSET_CANDIDATE";
}

export interface ICandidateContext {
  dispatch: React.Dispatch<IAction>;
  state: ICandidate | null | undefined;
}

const initialState: ICandidate | null | undefined = undefined;

const initialCandidateContext: ICandidateContext = {
  dispatch: () => ({}),
  state: initialState,
};

export const CandidateContext = React.createContext(initialCandidateContext);

/**
 * Reducer used to updated the state of the Context Provider
 * @param state Current state of context
 * @param action Dispatch action used for reducer
 */

const reducer = (state: ICandidate | null | undefined, action: IAction) => {
  switch (action.type) {
    case "SET_CANDIDATE":
      return action.payload;
    case "UNSET_CANDIDATE":
      return null;
    default:
      return state;
  }
};

/**
 * A Context Provider wrapper to provided global state functionality to its children
 * @param props Properties of a standard React Function Component
 */

const CandidateContextProvider: React.FC = props => {
  const { match } = useReactRouter();
  const params = match.params as { candidateId: string };
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const candidate = useApolloQuery(GET_CANDIDATE);

  const effect = () => {
    if (!params.candidateId) {
      dispatch({
        payload: undefined,
        type: "UNSET_CANDIDATE",
      });
      return;
    }

    const variables = { id: params.candidateId };
    candidate.execute({ variables });
  };

  React.useEffect(effect, [params.candidateId]);

  React.useEffect(() => {
    if (candidate.data && candidate.data.getKarmaCandidates) {
      dispatch({
        payload: candidate.data.getKarmaCandidates,
        type: "SET_CANDIDATE",
      });
    }
  }, [candidate.data]);

  return (
    <CandidateContext.Provider value={{ state, dispatch }}>
      {props.children}
    </CandidateContext.Provider>
  );
};

export default CandidateContextProvider;
