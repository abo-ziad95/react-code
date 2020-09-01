import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";

function App() {
  let routes = (
    <Switch>
      <Route path="/:service_slug?/:brand_slug?/:style_slug?" component={Dashboard} />
    </Switch>
  )
  return (
    <>
      {routes}
    </>
  );
}

export default App;
