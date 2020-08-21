import React from "react";
import useReactRouter from "use-react-router";
import { UserContext } from "../context/user";

/**
 * Custom Hook to push path to react router
 * via click / push method
 */

const useHistoryPush = () => {
  const { history } = useReactRouter();
  const { dispatch } = React.useContext(UserContext);
  const handleClick = (path: string, reload?: boolean) => (event: React.MouseEvent) => {
    if (reload) {
      window.location.href = path;
      return;
    }

    if (path === "/logout") {
      dispatch({ type: "SIGN_OUT" });
      return;
    }

    history.push(path);
  };

  const push = (path: string, state?: any) => {
    history.push(path, state);
  };

  return { handleClick, push };
};

export default useHistoryPush;
