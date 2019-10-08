import React from "react";
import styles from "./FileViewer.module.scss";

export const DriverImage = ({ item }) => {
  return (
    <img className={styles.image} src={item.file_urls.original} alt={"doc"} />
  );
};

export const DriverPdf = ({ item }) => {
  return <div>pdf</div>;
};

export const DriverAudio = ({ item }) => {
  return <div>audio</div>;
};

export const DriverVideo = ({ item }) => {
  return <div>video</div>;
};
