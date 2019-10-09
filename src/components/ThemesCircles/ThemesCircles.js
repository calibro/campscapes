import React, { useMemo, useState, useEffect } from "react";
import styles from "./ThemesCircles.module.scss";
import { pack, hierarchy } from "d3-hierarchy";
import useDimensions from "react-use-dimensions";
import classNames from "classnames";
import ThemesCirclesLabel from "../ThemesCirclesLabel";

const ThemesCircles = ({ themes = [], setSelected, selected }) => {
  const [ref, { width, height }] = useDimensions({ liveMeasure: false });

  const themeClick = theme => {
    if (selected === theme.data.name) {
      setSelected(null);
    } else {
      setSelected(theme.data.name);
    }
  };

  const packGenerator = useMemo(() => {
    return pack()
      .size([width, height])
      .padding(20);
  }, [height, width]);

  const packedThemes = useMemo(() => {
    const root = hierarchy({ name: "root", children: themes }).sum(
      d => d.stories && d.stories.length
    );
    return packGenerator(root)
      .descendants()
      .filter(node => node.depth === 1 && node.r);
  }, [packGenerator, themes]);

  return (
    <svg ref={ref} className={styles.ThemesCircles}>
      {packedThemes.length > 0 &&
        packedThemes.map(theme => (
          <g key={theme.data.name}>
            <circle
              className={classNames(styles.circle, {
                [styles.active]: theme.data.name === selected
              })}
              cx={theme.x}
              cy={theme.y}
              r={theme.r}
              onClick={() => themeClick(theme)}
            ></circle>
            <ThemesCirclesLabel theme={theme} />
          </g>
        ))}
    </svg>
  );
};

export default ThemesCircles;
