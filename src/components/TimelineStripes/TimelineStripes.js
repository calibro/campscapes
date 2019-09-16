import React from "react";
import styles from "./TimelineStripes.module.scss";

const TimelineStripes = ({ scale }) => {
  const stripes = scale.ticks();
  const ml = scale(stripes[0]);
  return (
    <div className={styles.stripes}>
      {stripes.map((stripe, i) => {
        const width =
          i < stripes.length - 1
            ? scale(stripes[i + 1]) - scale(stripe)
            : scale.range()[1] - scale(stripe);
        return (
          <div
            key={i}
            className={styles.stripe}
            style={{
              flex: `0 0 ${width}%`,
              marginLeft: i === 0 ? ml + "%" : 0
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default TimelineStripes;
