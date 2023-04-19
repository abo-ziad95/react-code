import React from "react";
import "../styles/components/Menu.css";
import { MenuItem } from "./MenuItem";

export const Menu = ({
  title,
  mainMenuLinks,
  secondaryMenuLinks,
  isActive,
  handleClickClose,
  menuTitleRef,
  MenuIconClose,
}) => {
  const handleEscapeKeyClose = (e) => e.key === "Escape" && handleClickClose();

  return (
    <div
      className={isActive ? "menu active" : "menu"}
      onClick={handleClickClose}
      onKeyDown={handleEscapeKeyClose}
    >
      <div className="menu__container">
        <div className="menu__content" onClick={(e) => e.stopPropagation()}>
          <header className="menu__header">
            <h2 className="menu__header-title" ref={menuTitleRef} tabIndex="2">
              {title}
            </h2>
            <div
              className="menu__close menu__header-close"
              onClick={handleClickClose}
              tabIndex="3"
            >
              <MenuIconClose />
            </div>
          </header>
          <hr className="menu__divider" />
          <div className="menu__body">
            <ul className="menu__body-list">
              {mainMenuLinks &&
                mainMenuLinks.map((item) => <MenuItem {...item} />)}
            </ul>
          </div>
          <footer className="menu__footer">
            <ul className="menu__footer-list">
              {secondaryMenuLinks &&
                secondaryMenuLinks.map((item) => <MenuItem {...item} />)}
            </ul>
          </footer>
        </div>
      </div>
    </div>
  );
};
