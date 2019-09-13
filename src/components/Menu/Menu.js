import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import classNames from "classnames";
import styles from "./Menu.module.scss";

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <div
        className={classNames(styles.menuContainer, {
          [styles.open]: open
        })}
      >
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className={styles.icon} onClick={() => setOpen(!open)}>
                  {open ? <MdClose></MdClose> : <MdMenu></MdMenu>}
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
          [styles.open]: open
        })}
      >
        <div className={`${styles.menuButtons} container`}>
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <Link to="/camps">Camps</Link>
                <Link to="/icons">Icons</Link>
                <Link to="/themes">Themes</Link>
                <Link to="/about">About the project</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Menu;
