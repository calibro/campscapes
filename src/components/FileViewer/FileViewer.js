import React from "react";
import {
  DriverPdf,
  DriverImage,
  DriverVideo,
  DriverAudio
} from "./FileViewerDrivers";

const FileViewer = ({ item }) => {
  const mime_type = item.mime_type;

  const renderSwitch = mime_type => {
    switch (mime_type) {
      case "image/jpeg":
        return <DriverImage item={item}></DriverImage>;
      case "image/png":
        return <DriverImage item={item}></DriverImage>;
      case "application/pdf":
        return <DriverPdf item={item}></DriverPdf>;
      case "audio/mpeg":
        return <DriverAudio item={item}></DriverAudio>;
      case "video/mp4":
        return <DriverVideo item={item}></DriverVideo>;
      default:
        return <div>Missing mime type {mime_type}</div>;
    }
  };
  return renderSwitch(mime_type);
};

export default FileViewer;