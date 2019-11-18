import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import useDimensions from "react-use-dimensions";
import { CampsContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import { MdArrowBack, MdLayers } from "react-icons/md";
import find from "lodash/find";
import omit from "lodash/omit";
import groupBy from "lodash/groupBy";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { scaleTime, scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import Graph from "graphology";
import CampMap from "../../components/CampMap";
import Menu from "../../components/Menu";
import TimelineIconsCamp from "../../components/TimelineIconsCamp";
import TimelineAxis from "../../components/TimelineAxis";
import DdLayers from "../../components/DdLayers";
import OnlyDesktop from "../../components/OnlyDesktop";
import CampNetwork from "../../components/CampNetwork";
import styles from "./Camp.module.scss";

const Camp = ({ match }) => {
  const camps = useContext(CampsContext);

  const { params } = match;
  const [selectedIcon, setSelectedIcon] = useState(null);

  const [yearVector, setYearVector] = useState("none");
  const [yearRaster, setYearRaster] = useState("none");
  const [opacity, setOpacity] = useState(1);

  const handleOnOpacityChange = e => setOpacity(+e.target.value);

  const camp = useMemo(() => {
    return find(camps, item => item.data.siteName === params.name);
  }, [camps, params.name]);

  const timelineDomainMin = useMemo(() => {
    if (camp && camp.relations.icon) {
      return min(camp.relations.icon, icon =>
        min([new Date(icon.data.startDate), new Date(camp.data.inceptionDate)])
      );
    } else {
      return null;
    }
  }, [camp]);

  const vectorLayers = useMemo(() => {
    if (camp && camp.relations.geolayer_vector) {
      return camp.relations.geolayer_vector
        .filter(l => {
          return l.data.startDate && l.data.files && l.data.files.length > 0;
        })
        .map(l => {
          const startDate = new Date(l.data.startDate);
          return {
            url: l.data.files[0].file_urls.original,
            year: startDate.getFullYear()
          };
        });
    } else {
      return [];
    }
  }, [camp]);

  const rasterLayers = useMemo(() => {
    if (camp && camp.relations.geolayer_raster) {
      return camp.relations.geolayer_raster
        .filter(l => {
          return (
            l.data.startDate &&
            l.data.boundingbox &&
            l.data.files &&
            l.data.files.length > 0
          );
        })
        .map(l => {
          const startDate = new Date(l.data.startDate);
          return {
            url: l.data.files[0].file_urls.original,
            boundingbox: JSON.parse("[" + l.data.boundingbox + "]"),
            year: startDate.getFullYear()
          };
        });
    } else {
      return [];
    }
  }, [camp]);

  const campGraph = useMemo(() => {
    if (!camp || !camp.storiesNetwork) {
      return null;
    }
    const graph = new Graph({ multi: true });
    const nodes = camp.storiesNetwork.nodes.map(node => {
      return {
        key: node.id,
        attributes: omit(node, "id")
      };
    });

    graph.import({
      attributes: { name: "camp graph" },
      nodes: nodes,
      edges: cloneDeep(camp.storiesNetwork.links)
    });
    return graph;
  }, [camp]);

  const annotatedGraph = useMemo(() => {
    if (!campGraph) {
      return null;
    }
    const nodes = campGraph.nodes().map(node => {
      return {
        id: +node,
        data: campGraph.getNodeAttributes(node),
        inDegree: campGraph.inDegree(node),
        neighbors: campGraph.neighbors(node)
      };
    });
    const links = cloneDeep(camp.storiesNetwork.links);
    return { nodes, links };
  }, [camp, campGraph]);

  const [ref, { width, height }] = useDimensions({ liveMeasure: false });

  const timelineScale = scaleTime()
    .domain([timelineDomainMin, Date.now()])
    .range([0, 100]);

  return (
    <div className={styles.campContainer}>
      <OnlyDesktop></OnlyDesktop>
      <Menu></Menu>
      {camp && (
        <React.Fragment>
          <div className={styles.topContainer}>
            <CampMap
              camp={camp}
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
              yearRaster={yearRaster}
              yearVector={yearVector}
              vectorLayers={vectorLayers}
              rasterLayers={rasterLayers}
              opacity={opacity}
            ></CampMap>
            <div className={styles.titleWrapper}>
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
          </div>
          <div className={styles.ddContainer}>
            <div className={styles.vertLogo}>
              <MdLayers
                style={{ color: "var(--red-cs)" }}
                size="20px"
              ></MdLayers>
            </div>
            <div className="container">
              <div className="row">
                {vectorLayers.length > 0 && (
                  <div className="col-auto">
                    <div className={styles.dropdown}>
                      <span className={styles.dropdownLabel}>
                        Buildings footprints
                      </span>
                      <DdLayers
                        year={yearVector}
                        setYear={setYearVector}
                        layers={vectorLayers}
                      ></DdLayers>
                    </div>
                  </div>
                )}
                {rasterLayers.length > 0 && (
                  <div className="col-auto">
                    <div className={styles.dropdown}>
                      <span className={styles.dropdownLabel}>Aerial view</span>
                      <DdLayers
                        year={yearRaster}
                        setYear={setYearRaster}
                        layers={rasterLayers}
                      ></DdLayers>
                      {yearRaster !== "none" && (
                        <div className="d-flex align-items-center ml-3">
                          <span className="mr-3">opacity</span>
                          <input
                            onChange={handleOnOpacityChange}
                            value={opacity}
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.iconsContainer}>
            <div className={styles.vertLabel}>
              <h6>icons</h6>
            </div>
            <div className="container">
              <TimelineIconsCamp
                camp={camp}
                scale={timelineScale}
                selectedIcon={selectedIcon}
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
                    <div className={styles.descriptionContainer}>
                      <div className="overflow-auto">
                        <p className={styles.description}>
                          {camp.data.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {annotatedGraph && annotatedGraph.nodes.length > 0 && (
            <div className={styles.networkContainer}>
              <div className="flex-grow-0 flex-shrink-0">
                <div className="container">
                  <div className="row">
                    <div className="col-12 pt-2">
                      <div className={styles.metadata}>
                        <h6>stories network</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="flex-grow-1 flex-shrink-1 position-relative"
                ref={ref}
              >
                {width && height && (
                  <CampNetwork
                    annotatedGraph={annotatedGraph}
                    width={width}
                    height={height}
                  ></CampNetwork>
                )}
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Camp;
