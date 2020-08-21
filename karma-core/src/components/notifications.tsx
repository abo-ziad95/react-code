import Snackbar from "@material-ui/core/Snackbar";
import _ from "lodash";
import React from "react";
import { INotification, NotificationContext } from "../context/notifications";

/**
 * React Function Component that renders Material-UI Dialog
 * for each alert within GlobalContext
 */

const Notifications: React.FC = () => {
  const notifications = React.useContext(NotificationContext);

  const handleClose = (payload: INotification, index: number) => () => {
    payload.open = false;
    notifications.dispatch({
      index,
      payload,
      type: "REMOVE_NOTIFICATION"
    });
  };

  return (
    <React.Fragment>
      {notifications.state.map((notification, index) => (
        <Snackbar
          key={index}
          open={_.isUndefined(notification.open) || notification.open}
          message={notification.message}
          onClose={handleClose(notification, index)}
          autoHideDuration={4000}
        />
      ))}
    </React.Fragment>
  );
};

export default Notifications;
