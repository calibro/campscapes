import React, { useContext, useMemo } from "react";
import { CampsContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import find from "lodash/find";
import CampMap from "../../components/CampMap";
import Menu from "../../components/Menu";
import styles from "./Camp.module.scss";

const Camp = ({ match }) => {
  const camps = useContext(CampsContext);

  const { params } = match;

  const camp = useMemo(() => {
    return find(camps, item => item.data.siteName === params.name);
  }, [camps, params.name]);

  console.log("camp data", camp);

  return (
    <div className={styles.campContainer}>
      <Menu></Menu>
      {camp && (
        <React.Fragment>
          <div className={styles.topContainer}>
            <CampMap camp={camp}></CampMap>
            <div className="container">
              <div className="row">
                <div className="col-auto">
                  <h1 className={styles.title}>
                    <Link to="/camps">
                      <MdArrowBack color="white" size="2rem"></MdArrowBack>
                    </Link>{" "}
                    {camp.data.siteName}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.iconsContainer}></div>
          <div className={styles.infoContainer}>
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-3">
                  <div className={styles.metadata}>
                    <h6>country</h6>
                    <p>{camp.data.country}</p>
                  </div>
                  <div className={styles.metadata}>
                    <h6>inception date</h6>
                    <p>{new Date(camp.data.inceptionDate).getFullYear()}</p>
                  </div>
                </div>
                <div className="col-12 col-md-9">
                  <div className={styles.metadata}>
                    <h6>about the camp</h6>
                    <p className={styles.description}>
                      {camp.data.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.networkContainer}></div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Camp;
