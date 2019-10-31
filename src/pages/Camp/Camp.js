import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
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
import { Graph as D3Graph } from "react-d3-graph";

const CampNet = ({ height = 600, width = 600, annotatedGraph }) => {
  const [hoverNode, setHoverNode] = useState(null);
  const [nodesAndLinks, setNodesAndLinks] = useState({});

  const nodeScale = useMemo(() => {
    if (!annotatedGraph.nodes) {
      return;
    }
    const degrees = annotatedGraph.nodes
      .filter(item => item.data.itemType !== "story")
      .map(item => item.degree);
    const minDegree = min(degrees);
    const maxDegree = max(degrees);

    return scaleLinear()
      .domain([minDegree, maxDegree])
      .range([6, 12]);
  }, [annotatedGraph]);

  const myConfig = {
    automaticRearrangeAfterDropNode: true,
    collapsible: false,
    directed: false,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    height: 400,
    highlightDegree: 1,
    highlightOpacity: 1,
    linkHighlightBehavior: false,
    maxZoom: 8,
    minZoom: 0.1,
    nodeHighlightBehavior: false,
    panAndZoom: false,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: 800,
    d3: {
      alphaTarget: 0.05,
      gravity: -100,
      linkLength: 100,
      linkStrength: 1
    },
    node: {
      color: "#d3d3d3",
      fontColor: "black",
      fontSize: 8,
      fontWeight: "normal",
      highlightColor: "SAME",
      highlightFontSize: 8,
      highlightFontWeight: "normal",
      highlightStrokeColor: "SAME",
      highlightStrokeWidth: "SAME",
      labelProperty: "id",
      mouseCursor: "pointer",
      opacity: 1,
      renderLabel: true,
      size: 200,
      strokeColor: "none",
      strokeWidth: 1.5,
      svg: "",
      symbolType: "circle"
    },
    link: {
      color: "#d3d3d3",
      fontColor: "black",
      fontSize: 8,
      fontWeight: "normal",
      highlightColor: "#d3d3d3",
      highlightFontSize: 8,
      highlightFontWeight: "normal",
      labelProperty: "label",
      mouseCursor: "pointer",
      opacity: 1,
      renderLabel: false,
      semanticStrokeWidth: false,
      strokeWidth: 1.5
    }
  };
  console.log("annotatedGraph", annotatedGraph);
  return (
    annotatedGraph && (
      <D3Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={cloneDeep({ nodes: annotatedGraph.nodes, links: [] })}
        config={myConfig}
        // onClickNode={onClickNode}
        // onRightClickNode={onRightClickNode}
        // onClickGraph={onClickGraph}
        // onClickLink={onClickLink}
        // onRightClickLink={onRightClickLink}
        // onMouseOverNode={onMouseOverNode}
        // onMouseOutNode={onMouseOutNode}
        // onMouseOverLink={onMouseOverLink}
        // onMouseOutLink={onMouseOutLink}
        // onNodePositionChange={onNodePositionChange}
      />
    )
  );

  // const simulation = useRef(null);

  // useEffect(() => {
  //   if (simulation.current) {
  //     simulation.current.stop();
  //   }
  //   const outGraph = cloneDeep(annotatedGraph);
  //   if (!outGraph.nodes || !outGraph.links) {
  //     return;
  //   }

  //   // Custom force to put all nodes in a box
  //   function boxingForce() {
  //     outGraph.nodes.forEach(node => {
  //       node.x = max([min([node.x, width - 30]), 30]);
  //       node.y = max([min([node.y, height - 30]), 30]);
  //     });
  //   }

  //   simulation.current = forceSimulation(outGraph.nodes)
  //     .force(
  //       "charge",
  //       forceManyBody().strength(-30)
  //       // .distanceMax(120)
  //     )
  //     .force("link", forceLink(outGraph.links).id(d => d.id))
  //     .force(
  //       "collide",
  //       forceCollide(node =>
  //         get(node, "data.itemType") === "story"
  //           ? 40
  //           : nodeScale(node.degree) * 4
  //       ).iterations(3)
  //     )
  //     .force("center", forceCenter(width / 2, height / 2))
  //     .force("box", boxingForce)
  //     .on("tick", () => {
  //       const { links, nodes } = outGraph;
  //       setNodesAndLinks({ nodes, links });
  //     });
  // }, [annotatedGraph, height, nodeScale, width]);

  // return (
  //   <svg height={height} width={width}>
  //     {nodesAndLinks.nodes && (
  //       <>
  //         {nodesAndLinks.links.map((link, i) => (
  //           <line
  //             key={i}
  //             x1={link.source.x}
  //             y1={link.source.y}
  //             x2={link.target.x}
  //             y2={link.target.y}
  //             stroke="#fff"
  //           ></line>
  //         ))}
  //         {nodesAndLinks.nodes.map(node => (
  //           <g key={node.id}>
  //             <circle
  //               onMouseEnter={() => {
  //                 setHoverNode(node.id);
  //               }}
  //               cx={node.x}
  //               cy={node.y}
  //               r={
  //                 get(node, "data.itemType") === "story"
  //                   ? "4"
  //                   : nodeScale(node.degree)
  //               }
  //               style={{
  //                 fill: node.data.itemType === "story" ? "#c82727" : "#fff"
  //               }}
  //             ></circle>
  //             {/* <text fill="#fff" x={node.x} y={node.y}>
  //           {node.id}
  //         </text> */}
  //           </g>
  //         ))}
  //       </>
  //     )}
  //   </svg>
  // );
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
          <div className="text-center container">
            <div className={styles.networkContainer} ref={ref}>
              {annotatedGraph && (
                <CampNet
                  width={width}
                  height={700}
                  annotatedGraph={annotatedGraph}
                ></CampNet>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Camp;
