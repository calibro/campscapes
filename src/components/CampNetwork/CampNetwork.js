import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import useDimensions from "react-use-dimensions";
import { Link } from "react-router-dom";
import find from "lodash/find";
import omit from "lodash/omit";
import groupBy from "lodash/groupBy";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { scaleTime, scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import { Graph } from "react-d3-graph";
import styles from "./CampNetwork.module.scss";

const CampNetwork = ({ annotatedGraph, width, height }) => {
  const nodeScale = useMemo(() => {
    if (!annotatedGraph.nodes) {
      return;
    }
    const degrees = annotatedGraph.nodes
      .filter(item => item.data.itemType !== "story")
      .map(item => item.inDegree);
    const minDegree = min(degrees);
    const maxDegree = max(degrees);

    return scaleLinear()
      .domain([minDegree, maxDegree])
      .range([400, 1000]);
  }, [annotatedGraph]);

  const links = useMemo(() => {
    const bySt = groupBy(
      annotatedGraph.links,
      item => `${item.source}_${item.target}`
    );

    return Object.values(bySt).map(k => ({
      //...k[0],
      source: "node_" + k[0].source,
      target: "node_" + k[0].target
      //value: k.length
    }));
  }, [annotatedGraph.links]);

  const nodes = useMemo(() => {
    if (!nodeScale) {
      return null;
    }
    return annotatedGraph.nodes.map(node => ({
      //...node,
      id: "node_" + node.id,
      size: node.inDegree ? nodeScale(node.inDegree) : 200
    }));
  }, [annotatedGraph.nodes, nodeScale]);

  const graphConfig = useMemo(() => {
    if (!width || !height) {
      return null;
    }
    return {
      directed: true,
      automaticRearrangeAfterDropNode: false,
      focusAnimationDuration: 0.2,
      linkHighlightBehavior: true,
      nodeHighlightBehavior: true,
      highlightOpacity: 0.5,
      width: width,
      height: height,
      d3: {
        gravity: -250,
        linkLength: 120
      },
      node: {
        highlightColor: "#ff6600",
        highlightStrokeColor: "#ff6600",
        highlightFontWeight: "bold",
        fontSize: 14,
        highlightFontSize: 14
      },
      link: {
        highlightColor: "#ff6600",
        strokeWidth: 3
      }
    };
  }, [width, height]);

  //console.log(nodes, links, width, height);
  return (
    nodes &&
    links &&
    graphConfig &&
    height &&
    width && (
      <Graph
        id="ciao"
        data={{ nodes: nodes, links: links }}
        config={graphConfig}
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

export default CampNetwork;
