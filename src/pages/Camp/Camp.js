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
import CampMap from "../../components/CampMap";
import Menu from "../../components/Menu";
import TimelineIconsCamp from "../../components/TimelineIconsCamp";
import TimelineAxis from "../../components/TimelineAxis";
import styles from "./Camp.module.scss";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide
} from "d3-force";

const CampNet = ({ height = 600, width = 600, annotatedGraph }) => {
  const [hoverNode, setHoverNode] = useState(null);

  const d3Graph = useMemo(() => {
    const outGraph = cloneDeep(annotatedGraph);
    if (!outGraph.nodes || !outGraph.links) {
      return null;
    }
    forceSimulation(outGraph.nodes)
      .force("link", forceLink(outGraph.links).id(d => d.id))
      .force("charge", forceManyBody())
      .force("center", forceCenter(width / 2, height / 2))
      .tick(10)
      .stop();

    return outGraph;
  }, [annotatedGraph, height, width]);

  const nodeScale = useMemo(() => {
    if (!d3Graph.nodes) {
      return;
    }
    console.log("xxx", d3Graph.nodes);
    const degrees = d3Graph.nodes
      .filter(item => item.data.itemType !== "story")
      .map(item => item.degree);
    const minDegree = min(degrees);
    const maxDegree = max(degrees);

    return scaleLinear()
      .domain([minDegree, maxDegree])
      .range([4, 10]);
  }, [d3Graph]);

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
              fill: node.data.itemType === "story" ? "turquoise" : "hotpink"
            }}
          ></circle>
          <text fill="#fff" x={node.x} y={node.y}>
            {node.id}
          </text>
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

  const camp = useMemo(() => {
    return find(camps, item => item.data.siteName === params.name);
  }, [camps, params.name]);

  console.log(123, camp, get(camp, "storiesNetwork"));

  const timelineDomainMin = useMemo(() => {
    return min(camp ? camp.relations.icon : [], icon =>
      min([new Date(icon.data.startDate), new Date(camp.data.inceptionDate)])
    );
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
