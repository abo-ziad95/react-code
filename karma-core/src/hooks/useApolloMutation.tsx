import { MutationHookOptions, useMutation } from "@apollo/react-hooks";
import { DocumentNode } from "graphql";
import React from "react";
import { AlertsContext } from "../context/alerts";

const useApolloMutation = (mutation: DocumentNode, options?: MutationHookOptions) => {
  const [execute, results] = useMutation(mutation, options);
  const alerts = React.useContext(AlertsContext);

  const effect = () => {
    if (results.error) {
      alerts.dispatch({
        payload: {
          body: results.error.message
        },
        type: "ADD_ALERT"
      });
    }
  };
  React.useEffect(effect, [results.error]);

  return {
    execute,
    ...results
  };
};

export default useApolloMutation;
