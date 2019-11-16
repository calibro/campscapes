import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { HomeImagesContext } from "../../dataProviders";
import OnlyDesktop from "../../components/OnlyDesktop";
import IntroPictures from "../../components/IntroPictures";
import styles from "./Home.module.scss";

const Home = () => {
  const introImages = useContext(HomeImagesContext);

  return (
    <div className={styles.homeContainer}>
      <OnlyDesktop></OnlyDesktop>
      {introImages.length > 0 && (
        <IntroPictures pictures={introImages} index={0} steps={1} />
      )}
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
              <p className={styles.about}>
                <Link to={`/publications`}>Publications</Link>
              </p>
              <p className={styles.about}>
                <Link to={`/educational`}>Educational</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
