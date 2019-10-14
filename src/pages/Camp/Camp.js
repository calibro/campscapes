import React, { useContext, useMemo, useState } from "react";
import { CampsContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import find from "lodash/find";
import { scaleTime } from "d3-scale";
import { min } from "d3-array";
import Graph from "graphology";
import CampMap from "../../components/CampMap";
import Menu from "../../components/Menu";
import TimelineIconsCamp from "../../components/TimelineIconsCamp";
import TimelineAxis from "../../components/TimelineAxis";
import styles from "./Camp.module.scss";

const Camp = ({ match }) => {
  const camps = useContext(CampsContext);

  const { params } = match;
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedIconMapPosition, setSelectedIconMapPosition] = useState(null);
  const [
    selectedIconTimelinePosition,
    setSelectedIconTimelinePosition
  ] = useState(null);

  const camp = useMemo(() => {
    return find(camps, item => item.data.siteName === params.name);
  }, [camps, params.name]);

  const timelineDomainMin = useMemo(() => {
    return min(camp ? camp.relations.icon : [], icon =>
      min([new Date(icon.data.startDate), new Date(camp.data.inceptionDate)])
    );
  }, [camp]);

  const graphtest = useMemo(() => {
    if (!camp) {
      return [];
    }
    const graph = new Graph({ multi: true });
    const nodes = camp.storiesNetwork.nodes.map(node => {
      return {
        key: node.id
      };
    });

    graph.import({
      attributes: { name: "My Graph" },
      nodes: nodes,
      edges: camp.storiesNetwork.links
    });
    console.log(graph);
    return [];
  }, [camp]);

  const timelineScale = scaleTime()
    .domain([timelineDomainMin, Date.now()])
    .range([0, 100]);

  return (
    <div className={styles.campContainer}>
      <Menu></Menu>
      {camp && (
        <React.Fragment>
          <div className={styles.topContainer}>
            <CampMap camp={camp} selectedIcon={selectedIcon}></CampMap>
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
          <div className={styles.iconsContainer}>
            <div className="container">
              <TimelineIconsCamp
                camp={camp}
                scale={timelineScale}
                setSelectedIcon={setSelectedIcon}
              ></TimelineIconsCamp>
              <div className="row">
                <div className="col-12">
                  <TimelineAxis scale={timelineScale}></TimelineAxis>
                </div>
              </div>
            </div>
          </div>
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
