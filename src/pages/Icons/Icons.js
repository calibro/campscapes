import React, { useContext, useMemo } from "react";
import { CampsContext } from "../../dataProviders";
import { SimplePagesContext } from "../../dataProviders";
import { scaleTime } from "d3-scale";
import { min } from "d3-array";
import TimelineAxis from "../../components/TimelineAxis";
import Menu from "../../components/Menu";
import TimelineIcons from "../../components/TimelineIcons";
import OnlyDesktop from "../../components/OnlyDesktop";
import styles from "./Icons.module.scss";
import get from "lodash/get";
import find from "lodash/find";

const Icons = () => {
  const simplePages = useContext(SimplePagesContext);
  const page = useMemo(() => {
    return find(simplePages, item => item.slug === "icons");
  }, [simplePages]);

  const pageText = get(page, "text");

  const campsAll = useContext(CampsContext);

  const camps = useMemo(() => {
    if (!campsAll) {
      return [];
    }
    return campsAll.filter(d => d.relations.icon);
  }, [campsAll]);

  const timelineDomainMin = useMemo(() => {
    if (!camps) {
      return null;
    }
    return min(camps, camp => {
      return min(camp.relations.icon, icon =>
        min([new Date(icon.data.startDate), new Date(camp.data.inceptionDate)])
      );
    });
  }, [camps]);

  const timelineScale = useMemo(() => {
    if (!timelineDomainMin) {
      return null;
    }
    return scaleTime()
      .domain([timelineDomainMin, Date.now()])
      .range([0, 100]);
  }, [timelineDomainMin]);

  return (
    <div className={styles.iconsContainer}>
      <OnlyDesktop></OnlyDesktop>
      <Menu></Menu>
      <div className="container">
        <div className="row align-items-baseline">
          <div className="col-12 col-md-3">
            <h1>Icons</h1>
          </div>
          <div className="col-12 col-md-9">
            {pageText && (
              <div dangerouslySetInnerHTML={{ __html: pageText }}></div>
            )}
          </div>
        </div>
        <div className={`row ${styles.stickyAxis}`}>
          <div className="col-3 d-flex align-items-center">
            <h6 className={styles.metadata}>memories timeline</h6>
          </div>
          <div className="col-9">
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
