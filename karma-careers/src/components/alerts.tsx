import _ from "lodash";
import * as React from "react";
import { AlertsContext, IAlert } from "../context/alerts";
import Dialog from "./dialog";

/**
 * React Function Component that renders Material-UI Dialog
 * for each alert within GlobalContext
 * @param props React Function Component parameters
 */

const Alerts: React.FC = () => {
  const alerts = React.useContext(AlertsContext);

  const handleCancel = (payload: IAlert, index: number) => () => {
    payload.open = false;
    alerts.dispatch({
      type: "REMOVE_ALERT",
      payload,
      index
    });
  };

  return (
    <React.Fragment>
      {alerts.state.map((alert, index) => (
        <Dialog
          key={index}
          title={alert.title}
          body={alert.body}
          open={_.isUndefined(alert.open) || alert.open}
          handleCancel={handleCancel(alert, index)}
        />
      ))}
    </React.Fragment>
  );
};

export default Alerts;
