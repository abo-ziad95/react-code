import Karma from "@hatech/karma-core";
import React from "react";
import "./app.css";
import Search from "./components/search";
import JobsContextProvider from "./context/jobs";
import LocationContextProvider from "./context/location";
import Router from "./views/router";

const App: React.FC = () => {
  return (
    <LocationContextProvider>
      <Karma layout="search" menu={<Search />}>
        <JobsContextProvider>
          <Router />
        </JobsContextProvider>
      </Karma>
    </LocationContextProvider>
  );
};

export default App;
