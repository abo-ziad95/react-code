import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Amplify from "aws-amplify";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import config from "./config";
import GlobalContextProvider from "./context/global";
import Router from "./views/router";
Amplify.configure(config.amplify);
const muiTheme = createMuiTheme(config.muiTheme);

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <GlobalContextProvider>
          <CssBaseline />
          <Router />
        </GlobalContextProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

export default App;
