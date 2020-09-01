import React from 'react';
import Dropdown from "../coponents/Dropdown";
import {
  useParams
} from 'react-router-dom'
const Dashboard = () =>  {
  let { service_slug, brand_slug, style_slug } = useParams();
  return (
    <>
      <Dropdown match={service_slug} name="terms"/>
      <Dropdown match={brand_slug} name="brands_terms"/>
      <Dropdown match={style_slug}  name="styles"/>
    </>
  );
}

export default Dashboard;
