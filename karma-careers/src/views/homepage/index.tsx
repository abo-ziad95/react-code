import * as React from "react";
import Splash from "./splash";
import Appbar from "../../components/appbar/index";
import Alerts from '../../components/alerts';
import { Helmet } from 'react-helmet';
import config from '../../config';

const Homepage: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet><title>{config.title} | Search for your dream job</title></Helmet>
      <Appbar />
      <Alerts />
      <Splash />
    </React.Fragment>
  );
};

export default Homepage;
