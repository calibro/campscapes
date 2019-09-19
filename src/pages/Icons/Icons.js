import React, { useContext } from "react";
import { CampsContext } from "../../dataProviders";
import { scaleTime } from "d3-scale";
import { min } from "d3-array";
import TimelineAxis from "../../components/TimelineAxis";
import Menu from "../../components/Menu";
import TimelineIcons from "../../components/TimelineIcons";
import styles from "./Icons.module.scss";

const Icons = () => {
  const camps = useContext(CampsContext);
  console.log("camps data", camps);
  const timelineDomainMin = min(camps, camp => {
    return min(camp.relations.icon, icon =>
      min([new Date(icon.data.startDate), new Date(icon.data.inceptionDate)])
    );
  });

  const timelineScale = scaleTime()
    .domain([timelineDomainMin, Date.now()])
    .range([0, 100]);

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
        <div className={`row ${styles.stickyAxis}`}>
          <div className="col-9 offset-3">
            {camps.length > 0 && (
              <TimelineAxis scale={timelineScale}></TimelineAxis>
            )}
          </div>
          <div className="col-12">
            <div className="border-bottom w-100"></div>
          </div>
        </div>
        {camps.length > 0 &&
          camps.map(camp => {
            return (
              <TimelineIcons
                key={camp.id}
                camp={camp}
                scale={timelineScale}
              ></TimelineIcons>
            );
          })}
      </div>
    </div>
  );
};

export default Icons;
