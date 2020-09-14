import React, { useEffect, useState } from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";
import Navigation from "./Navigation";
import OrderCounter from "./OrderCounter";
import Filter from "./Filter";

const Header: React.FC = () => {
  const history = useHistory();
  const [searchParam, setSearchParam] = useState<string>(
    history.location.search
  );
  useEffect(() => {
    if (!history.location.search) {
      history.push({
        search: "?new",
      });
      setSearchParam("?new");
    }
  }, [history]);
  const setParam = (search: string) => {
    history.push({
      pathname: history.location.pathname,
      search,
    });
    setSearchParam(search);
  };
  return (
    <header className="header">
      <Navigation searchParam={searchParam} />
      <OrderCounter />
      <Filter activeBtn={searchParam} setParam={setParam} />
    </header>
  );
};
export default Header;
