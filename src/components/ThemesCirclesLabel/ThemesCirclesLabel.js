import React from "react";
import useDimensions from "react-use-dimensions";
import styles from "./ThemesCirclesLabel.module.scss";

const ThemesCirclesLabel = ({ theme }) => {
  const [ref, { width, height }] = useDimensions({ liveMeasure: false });
  const backgroundWidth = width + 4;
  return (
    <React.Fragment>
      {width && height && (
        <rect
          className={styles.background}
          x={theme.x - backgroundWidth / 2}
          y={theme.y - height / 2}
          width={backgroundWidth}
          height={height}
          rx="3"
        ></rect>
      )}
      <text ref={ref} className={styles.label} x={theme.x} y={theme.y}>
        {theme.data.name}
      </text>
    </React.Fragment>
  );
};

export default ThemesCirclesLabel;
