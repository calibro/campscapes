import React from "react";
import { Link, withRouter } from "react-router-dom";
import TimelineStripes from "../../components/TimelineStripes";
import FallbackPreview from "../../components/FallbackPreview";
import styles from "./TimelineIconsCamp.module.scss";

const TimelineIcons = ({ camp, scale, setSelectedIcon, location }) => {
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
                <Link
                  to={{
                    pathname: `/icons/${icon.id}`,
                    state: { from: location.pathname }
                  }}
                >
                  <div
                    className={styles.iconContainer}
                    onMouseOver={e => {
                      if (icon.data.latitude && icon.data.longitude) {
                        setSelectedIcon(icon);
                      }
                    }}
                    onMouseOut={() => setSelectedIcon(null)}
                  >
                    <div className={styles.iconImage}>
                      {icon.data.files[0].file_urls.square_thumbnail ? (
                        <img
                          className={styles.image}
                          src={icon.data.files[0].file_urls.square_thumbnail}
                          alt={icon.data.title}
                        ></img>
                      ) : (
                        <div className={styles.itemFallback}>
                          <FallbackPreview
                            mimetype={icon.data.files[0].mime_type}
                            color="black"
                            size="1.3rem"
                          ></FallbackPreview>
                        </div>
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
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default withRouter(TimelineIcons);
