import axios, { AxiosRequestConfig } from "axios";
import * as React from "react";
import { AlertsContext } from "../../context/alerts";

/**
 * Makes GET request to HTTP endpoint
 * @param url HTTP endpoint
 * @param config HTTP client configurations
 */

const useGetRequest = () => {
  const alerts = React.useContext(AlertsContext);
  const [loading, setLoading] = React.useState(false);
  const cancelToken = axios.CancelToken.source();

  const cancel = () => {
    cancelToken.cancel("Request Canceled");
  };

  const callback = React.useCallback(cancel, []);
  React.useEffect(() => {
    return callback;
  }, [callback]);

  const get = async (url: string, config: AxiosRequestConfig = {}) => {
    try {
      setLoading(true);
      config.cancelToken = cancelToken.token;
      const { data, status } = await axios.get(url, config);
      setLoading(false);
      return { data, status };
    } catch (error) {
      if (!axios.isCancel(error)) {
        alerts.dispatch({
          type: "ADD_ALERT",
          payload: {
            title: "Error",
            body: error.response ? error.response.data : error.message
          }
        });
      }

      const status = error.response ? error.response.status : error.message;
      setLoading(false);
      return { status };
    }
  };

  return { get, loading, cancelToken };
};

export default useGetRequest;
