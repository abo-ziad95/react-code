import * as React from "react";
import useReactRouter from "use-react-router";
import useGetRequest from "./api/useGetRequest";

export interface IOrganization {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

/**
 * Custom Hook to retrieve Organization by id.
 * @param id ID of Organization set be react-router path param
 */

const useGetOrganization = () => {
  const [organization, setOrganization] = React.useState<IOrganization>();
  const { get } = useGetRequest();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };

  const getOrganization = async () => {
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/organizations/${id}`;
    const { data, status } = await get(url);
    if (status === 200) {
      setOrganization(data.results);
    }
  };

  const callback = React.useCallback(getOrganization, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return organization;
};

export default useGetOrganization;
