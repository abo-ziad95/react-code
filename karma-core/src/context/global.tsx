import React from "react";
import AlertsContextProvider from "./alerts";
import ApolloContextProvider from "./apollo";
import DrawerContextProvider from "./drawer";
import HeadContextProvider from "./head";
import LocationContextProvider from "./location";
import NotificationContextProvider from "./notifications";
import UserContextProvider from "./user";

/**
 * Context Provider wrapper to provided global state functionality
 * @param props Properties of a standard React Function Component
 */

const GlobalContextProvider: React.FC = props => {
  return (
    <HeadContextProvider>
      <AlertsContextProvider>
        <NotificationContextProvider>
          <DrawerContextProvider>
            <UserContextProvider>
              <ApolloContextProvider>
                <LocationContextProvider>{props.children}</LocationContextProvider>
              </ApolloContextProvider>
            </UserContextProvider>
          </DrawerContextProvider>
        </NotificationContextProvider>
      </AlertsContextProvider>
    </HeadContextProvider>
  );
};

export default GlobalContextProvider;
