import React, { useMemo, useState } from "react";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import { scaleSqrt } from "d3-scale";
import { min, max } from "d3-array";
import {
  ForceGraph,
  InteractiveForceGraph,
  ForceGraphNode,
  ForceGraphLink
} from "react-vis-force";
import { ZoomContainer } from "reactochart";
import NodeRenderer from "./NodeRenderer";
import styles from "./CampNetwork.module.scss";

const CampNetworkUber = ({ annotatedGraph, width, height }) => {
  const [nodeHover, setNodeHover] = useState(null);

  const setOpacityLink = link => {
    const neighbors = nodeHover.neighbors.map(d => {
      if (nodeHover.data.itemType === "story") {
        return nodeHover.id + "_node_" + d;
      } else {
        return "node_" + d + "_" + nodeHover.id;
      }
    });
    return neighbors.includes(link.source + "_" + link.target) ? 1 : 0;
  };

  const setOpacityNode = node => {
    const neighbors = nodeHover.neighbors.map(d => "node_" + d);
    return node.id === nodeHover.id
      ? 1
      : neighbors.includes(node.id)
      ? 1
      : 0.25;
  };

  const nodeScale = useMemo(() => {
    if (!annotatedGraph.nodes) {
      return;
    }
    const degrees = annotatedGraph.nodes
      .filter(item => item.data.itemType !== "story")
      .map(item => item.inDegree);
    const minDegree = min(degrees);
    const maxDegree = max(degrees);

    return scaleSqrt()
      .domain([minDegree, maxDegree])
      .range([5, 20]);
  }, [annotatedGraph]);

  const links = useMemo(() => {
    const bySt = groupBy(
      annotatedGraph.links,
      item => `${item.source}_${item.target}`
    );

    return Object.values(bySt).map(k => ({
      //...k[0],
      source: "node_" + k[0].source,
      target: "node_" + k[0].target,
      value: k.length
    }));
  }, [annotatedGraph.links]);

  const nodes = useMemo(() => {
    if (!nodeScale) {
      return null;
    }

    const formattedNodes = annotatedGraph.nodes.map(node => ({
      data: node.data,
      neighbors: node.neighbors,
      id: "node_" + node.id,
      radius: node.inDegree ? nodeScale(node.inDegree) : 20
    }));
    // FIXME: sorting nodes: story should be the latest
    return sortBy(formattedNodes, [d => d.data.itemType]);
  }, [annotatedGraph.nodes, nodeScale]);

  //console.log(nodes, links, width, height);
  return (
    nodes &&
    links &&
    height &&
    width && (
      <ZoomContainer width={width} height={height}>
        <ForceGraph
          simulationOptions={{
            strength: {
              charge: -150
            },
            animate: true,
            height: height,
            width: width,
            radiusMargin: 10
          }}
        >
          {/*{nodes.map(node => {
            return (
              <CustomNode
                key={node.id}
                node={node}
                fill={nodeHover && nodeHover.id === node.id ? "red" : "white"}
                onMouseOver={() => {
                  console.log(node);
                  setNodeHover(node);
                }}
                onMouseOut={() => {
                  setNodeHover(null);
                }}
              />
            );
          })}*/}
          {nodes.map(node => {
            return (
              <NodeRenderer
                key={node.id}
                node={node}
                fill={"#101012"}
                onMouseOver={() => {
                  setNodeHover(node);
                }}
                onMouseOut={() => {
                  setNodeHover(null);
                }}
                opacity={nodeHover ? setOpacityNode(node) : 1}
              />
            );
          })}
          {links.map(link => {
            return (
              <ForceGraphLink
                key={link.source + link.target}
                link={link}
                opacity={nodeHover ? setOpacityLink(link) : 0}
              />
            );
          })}
        </ForceGraph>
      </ZoomContainer>
    )
  );
};

export default CampNetworkUber;
