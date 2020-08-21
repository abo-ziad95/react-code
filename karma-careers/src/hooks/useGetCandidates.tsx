import { Coords } from "google-map-react";
import * as React from "react";
import useGetRequest from "./api/useGetRequest";

interface ICandidate {
  id: string;
  full_name: string;
  coordinates: Coords;
}

const useGetCandidates = () => {
  const [candidates, setCandidates] = React.useState<ICandidate[]>([]);
  const { get } = useGetRequest();

  const getCandidates = async () => {
    const url = "https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/candidates";
    const { data, status } = await get(url);
    if (status === 200) {
      setCandidates(data.results);
    }
  };

  const callback = React.useCallback(getCandidates, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return candidates;
};

export default useGetCandidates;
