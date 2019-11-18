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
import { MdZoomIn, MdZoomOut, MdYoutubeSearchedFor } from "react-icons/md";
import { ZoomContainer } from "reactochart";
import NodeRenderer from "./NodeRenderer";
import styles from "./CampNetwork.module.scss";

function getNewZoomProps(
  newZoomScale,
  oldZoomScale,
  oldZoomX,
  oldZoomY,
  width,
  height
) {
  return {
    zoomX: width / 2 - (newZoomScale / oldZoomScale) * (width / 2 - oldZoomX),
    zoomY: height / 2 - (newZoomScale / oldZoomScale) * (height / 2 - oldZoomY),
    zoomScale: newZoomScale
  };
}

const CampNetwork = ({ annotatedGraph, width, height }) => {
  const [nodeHover, setNodeHover] = useState(null);
  const [zoomTransform, setZoomTransform] = useState({ k: 1, x: 0, y: 0 });
  const [zoomX, setZoomX] = useState(0);
  const [zoomY, setZoomY] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);

  const handleZoom = nextZoomTransform => {
    if (!nextZoomTransform) return;
    setZoomX(nextZoomTransform.x);
    setZoomY(nextZoomTransform.y);
    setZoomScale(nextZoomTransform.k);
  };
  const handleClickZoomIn = () => {
    const newZoomScale = zoomScale * 1.25;
    const newZoomProps = getNewZoomProps(
      newZoomScale,
      zoomScale,
      zoomX,
      zoomY,
      width,
      height
    );
    console.log(newZoomScale, newZoomProps);
    setZoomX(newZoomProps.x);
    setZoomY(newZoomProps.y);
    setZoomScale(newZoomProps.k);
  };

  const handleClickZoomOut = () => {
    const newZoomScale = zoomScale / 1.25;
    const newZoomProps = getNewZoomProps(
      newZoomScale,
      zoomScale,
      zoomX,
      zoomY,
      width,
      height
    );
    setZoomX(newZoomProps.x);
    setZoomY(newZoomProps.y);
    setZoomScale(newZoomProps.k);
  };

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

  return (
    nodes &&
    links &&
    height &&
    width && (
      <React.Fragment>
        <div className={styles.zoomControls}>
          <div className="btn-group-vertical" role="group">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                handleClickZoomOut();
              }}
            >
              <MdZoomOut size="1.4rem"></MdZoomOut>
            </button>
            <button type="button" className="btn btn-light">
              <MdYoutubeSearchedFor size="1.4rem"></MdYoutubeSearchedFor>
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                handleClickZoomIn();
              }}
            >
              <MdZoomIn size="1.4rem"></MdZoomIn>
            </button>
          </div>
        </div>
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
            className={styles.svgNetwork}
          >
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
      </React.Fragment>
    )
  );
};

export default CampNetwork;
