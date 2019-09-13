import React, { useContext } from "react";
import { CampsContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import Menu from "../../components/Menu";
import CampsMap from "../../components/CampsMap";
import styles from "./Camps.module.scss";

const Camps = () => {
  const camps = useContext(CampsContext);

  return (
    <div className={styles.campsContainer}>
      <Menu></Menu>
      {camps.length > 0 && <CampsMap camps={camps}></CampsMap>}
      <div className="container">
        <div className="row align-items-baseline">
          <div className="col-12 col-md-3">
            <h1>Camps</h1>
          </div>
          <div className="col-12 col-md-9">
            <p>
              Nullam quis risus eget urna mollis ornare vel eu leo. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Vivamus sagittis
              lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis
              consectetur purus sit amet fermentum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camps;
