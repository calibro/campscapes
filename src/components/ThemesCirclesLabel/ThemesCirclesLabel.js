import React from "react";
import useDimensions from "react-use-dimensions";
import styles from "./ThemesCirclesLabel.module.scss";

const ThemesCirclesLabel = ({ theme }) => {
  const [ref, { width, height }] = useDimensions({ liveMeasure: false });

  return (
    <React.Fragment>
      {width && height && (
        <rect
          className={styles.background}
          x={theme.x - width / 2}
          y={theme.y - height / 2}
          width={width}
          height={height}
        ></rect>
      )}
      <text ref={ref} className={styles.label} x={theme.x} y={theme.y}>
        {theme.data.name}
      </text>
    </React.Fragment>
  );
};

export default ThemesCirclesLabel;
