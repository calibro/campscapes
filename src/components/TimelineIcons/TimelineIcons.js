import React from "react";
import { Link, withRouter } from "react-router-dom";
import TimelineStripes from "../../components/TimelineStripes";
import FallbackPreview from "../../components/FallbackPreview";
import styles from "./TimelineIcons.module.scss";

const LABEL_LIMIT = 75;

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

  const makeIconContainerStyle = startDate => {
    if (scale(startDate) > LABEL_LIMIT) {
      const translateX = `calc(${styles.iconsWidth} / 2)`;
      return {
        marginRight: `calc(100% - ${scale(startDate)}%)`,
        transform: `translateX(calc(${styles.iconsWidth} / 2))`,
        justifyContent: "flex-end",
        textAlign: "right"
      };
    } else {
      return {
        marginLeft: `${scale(startDate)}%`,
        transform: `translateX(calc(-${styles.iconsWidth} / 2))`,
        textAlign: "left"
      };
    }
  };

  return (
    <div className="row">
      <div className="col-12 col-md-3">
        <h2 className={styles.name}>
          <Link to={`/camps/${camp.data.siteName}`}>{camp.data.siteName}</Link>
        </h2>
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
          style={{ left: `${scale(new Date(camp.data.inceptionDate))}%` }}
        ></div>
        {icons.map((icon, i) => {
          return (
            <div className="w-100 position-relative" key={icon.id + "_" + i}>
              <div
                className={styles.iconContainer}
                style={makeIconContainerStyle(icon.data.startDate)}
              >
                <div
                  className={`${
                    scale(icon.data.startDate) > LABEL_LIMIT
                      ? "order-1"
                      : "order-0"
                  } ${styles.iconImage}`}
                >
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
                <div
                  className={`${
                    scale(icon.data.startDate) > LABEL_LIMIT
                      ? "order-0"
                      : "order-1"
                  } ${styles.iconTitle}`}
                >
                  <p className={styles.desc}>
                    <Link
                      to={{
                        pathname: `/icons/${icon.id}`,
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
