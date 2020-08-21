import React from "react";
import Account from "./account";
import Authentication from "./authentication";
import Organization from "./organization";
import Recruiter from "./recruiter";
import Search from "./search";

export type ILayout =
  | "account"
  | "authentication"
  | "organization"
  | "payer"
  | "recruiter"
  | "search";

interface IProps {
  layout?: ILayout;
  menu?: React.ReactNode;
}

const Layout: React.FC<IProps> = props => {
  switch (props.layout) {
    case "account":
      return <Account>{props.children}</Account>;
    case "authentication":
      return <Authentication>{props.children}</Authentication>;
    case "search":
      return <Search menu={props.menu}>{props.children}</Search>;
    case "organization":
      return <Organization>{props.children}</Organization>;
    case "recruiter":
      return <Recruiter>{props.children}</Recruiter>;
    default:
      return <React.Fragment>{props.children}</React.Fragment>;
  }
};

export default Layout;
