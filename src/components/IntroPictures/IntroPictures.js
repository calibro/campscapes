import React, { useState, useMemo } from "react";
import classNames from "classnames";
import { useSpring, useTransition, animated } from "react-spring";
import { chunk, shuffle, sampleSize, random, range } from "lodash";
import { UncontrolledTooltip } from "reactstrap";
import styles from "./IntroPictures.module.scss";

const MAX_LAYOUTS = 5;
const PICTURES_PER_LAYOUT = 9;
const CALC = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const TRANSITION = (x, y, indexPicture) => {
  return `translate3d(${x / (50 / (indexPicture + 1))}px,${y /
    (50 / (indexPicture + 1))}px,0)`;
};

const IntroPictures = ({ pictures, index, steps }) => {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 }
  }));

  const grids = useMemo(() => {
    if (pictures.length) {
      const stepsArray = Array.from(Array(steps).keys());
      const picturesChunk = chunk(pictures, PICTURES_PER_LAYOUT);
      const out = stepsArray.map((step, i) => {
        const layout = i + 1 > MAX_LAYOUTS ? random(1, 5) : i + 1;
        let stepPictures = picturesChunk[i] ? picturesChunk[i] : [];
        while (stepPictures.length < 9) {
          const newPictures = sampleSize(pictures, 9 - stepPictures.length);
          stepPictures = stepPictures.concat(newPictures);
        }
        return { layout: layout, pictures: shuffle(stepPictures) };
      });
      return out;
    } else {
      return [];
    }
  }, [pictures, steps]);
  return (
    <div
      className={styles.introPicturesContainer}
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: CALC(x, y) })}
    >
      <div className={styles.gridwrap}>
        {grids &&
          grids.map((grid, i) => {
            return (
              <div
                key={i}
                className={`${styles.grid} ${
                  styles["grid--layout-" + grid.layout]
                }`}
              >
                {grid.pictures.map((picture, indexPicture) => {
                  return (
                    <div
                      key={picture.id}
                      className={classNames(styles["grid__item"], {
                        [styles.open]: i === index,
                        [styles.out]: i > index
                      })}
                    >
                      <animated.div
                        className={styles.picture}
                        style={{
                          backgroundImage: `url(${picture.file_urls.thumbnail})`,
                          transform: props.xy.interpolate((x, y) =>
                            TRANSITION(x, y, indexPicture)
                          )
                        }}
                      >
                        <p className={styles.pictureTitle}>
                          {picture.original_filename}
                        </p>
                      </animated.div>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default IntroPictures;
