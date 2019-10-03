import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import classNames from "classnames";
import styles from "./Menu.module.scss";

const Menu = ({ light }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <div
        className={classNames(styles.menuContainer, {
          [styles.open]: open,
          [styles.light]: light
        })}
      >
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className={styles.icon} onClick={() => setOpen(!open)}>
                  {open ? (
                    <MdClose color={light ? "black" : "white"}></MdClose>
                  ) : (
                    <MdMenu color={light ? "black" : "white"}></MdMenu>
                  )}
                </div>
                <div className={styles.title}>
                  <Link to="/">Accessing Campscapes</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={classNames(styles.menuButtonsContainer, {
          [styles.open]: open,
          [styles.light]: light
        })}
      >
        <div className={`${styles.menuButtons} container`}>
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <NavLink to="/camps">Camps</NavLink>
                <NavLink to="/icons">Icons</NavLink>
                <NavLink to="/themes">Themes</NavLink>
                <NavLink to="/about">About the project</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Menu;
