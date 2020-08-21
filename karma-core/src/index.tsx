import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import Amplify from "aws-amplify";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import amplify from "./config/amplify";
import muiTheme from "./config/muiTheme";
import GlobalContextProvider from "./context/global";
import "./global.css";
import Layout, { ILayout } from "./layouts";

Amplify.configure(amplify);
const theme = createMuiTheme(muiTheme);

interface IProps {
  layout?: ILayout;
  menu?: React.ReactNode;
}

const Karma: React.FC<IProps> = props => {
  console.log('run')
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <Layout layout={props.layout} menu={props.menu}>
            {props.children}
          </Layout>
        </MuiThemeProvider>
      </BrowserRouter>
    </GlobalContextProvider>
  );
};

export default Karma;
