import React from "react";
import ReactPlayer from "react-player";
import ZoomAndPanMedia from "../ZoomAndPanMedia";
import PdfViewer from "../PdfViewer";
import styles from "./FileViewer.module.scss";

export const DriverImage = ({ item, zoom }) => {
  return zoom ? (
    <ZoomAndPanMedia src={item.file_urls.original}></ZoomAndPanMedia>
  ) : (
    <img className={styles.image} src={item.file_urls.original} alt={"doc"} />
  );
};

export const DriverPdf = ({ item }) => {
  return <PdfViewer file={item.file_urls.original} />;
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
