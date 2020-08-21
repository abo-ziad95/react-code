import useGetRequest from "./api/useGetRequest";
import useReactRouter from "use-react-router";
import * as React from "react";

interface IMember {
  full_name: string;
  id: string;
  organization: string;
  sub: string;
}

const useGetMembers = () => {
  const { get } = useGetRequest();
  const [members, setMembers] = React.useState<IMember[]>([]);
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };

  const getMembers = async () => {
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/members`;
    const params = { organization: id };
    const { data, status } = await get(url, { params });
    if (status === 200) {
      setMembers(data.results);
    }
  };

  const callback = React.useCallback(getMembers, [id]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return { members, getMembers };
};

export default useGetMembers;
