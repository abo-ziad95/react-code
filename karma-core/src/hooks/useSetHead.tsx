import React from "react";
import { HeadContext, IHead } from "../context/head";

const useSetHead = (payload: IHead) => {
  const head = React.useContext(HeadContext);
  const [state, setState] = React.useState<IHead>(payload);

  const setHead = () => {
    head.dispatch({
      payload: state,
      type: "SET_HEAD"
    });
  };

  const callback = React.useCallback(setHead, [state]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return setState;
};

export default useSetHead;
