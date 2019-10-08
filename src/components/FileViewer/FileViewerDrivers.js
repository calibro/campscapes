import React from "react";
import ReactPlayer from "react-player";
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
  return (
    <div className={styles.playerWrapper}>
      <ReactPlayer
        url={item.file_urls.original}
        width="100%"
        height="100%"
        className={styles.reactPlayer}
        controls
      />
    </div>
  );
};
