import React, { useMemo } from "react";
import styles from "./ThemesCircles.module.scss";
import { pack, hierarchy } from "d3-hierarchy";
import useDimensions from "react-use-dimensions";

export default function ThemesCircles({ themes = [] }) {
  const [ref, { x, y, width, height }] = useDimensions({ liveMeasure: false });

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
              className={styles.circle}
              cx={theme.x}
              cy={theme.y}
              r={theme.r}
            ></circle>
            <text className={styles.label} x={theme.x} y={theme.y}>
              {theme.data.name}
            </text>
          </g>
        ))}
    </svg>
  );
}
