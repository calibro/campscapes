import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.titleContainer}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className={styles.title}>Accessing Campscapes</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.topContainer}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p className={styles.explore}>Explore</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="text-center">
                <Link className={styles.pageLink} to={`/camps`}>
                  Camps
                </Link>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="text-center">
                <Link className={styles.pageLink} to={`/icons`}>
                  Icons
                </Link>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="text-center">
                <Link className={styles.pageLink} to={`/themes`}>
                  Themes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p className={styles.about}>
                <Link to={`/about`}>About the project</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
