import * as React from "react";
import useReactRouter from "use-react-router";
import { DrawerContext } from "../../context/drawer";

/**
 * Custom Hook to push path to react router
 * via click / push method
 */

const useHistoryPush = () => {
  const { history } = useReactRouter();
  const drawer = React.useContext(DrawerContext);

  const handleClick = (path: string) => (event: React.MouseEvent) => {
    drawer.dispatch({ type: "CLOSE_DRAWER" });
    history.push(path);
  };
  
  const push = (path: string) => {
    history.push(path);
  };

  return { handleClick, push };
};

export default useHistoryPush;
