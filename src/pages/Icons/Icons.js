import React, { useContext } from "react";
import { CampsContext } from "../../dataProviders";
import Menu from "../../components/Menu";
import TimelineIcons from "../../components/TimelineIcons";
import styles from "./Icons.module.scss";

const Icons = () => {
  const camps = useContext(CampsContext);
  console.log("camps data", camps);

  return (
    <div className={styles.iconsContainer}>
      <Menu></Menu>
      <div className="container">
        <div className="row align-items-baseline">
          <div className="col-12 col-md-3">
            <h1>Icons</h1>
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
        {camps.length > 0 &&
          camps.map(camp => {
            return <TimelineIcons key={camp.id} camp={camp}></TimelineIcons>;
          })}
        <div className="row"></div>
      </div>
    </div>
  );
};

export default Icons;
