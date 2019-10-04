import React from "react";
import { Link } from "react-router-dom";
import TimelineStripes from "../../components/TimelineStripes";
import styles from "./TimelineIconsCamp.module.scss";

const TimelineIcons = ({ camp, scale, setSelectedIcon }) => {
  const icons = camp.relations.icon
    .sort((a, b) => {
      return (
        new Date(a.data.startDate).getTime() -
        new Date(b.data.startDate).getTime()
      );
    })
    .map(d => {
      d.data.startDate = d.data.startDate ? new Date(d.data.startDate) : null;
      return d;
    });

  return (
    <div className="row">
      <div className="col-12 d-flex">
        <div className={styles.cont}>
          <div
            className={styles.inceptionLine}
            style={{ left: `${scale(camp.data.inceptionDate)}%` }}
          ></div>
          {icons.map(icon => {
            return (
              <div
                className="position-absolute"
                key={icon.id}
                style={{ left: `${scale(icon.data.startDate)}%` }}
              >
                <div
                  className={styles.iconContainer}
                  onMouseOver={e => {
                    //console.log(e);
                    setSelectedIcon(icon);
                  }}
                  onMouseOut={() => setSelectedIcon(null)}
                >
                  <div className={styles.iconImage}>
                    {/* fix this */}
                    {icon.data.files[0].mime_type !== "video/mp4" ? (
                      <img
                        className={styles.image}
                        src={icon.data.files[0].file_urls.original}
                        alt={icon.data.title}
                      ></img>
                    ) : (
                      <div className={styles.image}></div>
                    )}
                  </div>
                  {/*<div className={styles.iconTitle}>
                  <p className={styles.desc}>{icon.data.timelineLabel}</p>
                  <p className={styles.desc}>
                  {icon.data.startDate
                  ? icon.data.startDate.getFullYear()
                  : "undefined"}
                  </p>
                  </div>*/}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineIcons;
