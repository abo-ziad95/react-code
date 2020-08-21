import Karma from "@hatech/karma-core";
import React from "react";
import "./app.css";
import OrganizationsContextProvider from "./context/organization";
import Router from "./views/router";

const App: React.FC = () => {
  return (
    <Karma layout="organization">
      <OrganizationsContextProvider>
        <Router />
      </OrganizationsContextProvider>
    </Karma>
  );
};

export default App;
