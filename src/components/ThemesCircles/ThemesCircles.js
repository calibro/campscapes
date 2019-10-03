import React, { useMemo, useState, useEffect } from "react";
import styles from "./ThemesCircles.module.scss";
import { pack, hierarchy } from "d3-hierarchy";
import useDimensions from "react-use-dimensions";
import classNames from "classnames";
import ThemesCirclesLabel from "../ThemesCirclesLabel";

const ThemesCircles = ({ themes = [], setSelected, selected }) => {
  const [ref, { width, height }] = useDimensions({ liveMeasure: false });

  const [themeSelected, setThemeSelected] = useState(null);

  const themeClick = theme => {
    setSelected(theme.data.stories);
    setThemeSelected(prev => {
      if (prev === theme.data.name) {
        return null;
      } else {
        return theme.data.name;
      }
    });
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

  useEffect(() => {
    if (!selected) {
      setThemeSelected(null);
    }
  }, [selected]);

  return (
    <svg ref={ref} className={styles.ThemesCircles}>
      {packedThemes.length > 0 &&
        packedThemes.map(theme => (
          <g key={theme.data.name}>
            <circle
              className={classNames(styles.circle, {
                [styles.active]: theme.data.name === themeSelected
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
