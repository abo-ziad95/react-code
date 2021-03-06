import axios, { AxiosRequestConfig } from "axios";
import * as React from "react";
import { AlertsContext } from "../../context/alerts";

interface IBody {
  [key: string]: any
}

/**
 * Makes PUT request to HTTP endpoint
 * @param url HTTP endpoint
 * @param config HTTP client configurations
 */

const usePutRequest = () => {
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

  const put = async (url: string, config: AxiosRequestConfig = {}, body: IBody = {}) => {
    try {
      setLoading(true);
      config.cancelToken = cancelToken.token;
      const { data, status } = await axios.put(url, body, config);
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

  return { put, loading, cancelToken };
};

export default usePutRequest;
