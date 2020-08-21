import React from "react";
import { AlertsContext } from "../context/alerts";
import { NotificationContext } from '../context/notifications';

export const MockAlert: React.FC = () => {
  const { dispatch } = React.useContext(AlertsContext);

  React.useEffect(() => {
    const payload = {
      body: "This is an alert",
      title: "Super Alert",
    };
    dispatch({ type: "ADD_ALERT", payload });

    
  }, [dispatch]);

  return null;
};

export const MockNotification: React.FC = () => {
  const { dispatch } = React.useContext(NotificationContext);

  React.useEffect(() => {
    const payload = {
      message: "This is a notification"
    };
    dispatch({ type: "ADD_NOTIFICATION", payload });

    
  }, [dispatch]);

  return null;
};
