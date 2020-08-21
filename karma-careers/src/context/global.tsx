import React from "react";
import AlertsContextProvider from "./alerts";
import DrawerContextProvider from "./drawer";
import JobContextProvider from "./job";
import LocationContextProvider from "./location";
import MemberContextProvider from "./member";
import SessionContextProvider from "./session";
import UserContextProvider from "./user";

/**
 * A Context Provider wrapper to provided global state functionality
 * to its children
 * @param props Properties of a standard React Function Component
 */

const GlobalContextProvider: React.FC = props => {
  return (
    <AlertsContextProvider>
      <SessionContextProvider>
        <UserContextProvider>
          <DrawerContextProvider>
            <LocationContextProvider>
              <MemberContextProvider>
                <JobContextProvider>{props.children}</JobContextProvider>
              </MemberContextProvider>
            </LocationContextProvider>
          </DrawerContextProvider>
        </UserContextProvider>
      </SessionContextProvider>
    </AlertsContextProvider>
  );
};

export default GlobalContextProvider;
