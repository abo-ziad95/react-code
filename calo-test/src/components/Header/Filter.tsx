import React from "react";
import "./Header.css";
import { IHeader } from "../../config/interfaces";

const Filter: React.FC<IHeader> = ({ setParam, activeBtn }) => {
  const handleClick = (search: string) => {
    setParam(search);
  };

  return (
    <div>
      <button
        onClick={() => handleClick("?new")}
        type="button"
        className={activeBtn === "?new" ? "btn active" : "btn"}
      >
        New
      </button>
      <button
        onClick={() => handleClick("?delivered")}
        type="button"
        className={activeBtn === "?delivered" ? "btn active" : "btn"}
      >
        Delivered
      </button>
    </div>
  );
};

export default Filter;
