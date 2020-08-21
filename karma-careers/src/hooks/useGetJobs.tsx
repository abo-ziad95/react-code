import queryString from "query-string";
import * as React from "react";
import useRouter from "use-react-router";
import { IJob } from "../context/job";
import useGetRequest from "./api/useGetRequest";
import { LocationContext } from "../context/location";
import { AxiosRequestConfig } from "axios";

const useGetJobs = () => {
  const [jobs, setJobs] = React.useState<IJob[]>([]);
  const locationContext = React.useContext(LocationContext);
  const { get } = useGetRequest();
  const { location } = useRouter();
  const { search, distance } = queryString.parse(location.search);
  const config: AxiosRequestConfig = { params: { search, distance } };
  if (locationContext.state && locationContext.state.coordinates) {
    config.params.lng = locationContext.state.coordinates.lng;
    config.params.lat = locationContext.state.coordinates.lat;
  }
  const getJobs = async () => {
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/jobs`;
    const { data, status } = await get(url, config);
    if (status === 200) {
      setJobs(data.results);
    }
  };

  const callback = React.useCallback(getJobs, [location.search, locationContext.state]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return jobs;
};

export default useGetJobs;
