import React from "react";
import { Link, withRouter } from "react-router-dom";
import TimelineStripes from "../../components/TimelineStripes";
import styles from "./TimelineIcons.module.scss";

const TimelineIcons = ({ camp, scale, location }) => {
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
      <div className="col-12 col-md-3">
        <h1 className={styles.name}>
          <Link to={`/camps/${camp.data.siteName}`}>{camp.data.siteName}</Link>
        </h1>
        <div className={styles.metadata}>
          <h6>country</h6>
          <p>{camp.data.country}</p>
        </div>
        <div className={styles.metadata}>
          <h6>inception date</h6>
          <p>{new Date(camp.data.inceptionDate).getFullYear()}</p>
        </div>
      </div>
      <div className="col-12 col-md-9">
        <TimelineStripes scale={scale}></TimelineStripes>
        <div
          className={styles.inceptionLine}
          style={{ left: `${scale(camp.data.inceptionDate)}%` }}
        ></div>
        {icons.map(icon => {
          return (
            <div className="w-100 position-relative" key={icon.id}>
              <div
                className={styles.iconContainer}
                style={{ marginLeft: `${scale(icon.data.startDate)}%` }}
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
                <div className={styles.iconTitle}>
                  <p className={styles.desc}>
                    <Link
                      to={{
                        pathname: `/icons/${icon.data.timelineLabel}`,
                        state: { from: location.pathname }
                      }}
                    >
                      {icon.data.timelineLabel}
                    </Link>
                  </p>
                  <p className={styles.desc}>
                    {icon.data.startDate
                      ? icon.data.startDate.getFullYear()
                      : "undefined"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="col-12">
        <div className="border-bottom w-100"></div>
      </div>
    </div>
  );
};

export default withRouter(TimelineIcons);
