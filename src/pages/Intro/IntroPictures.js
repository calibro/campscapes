import React, { useRef, useEffect, useState, useMemo } from "react";
import useDimensions from "react-use-dimensions";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide
} from "d3-force";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import { min, max } from "d3-array";
import styles from "./Intro.module.scss";

export default function IntroPictures({ pictures = [] }) {
  const [ref, { width, height }] = useDimensions({ liveMeasure: false });
  const [renderNodes, setRenderNodes] = useState(null);

  const nodes = useMemo(() => {
    return pictures
      .map(picture => ({
        id: picture.id,
        data: {
          width: get(picture, "metadata.video.resolution_x"),
          heigth: get(picture, "metadata.video.resolution_y"),
          url: get(picture, "file_urls.original")
        }
      }))
      .concat([
        {
          id: "centerleft",
          fx: width / 2 - 200,
          fy: height / 2,
          fixed: true
        },
        {
          id: "centerright",
          fx: width / 2 + 200,
          fy: height / 2,
          fixed: true
        }
      ]);
  }, [height, pictures, width]);

  const simulation = useRef(null);

  useEffect(() => {
    if (simulation.current) {
      simulation.current.stop();
    }

    const nodesCloned = cloneDeep(nodes);

    // Custom force to put all nodes in a box
    function boxingForce() {
      nodesCloned.forEach(node => {
        node.x = max([min([node.x + 100, width]) - 100, 100]);
        node.y = max([min([node.y + 100, height]) - 100, 100]);
      });
    }

    simulation.current = forceSimulation(nodesCloned)
      .force("charge", forceManyBody().strength(-1))
      .force(
        "collide",
        forceCollide(node => (node.fixed ? 140 : 170)).iterations(3)
      )
      .force("center", forceCenter(width / 2, height / 2))
      .force("box", boxingForce)
      .alphaDecay(0.2)
      .velocityDecay(0.5)
      .on("end", () => {
        setRenderNodes(nodesCloned);
      })
      .tick(200);
  }, [width, height, nodes]);

  return (
    <div className="w-100 h-100" ref={ref}>
      {renderNodes &&
        renderNodes.map(node => (
          <React.Fragment key={node.id}>
            {node.data && (
              <div
                className={`position-absolute ${styles.pictureContainer}`}
                style={{ left: node.x - 100, top: node.y - 100 }}
              >
                <img
                  className={styles.picture}
                  src={node.data.url}
                  alt={"image"}
                ></img>
              </div>
            )}
          </React.Fragment>
        ))}
    </div>
  );
}
