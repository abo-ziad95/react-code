import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

interface Props {
  searchParam: string;
}

const Navigation: React.FC<Props> = ({ searchParam }) => {
  return (
    <nav className="nav">
      <NavLink
        activeClassName="activeLink"
        className="link"
        to={{ pathname: "/", search: searchParam }}
        exact
      >
        List
      </NavLink>
      <NavLink
        to={{ pathname: "/map", search: searchParam }}
        exact
        className="link"
        activeClassName="activeLink"
      >
        Map
      </NavLink>
    </nav>
  );
};
export default Navigation;
