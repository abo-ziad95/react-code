import Karma from "@hatech/karma-core";
import React from "react";
import "./app.css";
import ProfileContextProvider from "./context/profile";
import Router from "./views/router";

const App: React.FC = () => {
  return (
    <Karma layout="account">
      <ProfileContextProvider>
        <Router />
      </ProfileContextProvider>
    </Karma>
  );
};

export default App;
