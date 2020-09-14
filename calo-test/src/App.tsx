import React from "react";
import { Route, Switch } from "react-router-dom";
import List from "./views/List";
import Map from "./views/Map";
import Header from "./components/Header/index";

const App: React.FC = () => {
  return (
    <div id="wrap">
      <Header />
      <Switch>
        <Route component={List} exact path="/" />
        <Route component={Map} exact path="/map" />
      </Switch>
    </div>
  );
};

export default App;
