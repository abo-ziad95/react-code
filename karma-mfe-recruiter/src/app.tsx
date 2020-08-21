import Karma from "@hatech/karma-core";
import React from "react";
import "./app.css";
import Router from "./views/router";

const App: React.FC = () => {
  return (
    <Karma layout="recruiter">
      <Router />
    </Karma>
  );
};

export default App;
