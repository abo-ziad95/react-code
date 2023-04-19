import React from "react";

export const MenuItem = ({ id, value }) => {
  return (
    <li key={id} className="menu__list-item">
      <a href="#" className="menu__list-link">
        {value}
      </a>
    </li>
  );
};
