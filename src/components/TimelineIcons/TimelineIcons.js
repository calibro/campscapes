import React, { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import LinesEllipsis from "react-lines-ellipsis";
import styles from "./TimelineIcons.module.scss";

const TimelineIcons = ({ camp }) => {
  const icons = camp.relations.objects.sort((a, b) => {
    return (
      new Date(a.data.startDate).getTime() -
      new Date(b.data.startDate).getTime()
    );
  });
  return (
    <div className="row">
      <div className="col-3">
        <h1 className={styles.name}>
          <Link to={`/camps/${camp.data.siteName}`}>{camp.data.siteName}</Link>
        </h1>
        <div className={styles.metadata}>
          <h5>country</h5>
          <p>{camp.data.country}</p>
        </div>
        <div className={styles.metadata}>
          <h5>inception date</h5>
          <p>{camp.data.inceptionDate}</p>
        </div>
      </div>
      <div className="col-9">
        {icons.map(icon => {
          return (
            <div className="w-100 postion-relative" key={icon.id}>
              <div className={styles.iconContainer}>
                <div className={styles.iconImage}>
                  <img
                    className={styles.image}
                    src={icon.data.files[0].file_urls.original}
                    alt={icon.data.title}
                  ></img>
                </div>
                <div className={styles.iconTitle}>
                  <LinesEllipsis
                    text={icon.data.timelineLabel}
                    maxLine="1"
                    ellipsis="..."
                    trimRight
                    basedOn="letters"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineIcons;
