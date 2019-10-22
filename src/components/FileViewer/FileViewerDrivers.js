import React from "react";
import ReactPlayer from "react-player";
import ZoomAndPanMedia from "../ZoomAndPanMedia";
import PdfViewer from "../PdfViewer";
import FallbackPreview from "../FallbackPreview";
import AudioPlayer from "../AudioPlayer";
import styles from "./FileViewer.module.scss";
import { proxyDevUrl } from "../../utils";

export const DriverImage = ({ item, zoom, alt }) => {
  return zoom ? (
    <ZoomAndPanMedia src={item.file_urls.original}></ZoomAndPanMedia>
  ) : (
    <img
      className={styles.image}
      src={
        item.file_urls.fullsize
          ? item.file_urls.fullsize
          : item.file_urls.original
      }
      alt={alt}
    />
  );
};

export const DriverPdf = ({ item, zoom, alt }) => {
  return zoom ? (
    <PdfViewer
      file={{
        url: item.file_urls.original
      }}
    />
  ) : item.file_urls.fullsize ? (
    <img className={styles.image} src={item.file_urls.fullsize} alt={alt} />
  ) : (
    <FallbackPreview mimetype={item.mime_type} size="3rem"></FallbackPreview>
  );
};

export const DriverAudio = ({ item, alt }) => {
  console.log("driveraudio", item);
  return (
    <div>
      <AudioPlayer
        audioFile={proxyDevUrl(item.file_urls.original)}
        title={alt}
      />
    </div>
  );
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
