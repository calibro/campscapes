import React from "react";
import classNames from "classnames";
import styles from "./TimelineAxis.module.scss";

const TimelineAxis = ({ scale }) => {
  const ticks = scale.ticks();
  console.log(ticks);
  return (
    <div className={styles.ticks}>
      {ticks.map((tick, i) => {
        return (
          <div
            key={i}
            className={styles.tick}
            style={{ left: `${scale(tick)}%` }}
          >
            {tick.getFullYear()}
          </div>
        );
      })}
    </div>
  );
};

export default TimelineAxis;
