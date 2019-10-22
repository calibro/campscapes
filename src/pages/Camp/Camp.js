import React, { useContext, useMemo, useState } from "react";
import useDimensions from "react-use-dimensions";
import { CampsContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import find from "lodash/find";
import omit from "lodash/omit";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { scaleTime, scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import Graph from "graphology";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide
} from "d3-force";
import CampMap from "../../components/CampMap";
import Menu from "../../components/Menu";
import TimelineIconsCamp from "../../components/TimelineIconsCamp";
import TimelineAxis from "../../components/TimelineAxis";
import DdLayers from "../../components/DdLayers";
import styles from "./Camp.module.scss";

const CampNet = ({ height = 600, width = 600, annotatedGraph }) => {
  const [hoverNode, setHoverNode] = useState(null);

  const nodeScale = useMemo(() => {
    if (!annotatedGraph.nodes) {
      return;
    }
    console.log("xxx", annotatedGraph.nodes);
    const degrees = annotatedGraph.nodes
      .filter(item => item.data.itemType !== "story")
      .map(item => item.degree);
    const minDegree = min(degrees);
    const maxDegree = max(degrees);

    return scaleLinear()
      .domain([minDegree, maxDegree])
      .range([4, 10]);
  }, [annotatedGraph]);

  const d3Graph = useMemo(() => {
    if (!nodeScale) {
      return null;
    }
    const outGraph = cloneDeep(annotatedGraph);
    if (!outGraph.nodes || !outGraph.links) {
      return null;
    }
    forceSimulation(outGraph.nodes)
      .force("link", forceLink(outGraph.links).id(d => d.id))
      .force("charge", forceManyBody().strength(-20))
      .force(
        "collide",
        forceCollide(node =>
          get(node, "data.itemType") === "story"
            ? 8
            : nodeScale(node.degree) * 2
        ).iterations(3)
      )
      .force("center", forceCenter(width / 2, height / 2))
      .tick(30)
      .stop();

    return outGraph;
  }, [annotatedGraph, height, width, nodeScale]);

  if (!d3Graph) {
    return null;
  }

  return (
    <svg height={height} width={width} className={"border"}>
      {d3Graph.links.map((link, i) => (
        <line
          key={i}
          x1={link.source.x}
          y1={link.source.y}
          x2={link.target.x}
          y2={link.target.y}
          stroke="#fff"
        ></line>
      ))}
      {d3Graph.nodes.map(node => (
        <g key={node.id}>
          <circle
            onMouseEnter={() => {
              setHoverNode(node.id);
            }}
            cx={node.x}
            cy={node.y}
            r={
              get(node, "data.itemType") === "story"
                ? "4"
                : nodeScale(node.degree)
            }
            style={{
              fill: node.data.itemType === "story" ? "#c82727" : "#fff"
            }}
          ></circle>
          {/* <text fill="#fff" x={node.x} y={node.y}>
            {node.id}
          </text> */}
        </g>
      ))}
    </svg>
  );
};

const Camp = ({ match }) => {
  const camps = useContext(CampsContext);

  const { params } = match;
  const [selectedIcon, setSelectedIcon] = useState(null);
  // const [selectedIconMapPosition, setSelectedIconMapPosition] = useState(null);
  // const [
  //   selectedIconTimelinePosition,
  //   setSelectedIconTimelinePosition
  // ] = useState(null);

  const [yearVector, setYearVector] = useState("none");
  const [yearRaster, setYearRaster] = useState("none");
  const [opacity, setOpacity] = useState(1);

  const handleOnOpacityChange = e => setOpacity(+e.target.value);

  const camp = useMemo(() => {
    return find(camps, item => item.data.siteName === params.name);
  }, [camps, params.name]);

  const timelineDomainMin = useMemo(() => {
    return min(camp ? camp.relations.icon : [], icon =>
      min([new Date(icon.data.startDate), new Date(camp.data.inceptionDate)])
    );
  }, [camp]);

  const vectorLayers = useMemo(() => {
    if (camp) {
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
    }
  }, [camp]);

  const rasterLayers = useMemo(() => {
    if (camp) {
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
      attributes: { name: "a graph" },
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
        degree: campGraph.degree(node),
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
      <Menu></Menu>
      {camp && (
        <React.Fragment>
          <div className={styles.topContainer}>
            <CampMap
              camp={camp}
              selectedIcon={selectedIcon}
              yearRaster={yearRaster}
              yearVector={yearVector}
              vectorLayers={vectorLayers}
              rasterLayers={rasterLayers}
              opacity={opacity}
            ></CampMap>
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
          <div className={styles.ddContainer}>
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
                    <div className={styles.descriptionContainer}>
                      <p className={styles.description}>
                        {camp.data.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.networkContainer} ref={ref}>
            {annotatedGraph && (
              <CampNet
                width={width}
                height={600}
                annotatedGraph={annotatedGraph}
              ></CampNet>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Camp;
