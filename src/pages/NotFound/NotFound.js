import React from "react";
import Menu from "../../components/Menu";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <Menu></Menu>
      <div className="container">
        <div className="row align-items-baseline">
          <div className="col-12">
            <h1>Page Not Found</h1>
            <p>
              go back to <Link to="/home">home page</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
